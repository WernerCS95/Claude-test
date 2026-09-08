# Rebuild Checklist — Producing a Real `.exe` / `.apk`

Follow this in order, every time, even for a "tiny" change. The stale-build bug (a rebuilt `.exe` that still showed an old test batch) happened because a copy step was skipped — this checklist exists specifically so that can't happen quietly again.

## Before you start

- [ ] **Confirm which file you actually edited.** All real editing happens in the two root files: `stores-terminal.html` and `master-list.html`. If you (or Claude Code) edited a copy inside `desktop-app/`, `android-app/www/`, etc. directly instead, stop — copy your change into the root file first, so there's one true source.
- [ ] **If you used Dev Mode's Capacitor setup** (`docs/DEV-MODE.md`), check `android-app/capacitor.config.json` and `master-list-android-app/capacitor.config.json` right now — neither should have a `"server"` key in it. If one does, delete that whole `"server": { ... }` block before continuing, or the app you ship will try to load from your laptop forever.

## 1. Copy the source file into every wrapper

Each app has its own copy that the real build uses — these must be byte-for-byte identical to the root file, always:

| Root file | Copy into |
|---|---|
| `master-list.html` | `desktop-app/master-list.html` |
| `master-list.html` | `master-list-android-app/www/index.html` |
| `stores-terminal.html` | `desktop-terminal-app/stores-terminal.html` |
| `stores-terminal.html` | `android-app/www/index.html` |

In PowerShell, from the repo root:
```
Copy-Item master-list.html desktop-app\master-list.html
Copy-Item master-list.html master-list-android-app\www\index.html
Copy-Item stores-terminal.html desktop-terminal-app\stores-terminal.html
Copy-Item stores-terminal.html android-app\www\index.html
```

**Verify the copy actually happened** (this is the step that was skipped before, causing the stale build):
```
Compare-Object (Get-Content master-list.html) (Get-Content desktop-app\master-list.html)
```
No output = identical, good. Any output listed = they differ, something went wrong — don't proceed until this comes back empty. Repeat for the other three pairs.

## 2. Build each app

**Master List (.exe):**
```
cd desktop-app
npm install
npm run dist
cd ..
```

**Stores Terminal desktop (.exe):**
```
cd desktop-terminal-app
npm install
npm run dist
cd ..
```

**Stores Terminal (.apk):**
```
cd android-app
npm install
npx cap sync android
npx cap open android
```
In Android Studio: **Build → Build App Bundle(s)/APK(s) → Build APK(s)**. Wait for the Build tab at the bottom to say `BUILD SUCCESSFUL` — don't proceed on a build you didn't personally see finish.

**Master List (.apk):** same as above, inside `master-list-android-app` instead.

## 3. Prove the build isn't stale — do this before trusting any of the four

For the two `.exe` files, check the installer's timestamp is from just now, not an old cached one:
```
Get-Item desktop-app\dist\"Leader Master List Setup 1.0.0.exe" | Select-Object LastWriteTime
Get-Item desktop-terminal-app\dist\"Leader Stores Terminal Setup 1.0.0.exe" | Select-Object LastWriteTime
```
If `LastWriteTime` isn't within the last few minutes, the build didn't actually run — go back to step 2.

For the two `.apk` files, same idea:
```
Get-Item android-app\android\app\build\outputs\apk\debug\app-debug.apk | Select-Object LastWriteTime
Get-Item master-list-android-app\android\app\build\outputs\apk\debug\app-debug.apk | Select-Object LastWriteTime
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
