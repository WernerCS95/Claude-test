#!/usr/bin/env python3
"""
Pomodoro Timer — 25-min focus / 5-min break, with session logging.
"""

import time
import sys
import os
import csv
from datetime import datetime

try:
    import winsound
    _WINDOWS_SOUND = True
except ImportError:
    _WINDOWS_SOUND = False

LOG_FILE = "pomodoro_log.csv"
FOCUS_MIN = 25
BREAK_MIN = 5
FIELDNAMES = ["date", "start_time", "duration_min", "notes"]

# ── terminal helpers ──────────────────────────────────────────────────────────

def _write(text):
    sys.stdout.write(text)
    sys.stdout.flush()

def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")

def alert(repeats=3):
    """Beep on Windows; fall back to terminal bell elsewhere."""
    for _ in range(repeats):
        if _WINDOWS_SOUND:
            winsound.Beep(880, 400)
            time.sleep(0.15)
        else:
            _write("\a")
            time.sleep(0.5)

def banner(title, width=52):
    print("=" * width)
    print(title.center(width))
    print("=" * width)

# ── countdown ─────────────────────────────────────────────────────────────────

def countdown(minutes, label):
    """Live countdown, updates in place. Returns False if interrupted."""
    total = minutes * 60
    bar_width = 30
    try:
        for remaining in range(total, -1, -1):
            elapsed = total - remaining
            filled = int(bar_width * elapsed / total) if total else bar_width
            bar = "█" * filled + "░" * (bar_width - filled)
            m, s = divmod(remaining, 60)
            pct = int(100 * elapsed / total) if total else 100
            _write(f"\r  {label}  {m:02d}:{s:02d}  [{bar}] {pct:3d}%  ")
            if remaining:
                time.sleep(1)
        print()
        return True
    except KeyboardInterrupt:
        print()
        return False

# ── log helpers ───────────────────────────────────────────────────────────────

def _ensure_log():
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=FIELDNAMES).writeheader()

def save_session(start: datetime, notes: str):
    _ensure_log()
    with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
        csv.DictWriter(f, fieldnames=FIELDNAMES).writerow({
            "date":         start.strftime("%Y-%m-%d"),
            "start_time":   start.strftime("%H:%M:%S"),
            "duration_min": FOCUS_MIN,
            "notes":        notes or "(no notes)",
        })

def today_sessions():
    today = datetime.now().strftime("%Y-%m-%d")
    if not os.path.exists(LOG_FILE):
        return []
    with open(LOG_FILE, newline="", encoding="utf-8") as f:
        return [r for r in csv.DictReader(f) if r.get("date") == today]

# ── display helpers ───────────────────────────────────────────────────────────

def show_summary(sessions):
    if not sessions:
        print("  No sessions logged today yet.")
        return
    total_min = sum(int(s.get("duration_min", FOCUS_MIN)) for s in sessions)
    print(f"  {len(sessions)} session(s) today  ({total_min} min total)\n")
    for i, s in enumerate(sessions, 1):
        print(f"  {i:>2}.  {s['start_time']}  [{s['duration_min']}m]  {s['notes']}")

# ── main loop ─────────────────────────────────────────────────────────────────

def main():
    session_num = 0

    clear_screen()
    print()
    banner("  🍅  POMODORO TIMER  🍅  ")
    print(f"\n  {datetime.now().strftime('%A, %B %d, %Y')}\n")
    show_summary(today_sessions())
    print()
    print("  Focus: 25 min  |  Break: 5 min  |  Ctrl-C to quit")
    print()

    while True:
        session_num += 1

        try:
            input(f"  ── Press Enter to start session #{session_num} ──")
        except (KeyboardInterrupt, EOFError):
            print("\n\n  Goodbye!\n")
            sys.exit(0)

        start = datetime.now()
        print(f"\n  Session #{session_num} started at {start.strftime('%H:%M:%S')}\n")

        # ── focus countdown ──
        finished = countdown(FOCUS_MIN, "FOCUS")

        if not finished:
            print("\n  Session cancelled.\n")
            sys.exit(0)

        # ── end-of-focus alert ──
        print()
        banner("  ✓  FOCUS SESSION COMPLETE  ✓  ")
        alert(3)
        print()

        # ── log what was worked on ──
        try:
            notes = input("  What did you work on? ").strip()
        except (KeyboardInterrupt, EOFError):
            notes = "(interrupted)"

        save_session(start, notes)
        print(f"\n  Saved to {LOG_FILE}\n")

        # ── break ──
        try:
            input("  Press Enter to start your 5-minute break…")
        except (KeyboardInterrupt, EOFError):
            print("\n\n  Goodbye!\n")
            sys.exit(0)

        print()
        finished = countdown(BREAK_MIN, "BREAK")

        if not finished:
            print("\n  Goodbye!\n")
            sys.exit(0)

        print()
        banner("  ⏰  BREAK OVER — BACK TO WORK  ⏰  ")
        alert(2)
        print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n  Goodbye!\n")
        sys.exit(0)
