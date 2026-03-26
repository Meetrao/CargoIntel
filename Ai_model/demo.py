"""
╔══════════════════════════════════════════════════════════════════╗
║           CARGO X-RAY INSPECTOR — CUSTOMS AI SYSTEM             ║
║  YOLOv8s fine-tuned on PIDray | CIIBS Hackathon 2025            ║
╚══════════════════════════════════════════════════════════════════╝

Capabilities:
  ✅ Image Preprocessing & Enhancement
  ✅ Object Detection with Bounding Boxes
  ✅ Object Classification (Prohibited / Restricted / Dual-Use)
  ✅ Heatmap over Suspicious Regions
  ✅ Confidence Score & Risk Score (0–100)
  ✅ Inference Reasoning & Officer Recommendation
  ✅ Image Comparison (Manifest Tampering Detection)
  ✅ Analyst Dashboard Interface
  ✅ Scan Audit Log (CSV — auto-saved per scan)
  ✅ Statistics Dashboard Tab
"""

# ──────────────────────────────────────────────────────────────────
# IMPORTS
# ──────────────────────────────────────────────────────────────────
import gradio as gr
from ultralytics import YOLO
import numpy as np
from PIL import Image
import cv2
import csv
import os
from datetime import datetime
from pathlib import Path
from collections import Counter


# ──────────────────────────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────────────────────────

# ⚠️ SWAP THIS after training finishes:
# MODEL_PATH = "yolov8s.pt"
MODEL_PATH = r"C:\Users\44184\runs\detect\pidray_v32\weights\best.pt"

DEFAULT_CONF   = 0.10
DEFAULT_IOU    = 0.45
HEATMAP_ALPHA  = 0.45
DIFF_THRESHOLD = 30

# Scan log CSV path — saved in same folder as demo.py
SCAN_LOG_PATH  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scan_log.csv")


# ──────────────────────────────────────────────────────────────────
# MODEL LOAD
# ──────────────────────────────────────────────────────────────────
print(f"[INFO] Loading model: {MODEL_PATH}")
model = YOLO(MODEL_PATH)
print(f"[INFO] Model loaded. Classes: {list(model.names.values())}")


# ──────────────────────────────────────────────────────────────────
# THREAT INTELLIGENCE DATABASE
# ──────────────────────────────────────────────────────────────────
THREAT_DB = {
    "Gun": {
        "level": "CRITICAL", "score": 100,
        "color_bgr": (0, 0, 220),
        "reason": (
            "Firearm detected. Strictly prohibited under international "
            "cargo and aviation security law. Immediate cargo detention "
            "and law enforcement notification required."
        ),
    },
    "Bullet": {
        "level": "CRITICAL", "score": 95,
        "color_bgr": (0, 0, 200),
        "reason": (
            "Live ammunition detected. Prohibited under IATA DGR and "
            "customs regulations. Cargo must be secured and flagged "
            "for law enforcement review."
        ),
    },
    "Knife": {
        "level": "HIGH", "score": 80,
        "color_bgr": (0, 80, 220),
        "reason": (
            "Bladed weapon detected. Classified as prohibited assault "
            "item in cargo screening. Manual inspection and shipper "
            "declaration verification required."
        ),
    },
    "Baton": {
        "level": "HIGH", "score": 75,
        "color_bgr": (0, 100, 210),
        "reason": (
            "Impact weapon detected. Restricted item under customs "
            "regulations. Requires officer inspection and authorization "
            "documentation from shipper."
        ),
    },
    "HandCuffs": {
        "level": "MEDIUM", "score": 55,
        "color_bgr": (0, 180, 220),
        "reason": (
            "Restraint device detected. Requires valid declaration and "
            "authorization. Cross-check with cargo manifest."
        ),
    },
    "Scissors": {
        "level": "MEDIUM", "score": 45,
        "color_bgr": (0, 200, 200),
        "reason": (
            "Sharp implement detected. Dual-use item flagged for manual "
            "inspection. Verify declared purpose and packaging compliance."
        ),
    },
    "Wrench": {
        "level": "LOW", "score": 30,
        "color_bgr": (0, 200, 80),
        "reason": "Tool detected. Common dual-use item. Log for manifest audit.",
    },
    "Pliers": {
        "level": "LOW", "score": 25,
        "color_bgr": (0, 200, 80),
        "reason": "Tool detected. Low-risk dual-use item. Log for audit trail only.",
    },
    "Hammer": {
        "level": "LOW", "score": 25,
        "color_bgr": (0, 200, 80),
        "reason": "Tool detected. Low-risk dual-use item. Log for audit trail only.",
    },
    "Sprayer": {
        "level": "LOW", "score": 30,
        "color_bgr": (0, 180, 100),
        "reason": (
            "Aerosol/sprayer detected. Potential chemical risk. "
            "Verify contents declaration and hazmat compliance."
        ),
    },
    "Powerbank": {
        "level": "LOW", "score": 20,
        "color_bgr": (0, 200, 120),
        "reason": (
            "High-capacity battery detected. Fire risk per IATA DGR. "
            "Verify watt-hour rating against declared specifications."
        ),
    },
    "Lighter": {
        "level": "LOW", "score": 20,
        "color_bgr": (0, 200, 120),
        "reason": (
            "Ignition device detected. Flammable goods restriction "
            "applies. Verify quantity and packaging compliance."
        ),
    },
}

# Fallback for base yolov8s.pt COCO classes (testing only)
COCO_FALLBACK = {
    "knife":    {"level": "HIGH",     "score": 80,  "color_bgr": (0, 80, 220),  "reason": "Bladed weapon detected."},
    "gun":      {"level": "CRITICAL", "score": 100, "color_bgr": (0, 0, 220),   "reason": "Firearm detected."},
    "scissors": {"level": "MEDIUM",   "score": 45,  "color_bgr": (0, 200, 200), "reason": "Sharp implement detected."},
}

def get_threat(class_name):
    if class_name in THREAT_DB:
        return THREAT_DB[class_name]
    if class_name.lower() in COCO_FALLBACK:
        return COCO_FALLBACK[class_name.lower()]
    return {
        "level": "LOW", "score": 15,
        "color_bgr": (100, 100, 100),
        "reason": f"{class_name} detected. Not in prohibited list — logged for audit.",
    }

def risk_decision(score):
    if score >= 80: return "CRITICAL — DETAIN CARGO IMMEDIATELY"
    if score >= 60: return "HIGH    — FLAG FOR INSPECTION"
    if score >= 35: return "MEDIUM  — MANUAL CHECK REQUIRED"
    return                 "LOW     — CLEARED (Log Only)"

def risk_emoji(score):
    if score >= 80: return "🔴"
    if score >= 60: return "🟠"
    if score >= 35: return "🟡"
    return                 "🟢"


# ──────────────────────────────────────────────────────────────────
# SCAN AUDIT LOG
# ──────────────────────────────────────────────────────────────────
def log_scan(detections, risk_score, decision):
    """
    Appends one row to scan_log.csv for every analysis run.
    Columns: Timestamp | Detections | Risk Score | Decision | Item Count
    """
    file_exists = os.path.exists(SCAN_LOG_PATH)
    with open(SCAN_LOG_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Timestamp", "Detections", "Risk Score", "Decision", "Item Count"])
        detected_names = ", ".join(d["name"] for d in detections) if detections else "None"
        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            detected_names,
            f"{risk_score:.0f}",
            decision,
            len(detections),
        ])


def load_scan_stats():
    """
    Reads scan_log.csv and returns summary statistics string.
    """
    if not os.path.exists(SCAN_LOG_PATH):
        return "No scans logged yet. Run some analyses first."

    rows = []
    with open(SCAN_LOG_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    if not rows:
        return "No scans logged yet."

    total     = len(rows)
    scores    = [float(r["Risk Score"]) for r in rows]
    avg_score = sum(scores) / len(scores)
    critical  = sum(1 for s in scores if s >= 80)
    high      = sum(1 for s in scores if 60 <= s < 80)
    medium    = sum(1 for s in scores if 35 <= s < 60)
    low       = sum(1 for s in scores if s < 35)
    flagged   = critical + high
    flag_pct  = (flagged / total * 100) if total > 0 else 0

    all_items = []
    for r in rows:
        if r["Detections"] != "None":
            all_items.extend([i.strip() for i in r["Detections"].split(",")])
    item_counts = Counter(all_items)
    top_items   = item_counts.most_common(3)

    lines = [
        "SCAN STATISTICS DASHBOARD",
        "=" * 44,
        f"  Total Scans Logged   : {total}",
        f"  Average Risk Score   : {avg_score:.1f} / 100",
        f"  Flagged (HIGH+CRIT)  : {flagged} ({flag_pct:.1f}%)",
        "",
        "  Risk Level Breakdown:",
        f"    🔴 CRITICAL          : {critical} scans",
        f"    🟠 HIGH              : {high} scans",
        f"    🟡 MEDIUM            : {medium} scans",
        f"    🟢 LOW               : {low} scans",
        "",
        "  Most Detected Items:",
    ]
    if top_items:
        for item, count in top_items:
            lines.append(f"    {item:14s}: {count} detection(s)")
    else:
        lines.append("    No items detected yet.")

    lines += [
        "",
        f"  Log File : {SCAN_LOG_PATH}",
        "=" * 44,
    ]
    return "\n".join(lines)


# ──────────────────────────────────────────────────────────────────
# MODULE 1 — IMAGE PREPROCESSING & ENHANCEMENT
# ──────────────────────────────────────────────────────────────────
def preprocess_xray(image_pil):
    img_bgr      = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
    lab          = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    l, a, b      = cv2.split(lab)
    clahe        = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    lab_enhanced = cv2.merge([clahe.apply(l), a, b])
    img_clahe    = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)
    gaussian     = cv2.GaussianBlur(img_clahe, (0, 0), sigmaX=3)
    img_sharp    = cv2.addWeighted(img_clahe, 1.5, gaussian, -0.5, 0)
    lut          = np.array(
        [((i / 255.0) ** (1.0 / 1.2)) * 255 for i in range(256)], dtype=np.uint8
    )
    img_final    = cv2.LUT(img_sharp, lut)
    enhanced_pil = Image.fromarray(cv2.cvtColor(img_final, cv2.COLOR_BGR2RGB))
    report = (
        "PREPROCESSING APPLIED\n"
        "─────────────────────────────────────────\n"
        "1. CLAHE (Contrast Limited Adaptive Histogram Equalisation)\n"
        "   → Enhances local contrast in dense cargo regions\n\n"
        "2. Unsharp Mask  (σ=3, weight=1.5)\n"
        "   → Sharpens weapon outlines and object boundaries\n\n"
        "3. Gamma Correction  (γ=1.2)\n"
        "   → Brightens dark X-ray backgrounds without overexposure"
    )
    return enhanced_pil, report


# ──────────────────────────────────────────────────────────────────
# MODULE 2 — THREAT HEATMAP GENERATOR
# ──────────────────────────────────────────────────────────────────
def generate_heatmap(image_pil, boxes_data):
    img_bgr = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
    h, w    = img_bgr.shape[:2]
    heat    = np.zeros((h, w), dtype=np.float32)
    for box in boxes_data:
        x1, y1, x2, y2 = int(box["x1"]), int(box["y1"]), int(box["x2"]), int(box["y2"])
        cx, cy          = (x1 + x2) // 2, (y1 + y2) // 2
        sx              = max((x2 - x1) / 3, 10)
        sy              = max((y2 - y1) / 3, 10)
        weight          = box["score"] / 100.0
        for gy in range(max(0, y1), min(h, y2)):
            for gx in range(max(0, x1), min(w, x2)):
                heat[gy, gx] += weight * np.exp(
                    -(((gx - cx) ** 2) / (2 * sx ** 2) +
                      ((gy - cy) ** 2) / (2 * sy ** 2))
                )
    if heat.max() > 0:
        heat = (heat / heat.max() * 255).astype(np.uint8)
    else:
        heat = heat.astype(np.uint8)
    heatmap_color = cv2.applyColorMap(heat, cv2.COLORMAP_JET)
    mask          = heat > 10
    overlay       = img_bgr.copy()
    blended       = cv2.addWeighted(img_bgr, 1 - HEATMAP_ALPHA, heatmap_color, HEATMAP_ALPHA, 0)
    overlay[mask] = blended[mask]
    return Image.fromarray(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))


# ──────────────────────────────────────────────────────────────────
# MODULE 3 — MAIN ANALYSIS PIPELINE
# ──────────────────────────────────────────────────────────────────
def get_recommendation(score, detections):
    names = ", ".join(d["name"] for d in detections)
    if score >= 80:
        return (
            f"IMMEDIATE ACTION REQUIRED — {names} detected.\n"
            "  1. Detain cargo. Do NOT release under any circumstances.\n"
            "  2. Notify senior officer and law enforcement immediately.\n"
            "  3. Initiate full physical inspection protocol."
        )
    if score >= 60:
        return (
            f"HIGH PRIORITY FLAG — {names} detected.\n"
            "  1. Assign to manual inspection queue.\n"
            "  2. Cross-check against declared cargo manifest.\n"
            "  3. Request supporting documentation from shipper."
        )
    if score >= 35:
        return (
            f"ADVISORY — Dual-use item(s) found: {names}.\n"
            "  1. Verify declared purpose in manifest.\n"
            "  2. Officer discretion advised.\n"
            "  3. Documentation review recommended."
        )
    return (
        f"LOW RISK — Item(s) logged: {names}.\n"
        "  No immediate action required.\n"
        "  Proceed with standard clearance protocol."
    )


def analyze_image(image_pil, conf_threshold=DEFAULT_CONF, iou_threshold=DEFAULT_IOU):
    if image_pil is None:
        return None, None, None, "No image.", "No image.", "No image."

    enhanced_pil, pre_report = preprocess_xray(image_pil)
    results    = model(np.array(enhanced_pil), conf=conf_threshold, iou=iou_threshold)[0]
    detect_img = Image.fromarray(results.plot())

    if len(results.boxes) == 0:
        decision  = risk_decision(0)
        no_threat = (
            "✅ No suspicious items detected.\n\n"
            "Risk Score : 0 / 100\n"
            f"Decision   : 🟢 {decision}"
        )
        log_scan([], 0, decision)
        return (
            enhanced_pil, detect_img, enhanced_pil,
            pre_report, no_threat,
            "No prohibited or restricted items found.\n"
            "Shipment cleared. No officer action required."
        )

    detections = []
    boxes_data = []
    max_score  = 0.0

    for box in results.boxes:
        name   = model.names[int(box.cls)]
        conf   = float(box.conf)
        xyxy   = box.xyxy[0].tolist()
        threat = get_threat(name)
        wscore = threat["score"] * conf
        detections.append({
            "name": name, "conf": conf,
            "level": threat["level"],
            "score": wscore,
            "reason": threat["reason"],
        })
        boxes_data.append({
            "x1": xyxy[0], "y1": xyxy[1],
            "x2": xyxy[2], "y2": xyxy[3],
            "score": wscore,
            "color_bgr": threat["color_bgr"],
        })
        max_score = max(max_score, wscore)

    detections.sort(key=lambda d: d["score"], reverse=True)
    heatmap_img = generate_heatmap(enhanced_pil, boxes_data)

    emoji    = risk_emoji(max_score)
    decision = risk_decision(max_score)

    summary = [f"⚠️  {len(detections)} ITEM(S) DETECTED", "─" * 42]
    for d in detections:
        summary.append(f"  {d['level']:8s} | {d['name']:12s} | {d['conf']:.1%} confidence")
    summary += [
        "─" * 42,
        f"Risk Score : {max_score:.0f} / 100",
        f"Decision   : {emoji} {decision}",
    ]

    reasoning = ["INFERENCE REASONING", "=" * 42]
    for i, d in enumerate(detections, 1):
        reasoning.append(
            f"\n[{i}] {d['name']}  |  {d['level']}  |  {d['conf']:.1%} confidence\n"
            f"    Risk Score : {d['score']:.0f}/100\n"
            f"    Reason     : {d['reason']}"
        )
    reasoning += [
        "\n" + "─" * 42,
        "OFFICER RECOMMENDATION:",
        get_recommendation(max_score, detections),
    ]

    # ── Log this scan to CSV ──
    log_scan(detections, max_score, decision)

    return (
        enhanced_pil, detect_img, heatmap_img,
        pre_report,
        "\n".join(summary),
        "\n".join(reasoning),
    )


# ──────────────────────────────────────────────────────────────────
# MODULE 4 — IMAGE COMPARISON PIPELINE
# ──────────────────────────────────────────────────────────────────
def compare_images(img_a_pil, img_b_pil, conf_threshold=DEFAULT_CONF):
    if img_a_pil is None or img_b_pil is None:
        return None, None, None, "Upload both images to compare."

    enh_a, _ = preprocess_xray(img_a_pil)
    enh_b, _ = preprocess_xray(img_b_pil)
    arr_a    = np.array(enh_a)
    arr_b    = cv2.resize(np.array(enh_b), (arr_a.shape[1], arr_a.shape[0]))

    res_a = model(arr_a, conf=conf_threshold)[0]
    res_b = model(arr_b, conf=conf_threshold)[0]
    ann_a = Image.fromarray(res_a.plot())
    ann_b = Image.fromarray(res_b.plot())

    gray_a    = cv2.cvtColor(arr_a, cv2.COLOR_RGB2GRAY)
    gray_b    = cv2.cvtColor(arr_b, cv2.COLOR_RGB2GRAY)
    diff      = cv2.absdiff(gray_a, gray_b)
    _, thr    = cv2.threshold(diff, DIFF_THRESHOLD, 255, cv2.THRESH_BINARY)
    diff_heat = cv2.applyColorMap(cv2.GaussianBlur(thr, (21, 21), 0), cv2.COLORMAP_HOT)
    diff_pil  = Image.fromarray(
        cv2.cvtColor(
            cv2.addWeighted(cv2.cvtColor(arr_a, cv2.COLOR_RGB2BGR), 0.6, diff_heat, 0.4, 0),
            cv2.COLOR_BGR2RGB
        )
    )

    names_a       = {res_a.names[int(b.cls)] for b in res_a.boxes}
    names_b       = {res_b.names[int(b.cls)] for b in res_b.boxes}
    new_items     = names_b - names_a
    missing_items = names_a - names_b
    common_items  = names_a & names_b
    risk_flag     = bool(new_items or missing_items)

    lines = [
        "CARGO COMPARISON REPORT", "=" * 42,
        f"Scan A : {len(res_a.boxes)} item(s)  —  {', '.join(names_a) or 'None'}",
        f"Scan B : {len(res_b.boxes)} item(s)  —  {', '.join(names_b) or 'None'}",
        "",
    ]
    if new_items:
        lines.append(f"⚠️  NEW in Scan B (undeclared) : {', '.join(new_items)}")
    if missing_items:
        lines.append(f"❌  MISSING from Scan B        : {', '.join(missing_items)}")
    if common_items:
        lines.append(f"✅  Consistent in both scans   : {', '.join(common_items)}")
    if not risk_flag:
        lines.append("✅  No item differences detected between scans.")
    lines += [
        "", "─" * 42,
        f"TAMPERING RISK : {'⚠️  HIGH — Discrepancy detected' if risk_flag else '✅ LOW — Scans consistent'}",
        "",
        "ANOMALY MAP: Bright regions show significant pixel-level",
        "changes between the two scans.",
    ]
    return ann_a, ann_b, diff_pil, "\n".join(lines)


# ──────────────────────────────────────────────────────────────────
# GRADIO INTERFACE
# ──────────────────────────────────────────────────────────────────
CSS = """
.risk-box textarea { font-family: 'Courier New', monospace !important; font-size: 12.5px !important; }
.title-md { text-align: center; }
"""

with gr.Blocks(css=CSS, title="Cargo X-Ray Inspector") as app:

    gr.Markdown(
        """
        # 🛃 CARGO X-RAY INSPECTOR
        ### AI-Powered Prohibited Item Detection — Customs & Border Security
        *YOLOv8s fine-tuned on PIDray · 124,486 X-ray Images · 12 Prohibited Item Categories*
        ---
        """,
        elem_classes="title-md",
    )

    # ── TAB 1: Threat Analysis ─────────────────────────────────────
    with gr.Tab("🔍 Threat Analysis"):
        gr.Markdown("Upload a cargo X-ray. The system preprocesses it, detects threats, generates a heatmap, and produces a full officer report.")
        with gr.Row():
            with gr.Column(scale=1):
                inp_img = gr.Image(type="pil", label="📥 Upload X-Ray Image")
                conf_sl = gr.Slider(0.10, 0.90, DEFAULT_CONF, step=0.05, label="Confidence Threshold")
                iou_sl  = gr.Slider(0.10, 0.90, DEFAULT_IOU,  step=0.05, label="IoU Threshold (NMS)")
                run_btn = gr.Button("🚨 RUN THREAT ANALYSIS", variant="primary", size="lg")
            with gr.Column(scale=2):
                with gr.Row():
                    pre_out = gr.Image(label="1️⃣  Preprocessed Image")
                    det_out = gr.Image(label="2️⃣  Bounding Box Detection")
                    hm_out  = gr.Image(label="3️⃣  Threat Heatmap")
        with gr.Row():
            pre_txt  = gr.Textbox(label="Preprocessing Steps",                  lines=8, elem_classes="risk-box")
            risk_txt = gr.Textbox(label="Risk Summary",                         lines=8, elem_classes="risk-box")
            rea_txt  = gr.Textbox(label="Inference Reasoning & Recommendation", lines=8, elem_classes="risk-box")
        run_btn.click(
            fn=analyze_image,
            inputs=[inp_img, conf_sl, iou_sl],
            outputs=[pre_out, det_out, hm_out, pre_txt, risk_txt, rea_txt],
        )

    # ── TAB 2: Cargo Comparison ────────────────────────────────────
    with gr.Tab("🔄 Cargo Comparison"):
        gr.Markdown("Compare two X-ray scans to detect **manifest tampering**, item substitution, or undeclared additions.")
        with gr.Row():
            ca = gr.Image(type="pil", label="📦 Scan A — Reference")
            cb = gr.Image(type="pil", label="📦 Scan B — Comparison")
        conf_sl2 = gr.Slider(0.10, 0.90, DEFAULT_CONF, step=0.05, label="Confidence Threshold")
        cmp_btn  = gr.Button("🔄 COMPARE SCANS", variant="primary", size="lg")
        with gr.Row():
            ca_out = gr.Image(label="Scan A — Detections")
            cb_out = gr.Image(label="Scan B — Detections")
            df_out = gr.Image(label="🌡️  Pixel Difference Map")
        cmp_txt = gr.Textbox(label="Comparison Report", lines=14, elem_classes="risk-box")
        cmp_btn.click(
            fn=compare_images,
            inputs=[ca, cb, conf_sl2],
            outputs=[ca_out, cb_out, df_out, cmp_txt],
        )

    # ── TAB 3: Scan Audit Log & Statistics ────────────────────────
    with gr.Tab("📊 Scan Statistics"):
        gr.Markdown("Live statistics from all scans run in this session. Every scan is auto-logged to a CSV file.")
        refresh_btn = gr.Button("🔄 Refresh Statistics", variant="secondary")
        stats_out   = gr.Textbox(label="Session Statistics", lines=20, elem_classes="risk-box")
        gr.Markdown(f"📁 **Audit log auto-saved to:** `{SCAN_LOG_PATH}`")
        refresh_btn.click(fn=load_scan_stats, inputs=[], outputs=[stats_out])

    # ── TAB 4: System Info ─────────────────────────────────────────
    with gr.Tab("ℹ️ System Info"):
        gr.Markdown("""
        ## System Configuration

        | Parameter | Value |
        |---|---|
        | Base Architecture | YOLOv8s |
        | Dataset | PIDray — 124,486 X-ray images |
        | Training Images | 76,913 (train_0 + train_1) |
        | Test Images | 47,573 |
        | Prohibited Categories | 12 |
        | Hardware | NVIDIA RTX 3050 4GB VRAM |
        | Training Epochs | 6 |
        | Batch Size | 12 |
        | Image Size | 640×640 |

        ## Threat Classification

        | Level | Score Range | Items | Officer Action |
        |---|---|---|---|
        | 🔴 CRITICAL | 80–100 | Gun, Bullet | Detain + Law Enforcement |
        | 🟠 HIGH | 60–79 | Knife, Baton | Manual Inspection Queue |
        | 🟡 MEDIUM | 35–59 | HandCuffs, Scissors | Manifest Verification |
        | 🟢 LOW | 0–34 | Tools, Powerbank, Sprayer, Lighter | Log & Clear |

        ## Preprocessing Pipeline
        1. **CLAHE** — Adaptive histogram equalisation (local contrast enhancement)
        2. **Unsharp Mask** — Edge sharpening for weapon outline clarity
        3. **Gamma Correction (γ=1.2)** — Background brightness normalisation

        ## Detectable Items
        `Gun` `Bullet` `Knife` `Baton` `HandCuffs` `Scissors`
        `Wrench` `Pliers` `Hammer` `Sprayer` `Powerbank` `Lighter`

        ## Risk Score Formula
        `Risk Score = Threat Base Score × Detection Confidence`

        Example: Gun (base 100) detected at 85% confidence → Score = 85/100
        """)


# ──────────────────────────────────────────────────────────────────
# LAUNCH
# ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.launch(share=True)