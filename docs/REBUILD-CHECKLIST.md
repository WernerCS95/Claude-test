# Rebuild Checklist — Producing a Real `.exe` / `.apk`

Follow this in order, every time, even for a "tiny" change. The stale-build bug (a rebuilt `.exe` that still showed an old test batch) happened because a copy step was skipped — this checklist exists specifically so that can't happen quietly again.

## Before you start

- [ ] **Confirm which file you actually edited.** All real editing happens in the two root files: `stores-terminal.html` and `master-list.html`. If you (or Claude Code) edited a copy inside `desktop-app/`, `android-app/www/`, etc. directly instead, stop — copy your change into the root file first, so there's one true source.
- [ ] **If you used Dev Mode's Capacitor setup** (`docs/DEV-MODE.md`), check `android-app/capacitor.config.json` and `master-list-android-app/capacitor.config.json` right now — neither should have a `"server"` key in it. If one does, delete that whole `"server": { ... }` block before continuing, or the app you ship will try to load from your laptop forever.

## 1. Copy the source files into the two app wrappers

Since 2026-10-20 there is **one app** (`app.html` shell + `stores-terminal.html` Input + `master-list.html` Admin), built two ways. These copies must be byte-for-byte identical to the root files, always:

| Root file | Copy into |
|---|---|
| `app.html` | `desktop-app/app.html` **and** `android-app/www/index.html` |
| `stores-terminal.html` | `desktop-app/stores-terminal.html` **and** `android-app/www/stores-terminal.html` |
| `master-list.html` | `desktop-app/master-list.html` **and** `android-app/www/master-list.html` |
| `vendor/*.js` | `desktop-app/vendor/` **and** `android-app/www/vendor/` |

In Command Prompt, from the repo root:
```
copy /Y app.html desktop-app\app.html
copy /Y stores-terminal.html desktop-app\stores-terminal.html
copy /Y master-list.html desktop-app\master-list.html
copy /Y app.html android-app\www\index.html
copy /Y stores-terminal.html android-app\www\stores-terminal.html
copy /Y master-list.html android-app\www\master-list.html
xcopy /Y /I vendor android-app\www\vendor
```

**Verify the copies** (this is the step that was skipped before, causing the stale build):
```
fc /B master-list.html android-app\www\master-list.html
```
"no differences encountered" = good. Repeat for each pair.

`desktop-terminal-app/` and `master-list-android-app/` are **retired** — kept only as a fallback to the pre-merge apps. Don't build them for normal use.

## 2. Build each app

**Laptop (.exe)** — installs over "Leader Master List" (same app id, same data):
```
cd desktop-app
npm install
npm run dist
cd ..
```

**Tablet (.apk)** — installs over "Leader Stores Terminal" (same app id, same data):
```
cd android-app
npm install
npx cap sync android
npx cap open android
```
In Android Studio: **Build → Build App Bundle(s)/APK(s) → Build APK(s)**. Wait for `BUILD SUCCESSFUL` — don't proceed on a build you didn't personally see finish. Build on the **same PC** as previous APKs (the signing key lives there).

## 3. Prove the build isn't stale — do this before trusting either one

For the `.exe`, check the installer's timestamp is from just now, not an old cached one:
```
dir desktop-app\dist\*.exe
```
The newest installer is `Leader Master List Setup <version>.exe` (2.0.0 for the merge build).
If `LastWriteTime` isn't within the last few minutes, the build didn't actually run — go back to step 2.

For the `.apk`, same idea:
```
dir android-app\android\app\build\outputs\apk\debug\app-debug.apk
```

**The strongest check, once installed:** open the app (desktop or tablet), open its console (Electron: `Ctrl+Shift+I`; tablet: `chrome://inspect`, see `CHROME-DEBUGGING.md`), and in the Console tab type:
```
document.lastModified
```
This shows the exact date and time the HTML file itself was last saved — a built-in browser feature, nothing added to the app for this. Compare it against when you actually made your last edit. If it shows an old date, the app is running old content despite whatever the installer/APK's own file date says — something in packaging didn't pick up your change, and it's worth re-running the whole checklist from step 1 rather than guessing which step failed.

## 4. Install

- **Desktop:** double-click the new installer, install over the existing app (don't uninstall first — that's what keeps your data).
- **Tablet:** upload the fresh `app-debug.apk` to Google Drive under a **new filename** (don't reuse an old filename — Drive can serve a stale cached copy), download it on the tablet, tap to install over the existing app.

## 5. After installing, re-confirm with `document.lastModified` one more time

Same check as step 3, but now on the actual installed app, not the dev build. This is the real proof the install worked — everything before this point can technically go right and still not reach the device if the wrong `.apk` gets uploaded or the wrong `.exe` gets clicked.
