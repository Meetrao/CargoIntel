"""
PIDRAY DATASET AUDIT SCRIPT
Gives:
- Total images
- Per-class counts
- Instances per class
"""

import os
from pathlib import Path
from collections import defaultdict

# 🔧 CHANGE THIS PATH
BASE = r"C:\Users\44184\Desktop\project\Customs_and_Border_Security_model\mi_model"

LABELS_DIR = Path(BASE) / "labels" / "train"
IMAGES_DIR = Path(BASE) / "images" / "train"

CLASS_NAMES = {
    0: "Baton",
    1: "Pliers",
    2: "Hammer",
    3: "Powerbank",
    4: "Scissors",
    5: "Wrench",
    6: "Gun",
    7: "Bullet",
    8: "Sprayer",
    9: "HandCuffs",
    10: "Knife",
    11: "Lighter",
}

print("\n🔍 SCANNING DATASET...\n")

label_files = list(LABELS_DIR.glob("*.txt"))
image_files = list(IMAGES_DIR.glob("*.*"))

total_labels = len(label_files)
total_images = len(image_files)

images_per_class = defaultdict(int)
instances_per_class = defaultdict(int)

empty_files = 0

for file in label_files:
    with open(file) as f:
        lines = [l.strip() for l in f if l.strip()]

    if not lines:
        empty_files += 1
        continue

    classes_in_image = set()

    for line in lines:
        cls = int(line.split()[0])
        classes_in_image.add(cls)
        instances_per_class[cls] += 1

    for cls in classes_in_image:
        images_per_class[cls] += 1

# ─────────────────────────────────────────────

print("=" * 55)
print("DATASET SUMMARY")
print("=" * 55)

print(f"Total Images        : {total_images:,}")
print(f"Total Label Files   : {total_labels:,}")
print(f"Empty Labels        : {empty_files:,}")
print(f"Images w/ objects   : {total_labels - empty_files:,}")

print("\nCLASS DISTRIBUTION")
print("=" * 55)
print(f"{'Class':<12} {'Images':>10} {'Instances':>12}")

for cls_id in sorted(CLASS_NAMES.keys()):
    name = CLASS_NAMES[cls_id]
    imgs = images_per_class.get(cls_id, 0)
    inst = instances_per_class.get(cls_id, 0)
    print(f"{name:<12} {imgs:>10,} {inst:>12,}")

print("=" * 55)

# imbalance ratio
if images_per_class:
    max_cls = max(images_per_class, key=images_per_class.get)
    min_cls = min(images_per_class, key=images_per_class.get)

    print("\nIMBALANCE ANALYSIS")
    print("=" * 55)
    print(f"Most common : {CLASS_NAMES[max_cls]} ({images_per_class[max_cls]:,})")
    print(f"Least common: {CLASS_NAMES[min_cls]} ({images_per_class[min_cls]:,})")
    print(f"Imbalance ratio: {images_per_class[max_cls]/images_per_class[min_cls]:.2f}x")

print("\n✅ Done.")