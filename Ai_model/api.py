"""
╔══════════════════════════════════════════════════════════════════╗
║         CARGO X-RAY INSPECTOR — FASTAPI BACKEND                 ║
║  Wraps demo.py logic for React frontend connection               ║
║  Place this file in the SAME folder as demo.py                  ║
╚══════════════════════════════════════════════════════════════════╝

Install:
    pip install fastapi uvicorn python-multipart pillow

Run:
    python api.py
    → Runs on http://localhost:8000
    → Swagger docs at http://localhost:8000/docs

React fetch example:
    const res  = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,          // FormData with key "file"
    });
    const data = await res.json();
"""

# ──────────────────────────────────────────────────────────────────
# IMPORTS
# ──────────────────────────────────────────────────────────────────
import io
import base64
import os
import csv
import json
from PIL import Image

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth, firestore

# ── Import all logic from demo.py (same folder) ──────────────────
from demo import (
    analyze_image,
    compare_images,
    load_scan_stats,
    MODEL_PATH,
    model,
)


# ──────────────────────────────────────────────────────────────────
# APP SETUP
# ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Cargo X-Ray Inspector API",
    description="YOLOv8s fine-tuned on PIDray — 12 prohibited item categories",
    version="1.0.0",
)

# ── CORS — allow React dev server (adjust origins in production) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # ← change to your React URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────────────────────────
# FIREBASE BACKEND ACCESS CONTROL
# ──────────────────────────────────────────────────────────────────
try:
    if not firebase_admin._apps:
        if os.path.exists("serviceAccountKey.json"):
            cred = credentials.Certificate("serviceAccountKey.json")
            firebase_admin.initialize_app(cred)
        else:
            print("WARNING: serviceAccountKey.json not found. Token checking is in bypass mode.")
            firebase_admin.initialize_app()
except Exception as e:
    print("Warning: Firebase Init failed:", e)

security = HTTPBearer()

def get_current_user(auth_creds: HTTPAuthorizationCredentials = Depends(security)):
    token = auth_creds.credentials
    if not os.path.exists("serviceAccountKey.json"):
        return {"uid": "mock-admin", "role": "admin"}
        
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        
        # Enforce role-based access at backend level
        db = firestore.client()
        user_doc = db.collection("users").document(uid).get()
        found_role = None
        if user_doc.exists:
            found_role = user_doc.to_dict().get("role")
        else:
            for col_name in ["inspector", "admin", "analyst", "auditor"]:
                fallback_doc = db.collection(col_name).document(uid).get()
                if fallback_doc.exists:
                    found_role = fallback_doc.to_dict().get("role")
                    break
        
        decoded_token["role"] = found_role.lower() if found_role else "auditor"
            
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Unauthorized: {str(e)}")

def require_action_role(user: dict = Depends(get_current_user)):
    role = user.get("role", "auditor")
    if role in ["auditor", "analyst"]:
        raise HTTPException(status_code=403, detail="Forbidden: Interventions restricted.")
    return user

# ──────────────────────────────────────────────────────────────────
# HELPER — Convert PIL Image → base64 string for JSON transport
# ──────────────────────────────────────────────────────────────────
def pil_to_b64(image: Image.Image | None) -> str | None:
    """Returns a base64-encoded JPEG string, or None if image is None."""
    if image is None:
        return None
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=90)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def read_upload(file_bytes: bytes) -> Image.Image:
    """Convert raw uploaded bytes → PIL Image (RGB)."""
    return Image.open(io.BytesIO(file_bytes)).convert("RGB")


# ──────────────────────────────────────────────────────────────────
# ENDPOINT 1 — Health Check
# GET /api/health
# ──────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health_check():
    """
    Quick sanity check. React can ping this on load to confirm
    the backend and model are ready.
    """
    return {
        "status": "ok",
        "model_loaded": True,
        "model_path": MODEL_PATH,
        "classes": list(model.names.values()),
    }


# ──────────────────────────────────────────────────────────────────
# ENDPOINT 2 — Threat Analysis
# POST /api/analyze
#
# Body (multipart/form-data):
#   file         : image file  (required)
#   conf         : float 0–1   (optional, default 0.25)
#   iou          : float 0–1   (optional, default 0.45)
#
# Returns JSON:
#   preprocessed_image  : base64 JPEG string
#   detected_image      : base64 JPEG string
#   heatmap_image       : base64 JPEG string
#   preprocessing_text  : string
#   risk_summary        : string
#   reasoning           : string
# ──────────────────────────────────────────────────────────────────
@app.post("/api/analyze")
async def analyze(
    file: UploadFile = File(...),
    conf: float = 0.25,
    iou:  float = 0.45,
    user: dict = Depends(require_action_role)
):
    # ── Validate file type ───────────────────────────────────────
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/bmp"):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {file.content_type}. Send JPEG, PNG, WEBP, or BMP.",
        )

    # ── Read + convert ───────────────────────────────────────────
    raw   = await file.read()
    img   = read_upload(raw)

    # ── Run the full pipeline (same function as demo.py Tab 1) ───
    pre_img, det_img, hm_img, pre_txt, risk_txt, reasoning_txt = analyze_image(
        img, conf_threshold=conf, iou_threshold=iou
    )

    response_data = {
        "preprocessed_image": pil_to_b64(pre_img),
        "detected_image":     pil_to_b64(det_img),
        "heatmap_image":      pil_to_b64(hm_img),
        "preprocessing_text": pre_txt,
        "risk_summary":       risk_txt,
        "reasoning":          reasoning_txt,
    }

    # ── Save full payload to JSON ────────────────────────────────
    os.makedirs("scan_records", exist_ok=True)
    try:
        if os.path.exists("scan_log.csv"):
            with open("scan_log.csv", "r", encoding="utf-8") as f:
                lines = f.readlines()
                scan_idx = len(lines) - 1
        else:
            scan_idx = 1
        scan_id = f"SCAN-{scan_idx:04d}"
        
        with open(f"scan_records/{scan_id}.json", "w", encoding="utf-8") as json_f:
            json.dump(response_data, json_f)
    except Exception as e:
        print("Failed to save scan record:", e)

    return JSONResponse(response_data)


# ──────────────────────────────────────────────────────────────────
# ENDPOINT 3 — Cargo Comparison (Tampering Detection)
# POST /api/compare
#
# Body (multipart/form-data):
#   file_a  : image file  (required) — Reference scan
#   file_b  : image file  (required) — Comparison scan
#   conf    : float 0–1   (optional, default 0.25)
#
# Returns JSON:
#   scan_a_image    : base64 JPEG string
#   scan_b_image    : base64 JPEG string
#   diff_map_image  : base64 JPEG string
#   report          : string
# ──────────────────────────────────────────────────────────────────
@app.post("/api/compare")
async def compare(
    file_a: UploadFile = File(...),
    file_b: UploadFile = File(...),
    conf:   float = 0.25,
    user: dict = Depends(require_action_role)
):
    allowed = ("image/jpeg", "image/png", "image/webp", "image/bmp")
    for f in (file_a, file_b):
        if f.content_type not in allowed:
            raise HTTPException(
                status_code=415,
                detail=f"Unsupported file type: {f.content_type}",
            )

    img_a = read_upload(await file_a.read())
    img_b = read_upload(await file_b.read())

    ann_a, ann_b, diff_img, report_txt = compare_images(
        img_a, img_b, conf_threshold=conf
    )

    return JSONResponse({
        "scan_a_image":   pil_to_b64(ann_a),
        "scan_b_image":   pil_to_b64(ann_b),
        "diff_map_image": pil_to_b64(diff_img),
        "report":         report_txt,
    })


# ──────────────────────────────────────────────────────────────────
# ENDPOINT 4 — Scan Statistics
# GET /api/stats
#
# Returns JSON:
#   stats : string (formatted statistics from scan_log.csv)
# ──────────────────────────────────────────────────────────────────
@app.get("/api/stats")
def stats(user: dict = Depends(get_current_user)):
    """Returns session scan statistics read from scan_log.csv."""
    return {"stats": load_scan_stats()}


# ──────────────────────────────────────────────────────────────────
# ENDPOINT 5 — Raw Scan History
# GET /api/history
# ──────────────────────────────────────────────────────────────────
@app.get("/api/history")
def history(user: dict = Depends(get_current_user)):
    """Returns the raw scan history from scan_log.csv."""
    if not os.path.exists("scan_log.csv"):
        return {"history": []}
        
    rows = []
    with open("scan_log.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            # parse columns: "Timestamp", "Detections", "Risk Score", "Decision", "Item Count"
            try:
                score = float(row.get("Risk Score", 0))
            except ValueError:
                score = 0
                
            if score >= 80:
                color = "accent-red"
                status_short = "FLAGGED"
            elif score >= 60:
                color = "accent-amber"
                status_short = "MANUAL CHECK"
            elif score >= 35:
                color = "accent-amber"
                status_short = "ADVISORY"
            else:
                color = "accent-cyan"
                status_short = "CLEARED"
            
            rows.append({
                "id": f"SCAN-{i+1:04d}",
                "timestamp": row.get("Timestamp", ""),
                "node": "MAIN_HUB",
                "type": (row.get("Detections", "None") or "None")[:30], 
                "value": str(row.get("Item Count", "0")) + " items",  # fallback for value
                "risk": score,
                "status": status_short,
                "color": color,
                "raw_decision": row.get("Decision", "")
            })
    # Return newest first
    return {"history": rows[::-1]}

# ──────────────────────────────────────────────────────────────────
# ENDPOINT 6 — Scan Detail View
# GET /api/history/{scan_id}
# ──────────────────────────────────────────────────────────────────
@app.get("/api/history/{scan_id}")
def get_history_detail(scan_id: str, user: dict = Depends(get_current_user)):
    """Returns the full JSON payload for a given scan."""
    filepath = f"scan_records/{scan_id}.json"
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Scan record not found")
        
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

# ──────────────────────────────────────────────────────────────────
# LAUNCH
# ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=False,       # set True during development for auto-reload
    )