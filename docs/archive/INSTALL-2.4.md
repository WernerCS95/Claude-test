# Install 2.4 — late-slip catch-up + laptop-correction notes (20 Oct 2026)

Same app on both devices — no data move. **Never uninstall.** If Android asks to
uninstall first or says "App not installed": STOP and send a screenshot.

## Build (laptop, Command Prompt)
1. `cd /d "C:\Users\werne\OneDrive\Desktop\Claude-test"` then `git pull origin claude/blissful-mccarthy-k7if0c`
2. `cd desktop-app` → `npm run dist` → `dir dist\*.exe` → **Leader Master List Setup 2.4.0.exe**, today's time
3. `cd ..\android-app` → `npx cap sync android` → `npx cap open android` → Build APK(s) → **BUILD SUCCESSFUL**
4. `dir android\app\build\outputs\apk\debug\app-debug.apk` → today's time → upload to Drive as **leader-stores-2.4.apk**

## Install
5. Laptop: close the app, run **Leader Master List Setup 2.4.0.exe** over the top.
6. Tablet: install **leader-stores-2.4.apk** from Drive → **Update**.
7. Quick check: note 3 items' stock before, same numbers after, on both devices.
   (Backups optional when nothing has moved since the last one.)

## What changed
- A slip uploaded late (tablet offline for a while) is no longer skipped by a
  device that was closed — each catch-up re-reads the last 7 days, no double counting.
- A Review Queue edit/delete on the laptop now shows on the tablet's slip in
  Today's Log: "✎ Corrected on laptop …: Masking Tape 48mm: qty 4 → 3".
  Only for corrections made from 2.4 on.
