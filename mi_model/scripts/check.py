from pathlib import Path

BASE = r"C:\Users\44184\Desktop\project\Customs_and_Border_Security_model\mi_model"

train = set([p.stem for p in Path(BASE, "images/train").glob("*.*")])
val   = set([p.stem for p in Path(BASE, "images/val").glob("*.*")])
test  = set([p.stem for p in Path(BASE, "images/test").glob("*.*")])

print("Train ∩ Val:", len(train & val))
print("Train ∩ Test:", len(train & test))
print("Val ∩ Test:", len(val & test))

for split in ["balanced", "val", "test"]:
    count = len(list(Path(BASE, f"images/{split}").glob("*.*")))
    print(f"{split}: {count}")