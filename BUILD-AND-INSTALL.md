# Build and install — Leader Stores

One app, two builds. The real source is the three files at the repo root:
`stores-terminal.html` (Input), `master-list.html` (Admin) and `app.html` (the shell
that holds both). Copy them into the two wrappers before building:

| Build | Folder | Copies of the root files | Identity — never change |
|---|---|---|---|
| Laptop `.exe` (Leader Master List) | `desktop-app/` | `app.html`, `stores-terminal.html`, `master-list.html`, `vendor/` | `appId` `co.leadertrailers.masterlist` in `package.json` |
| Tablet `.apk` (Leader Stores Terminal) | `android-app/` | `www/index.html` (= `app.html`), `www/stores-terminal.html`, `www/master-list.html`, `www/vendor/` | `applicationId` `co.leadertrailers.storesterminal` in `android/app/build.gradle` and `capacitor.config.json` |

Version: `desktop-app/package.json` → `"version"`; `android-app/android/app/build.gradle`
→ `versionCode` (+1 every build) and `versionName`.

## Laptop (Command Prompt)
```
cd /d "C:\Users\werne\OneDrive\Desktop\Claude-test"
git pull origin claude/blissful-mccarthy-k7if0c
cd desktop-app
npm run dist
dir dist\*.exe
```
Close the app, run **Leader Master List Setup <version>.exe** over the top.

## Tablet (Command Prompt + Android Studio)
```
cd /d "C:\Users\werne\OneDrive\Desktop\Claude-test\android-app"
npx cap sync android
npx cap open android
```
Android Studio: **Build → Build APK(s)** → wait for BUILD SUCCESSFUL →
`android\app\build\outputs\apk\debug\app-debug.apk`. Upload it to Drive, open it on
the tablet, choose **Update**.

## Never lose data
- **Never uninstall** either app — install the new version over the top.
- If Android says "App not installed" or asks to uninstall first: **stop**, take a
  screenshot.
- Data lives with the app identity (table above). Keep those ids exactly as they are.
- Back up first when in doubt: Input → ⚙ More → 💾 Download Backup Now; Admin →
  💾 Backup & Files.

The retired pre-merge apps (`desktop-terminal-app/`, `master-list-android-app/`)
were removed in 2.9.0 — they're in git history if ever needed.
More detail: `docs/REBUILD-CHECKLIST.md`, `docs/FILE-MAP.md`, `docs/KNOWN-ISSUES.md`.
