import csv
import sys


def check_reorder(filepath):
    items_to_reorder = []

    with open(filepath, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if int(row["current_qty"]) < int(row["min_qty"]):
                items_to_reorder.append(row["item_name"])

    if items_to_reorder:
        print("Items that need to be reordered:")
        for item in items_to_reorder:
            print(f"  - {item}")
    else:
        print("All items are sufficiently stocked.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python reorder_check.py <inventory.csv>")
        sys.exit(1)
    check_reorder(sys.argv[1])
