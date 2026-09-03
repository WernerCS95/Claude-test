# Leader Stores System — Standalone Apps

Plain-language guide. Two things were built:

1. **`desktop-app/`** → wraps `master-list.html` into `Leader Master List.exe` for your laptop.
2. **`android-app/`** → wraps `stores-terminal.html` into an installable Android app (`.apk`) for the tablet(s).

Both are still 100% offline, still 100% localStorage — nothing about your data or your business logic was touched. This is packaging only, plus one real fix (below).

---

## 1. The fix that was made to `stores-terminal.html` (do this before anything else)

**Problem:** if the tablet's browser reloaded the page in the background mid-task (a slip half-built, a delivery half-entered, a Full Count page half-counted), that unsaved work was lost. Anything already saved (stock, logs, POs) was never at risk — only the *in-progress* stuff.

**Fix:** the terminal now auto-saves its in-progress work (current slip, an open Goods Received entry, an open Full Count page) to its own separate storage slot every 3 seconds, and whenever it's backgrounded. If the app ever reloads with unsaved work sitting in that slot, it asks you on load: *"Unsaved work found from [time] — resume it?"* Say yes and you're back exactly where you were. Say no and it's discarded. Nothing already submitted/saved is touched by this — it only rescues work that hadn't been committed yet.

This is in the file already — nothing you need to do for it to work.

---

## 2. Building `Leader Master List.exe` (Windows)

Do this **on the Windows laptop** (or any Windows PC — the `.exe` isn't tied to one machine).

**One-time setup:**
1. Install [Node.js](https://nodejs.org) (the LTS version, big green button).
2. Open the `desktop-app` folder in a terminal (Command Prompt or PowerShell — right-click inside the folder → "Open in Terminal").
3. Run:
   ```
   npm install
   ```
   (Downloads the packaging tools. Only needed once, or after an update to `package.json`.)

**Build the `.exe`:**
```
npm run dist
```
This creates `desktop-app/dist/Leader Master List Setup 1.0.0.exe` — a normal Windows installer. Double-click it, install it like any other program. It puts a "Leader Master List" icon on the Start Menu/Desktop, opens as its own window (no browser bar, no tabs).

**Test it first without building an installer** (faster, for checking a change works):
```
npm start
```

---

## 3. Building the Android app (tablet)

This one needs **Android Studio** — Google's official tool for building Android apps. It's a bigger install than Node, but it's the standard, free way to do this.

**One-time setup:**
1. Install [Node.js](https://nodejs.org) if you haven't already.
2. Install [Android Studio](https://developer.android.com/studio) — during its first-run setup wizard, let it install the default Android SDK components (it will prompt you; just accept the defaults).
3. Open a terminal in the `android-app` folder and run:
   ```
   npm install
   ```

**Build the `.apk`:**
```
npx cap open android
```
This opens the project in Android Studio. Once it finishes indexing (first time only, can take a few minutes):
- Menu: **Build → Build App Bundle(s) / APK(s) → Build APK(s)**
- Android Studio will tell you where the `.apk` landed (usually `android/app/build/outputs/apk/debug/app-debug.apk`)

**Install it on the tablet:**
- Easiest: plug the tablet into the PC via USB, enable "Developer options → USB debugging" on the tablet (Settings → About tablet → tap "Build number" 7 times to unlock Developer options), then in Android Studio click the green ▶ Run button with the tablet selected as the target device — it installs directly.
- Or: copy the `.apk` file to the tablet (USB, email, whatever) and open it there — Android will ask permission to "install from unknown sources" once; allow it, then install.

---

## 4. Updating either app later WITHOUT losing data — the important part

**This is the one thing that must never be gotten wrong**, given what's already happened with lost storage before. Here's why it's safe now, and exactly what to do:

### Why it's safe
- **Desktop app:** the app loads its page through a fixed internal address (`app://leaderapp/...`) that never changes, no matter where Windows installs the app or what version it is. Since that address is what `localStorage` is tied to, your data stays put across every rebuild and every reinstall — this was actually tested here: data was written, the app was fully closed, "rebuilt" (files touched), and relaunched fresh — the data was still there.
- **Tablet app:** Android apps get their own private storage tied to the app's package name (`co.leadertrailers.storesterminal`), completely separate from any browser. As long as that package name is never changed, updating the app (installing a newer `.apk` over the old one) keeps all existing data. This is standard, well-documented Android behavior — it's how every Android app updates without wiping itself.

### The one rule to follow
**Never change the app's identity when updating:**
- Desktop: don't rename/change `appId` in `desktop-app/package.json` (`co.leadertrailers.masterlist`).
- Tablet: don't change `appId` in `android-app/capacitor.config.json` or `applicationId` in `android-app/android/app/build.gradle` (`co.leadertrailers.storesterminal`).

As long as those stay exactly as they are, you can update the HTML file, rebuild, reinstall over the old version, and every bit of existing data survives — same as any normal app update.

### How to actually update either app
1. Get the new version of `master-list.html` or `stores-terminal.html` into place:
   - Desktop: replace `desktop-app/master-list.html`.
   - Tablet: replace `android-app/www/index.html` with the new `stores-terminal.html` content (rename it to `index.html`), then run `npx cap sync android` inside `android-app` before rebuilding.
2. Rebuild using the same commands as above (`npm run dist` / Android Studio build).
3. Install over the old version — do **not** uninstall the old one first (uninstalling **does** wipe Android app data; installing an update on top does not).

### Your existing safety nets are untouched
The full JSON auto-backup on save, "Restore Backup," the empty-data warning banner, and "Export Full State / Import Full State" between tablet and laptop — all still there, unchanged. Keep using them exactly as before; this packaging doesn't replace them, it just makes the everyday case (a normal update) safe on its own too.

---

## 5. What still needs internet, what doesn't

- Both apps run **fully offline** for everyday use — stock issuing, GRNs, counts, all of it.
- The one exception: **"Scan PO Page" OCR in Master List** (Tesseract.js) needs internet the moment you use that specific feature, same as it did in the browser. Nothing else does.

## 6. What wasn't done (needs `master-list.html`'s live sync, or your say-so)

- No live sync between tablet and laptop was added — that's still the deliberate, separate future phase you already parked (Supabase/Firebase). Data still moves between them via the existing manual Export/Import.
- No business logic was changed. If anything in the packaged version behaves differently from before, that's a bug in the wrapping, not an intended change — flag it.
