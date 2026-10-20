# Install 2.2 — Slip Grid, Review Queue, Override Log, Issued History (20 Oct 2026)

Same app on both devices — no data move. **Never uninstall.** If Android asks to
uninstall first or says "App not installed": STOP and send a screenshot.

## Build (laptop, Command Prompt)
1. `cd /d "C:\Users\werne\OneDrive\Desktop\Claude-test"` then `git pull origin claude/blissful-mccarthy-k7if0c`
2. `cd desktop-app` → `npm run dist` → `dir dist\*.exe` → **Leader Master List Setup 2.2.0.exe**, today's time
3. `cd ..\android-app` → `npx cap sync android` → `npx cap open android` → Build APK(s) → **BUILD SUCCESSFUL**
4. `dir android\app\build\outputs\apk\debug\app-debug.apk` → today's time → upload to Drive as **leader-stores-2.2.apk**

## Laptop
5. Admin → **💾 Save Today's List** (backup)
6. Close the app, run **Leader Master List Setup 2.2.0.exe** over the top
7. Admin → **🔎 Verify Against Backup** → every section matches

## Tablet
8. Input → **⚙ More → 💾 Download Backup Now** and **📤 Export & Share Full Current State**; Admin → **💾 Backup & Share**
9. Install **leader-stores-2.2.apk** from Drive → **Update**
10. Input → **🔎 Verify Against Backup** (Full State file) · Admin → **🔎 Verify Against Backup** (Master List backup)

## New in 2.2
- **Tablet, Input → 📝 Slip Grid:** capture a pile of paper slips, Post, carry on.
- **Laptop, Admin → 🧾 Review Queue:** each posted batch; edit/delete a line, Mark Reviewed.
- **Laptop, Admin → 📜 Override Log:** every laptop change, old → new, when.
- **Laptop, Admin → 📈 Issued History:** filter by item / job / name / dates, totals, print.
