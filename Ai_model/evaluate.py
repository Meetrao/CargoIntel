from ultralytics import YOLO
import os

model = YOLO(r"C:\Users\44184\runs\detect\pidray_v32\weights\best.pt")

metrics = model.val(
    data=r"C:\Users\44184\Desktop\project\Customs_and_Border_Security_model\pidray.yaml",
    split='val',
    conf=0.25,
    iou=0.5,
    augment=False,
    save_json=True,
    plots=True
)

print(f"\n{'='*50}")
print(f"         HACKATHON RESULTS — PIDRAY v32")
print(f"{'='*50}")
print(f"mAP50:      {metrics.box.map50:.4f}")
print(f"mAP50-95:   {metrics.box.map:.4f}")
print(f"Precision:  {metrics.box.mp:.4f}")
print(f"Recall:     {metrics.box.mr:.4f}")
print(f"{'='*50}")
print(f"\nPer-class AP:")
for i, name in enumerate(model.names.values()):
    print(f"  {name:12s}: AP50 = {metrics.box.ap50[i]:.4f}")

print(f"\nConfusion matrix and plots saved to:")
print(f"  {metrics.save_dir}")