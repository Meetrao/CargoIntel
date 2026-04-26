# 🚀 CargoScan AI  
### Intelligent X-Ray Cargo Inspection System  

AI-powered cargo screening system for detecting prohibited items in X-ray images using deep learning.

---

## 📌 Overview

CargoScan AI is a real-time cargo inspection system built using YOLOv8 to automatically detect prohibited items in X-ray scans.

In real-world customs operations, manual inspection of cargo is:
- Slow and time-consuming  
- Prone to human error  
- Inconsistent across operators  

CargoScan AI is designed to assist this process by providing fast, reliable, and explainable detection of potential threats.

---

## 🧠 Key Features

- Real-time object detection using YOLOv8s  
- High-accuracy identification of prohibited items  
- Grad-CAM based visual explanations (Explainable AI)  
- Security-focused risk scoring system  
- Cargo comparison for tampering detection  
- Automated audit logging for traceability  
- Interactive web demo built with Gradio  

---

## 📊 Model Performance

| Metric              | Score   | Interpretation |
|--------------------|--------|---------------|
| **mAP@0.50**       | 97.52% | Well above standard benchmarks |
| **mAP@0.50:0.95**  | 90.40% | Strong localisation performance |
| **Precision**      | 96.84% | Very low false positive rate |
| **Recall**         | 95.49% | Minimal missed detections |
| **F1 Score**       | 96.16% | Balanced precision and recall |

---

## 🧪 Dataset

- Dataset: PIDray  
- Size: 124,000+ X-ray images  
- Classes: 12 categories  

**Classes:**
Gun, Knife, Bullet, Baton, Scissors, Hammer,  
Wrench, Pliers, Powerbank, Lighter, Handcuffs, Sprayer  

---

## ⚙️ Tech Stack

- Python 3.9  
- PyTorch  
- Ultralytics YOLOv8  
- OpenCV  
- NumPy  
- Gradio  

---

## 🏗️ System Pipeline

1. Image Upload  
2. Preprocessing (CLAHE, sharpening, gamma correction)  
3. Object Detection (YOLOv8)  
4. Grad-CAM visualization  
5. Risk scoring  
6. Output generation and logging  

---

## 🧮 Risk Scoring Approach

Unlike standard detection systems, CargoScan AI is designed with a **security-first mindset**.

- Critical items such as guns and bullets have minimum score thresholds  
- Even low-confidence detections are treated cautiously  
- The system prioritizes reducing false negatives over false positives  

This ensures that potentially dangerous items are not overlooked.

---

## ⚡ Performance

- Inference Speed: ~4–5 ms per image  
- Throughput: 200+ images per second  

---

## 🖥️ Demo

The project includes a Gradio-based web interface where you can:

- Upload X-ray images  
- View detected objects with bounding boxes  
- Generate heatmaps and Grad-CAM visualizations  
- Get a risk score and system recommendation  

---

## 📂 Project Structure

```
CargoScan-AI/
│── model/
│── dataset/
│── scripts/
│── app.py
│── pidray.yaml
│── requirements.txt
│── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/CargoScan-AI.git
cd CargoScan-AI
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the application

```bash
python app.py
```

---

## 🧪 Training

To train the model:

```bash
yolo detect train model=yolov8s.pt data=pidray.yaml epochs=12 imgsz=640 batch=12
```

---

## 🚧 Challenges

- Limited GPU memory (4GB VRAM constraints)  
- Large dataset size (~48GB)  
- Class imbalance (fewer weapon samples)  
- COCO to YOLO annotation conversion  
- Detecting concealed objects (e.g., guns, knives)  

---

## 🔮 Future Work

- Train on larger models (YOLOv8m / YOLOv8l)  
- Improve class balance for critical categories  
- Add anomaly detection models  
- Deploy as an API (FastAPI)  
- Integrate database logging (PostgreSQL)  

---

## 👥 Team

**Team Smooth Operators**  
VIT Pune — RealitySpectra SIG  

---

## 📜 License

This project is intended for academic and research purposes.
