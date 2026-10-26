# Install 2.5 — Kit Scheduler: Production Planner (21 Oct 2026)

Laptop EXE first. The tablet APK is optional — build it when you want the planner
button in the tablet's Input → ⚙ More too.
Same app — no data move. **Never uninstall.**

## Build + install (laptop, Command Prompt)
1. `cd /d "C:\Users\werne\OneDrive\Desktop\Claude-test"` then `git pull origin claude/blissful-mccarthy-k7if0c`
2. `cd desktop-app` → `npm run dist` → `dir dist\*.exe` → **Leader Master List Setup 2.8.2.exe**, today's time
3. Close the app, run **Leader Master List Setup 2.8.2.exe** over the top.

## First run
4. Admin → **📅 Kit Scheduler** → **📥 Import Production Schedule (.xlsx)** → pick Production's weekly file.
5. **⚠ Flags** — check anything listed against the paper schedule.
6. **📋 Schedule** — untick "Build?" for any stage whose parts are already out.
7. **🧰 Kit per Type** — check each type's "Kit based on"; fill in or mark "none"
   for groups showing "not defined" (Axles, Tyres & rims, Air/brake, Nameplates).
8. **🧮 Allocation** — set JOST / Hydroscand per customer where it says "pick one".
9. **🛒 Order List** — what to buy, from whom, by when. **🖨 Print Order List**.

Each new schedule: import it → **🔀 What Moved** shows what changed.

## Opening it
- **Admin** → 📅 Kit Scheduler, or
- **Input** → ⚙ More → 📅 Kit Scheduler (Production Planner). It opens the same
  planner (same data, kept in Admin) and **Close** takes you back to Input.
