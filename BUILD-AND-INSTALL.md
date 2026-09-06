# Leader Stores System — Standalone Apps

Plain-language guide. Three things were built:

1. **`desktop-app/`** → wraps `master-list.html` into `Leader Master List.exe` for your laptop.
2. **`desktop-terminal-app/`** → wraps `stores-terminal.html` into `Leader Stores Terminal.exe`, so you can also run the terminal on your PC (e.g. for testing, or a second stores workstation).
3. **`android-app/`** → wraps `stores-terminal.html` into an installable Android app (`.apk`) for the tablet(s).

`desktop-terminal-app` is built exactly the same way as `desktop-app` — see section 2 below, just run those same commands inside `desktop-terminal-app` instead. It gets its own separate app identity (`co.leadertrailers.storesterminal.desktop`) from both the tablet app and Master List, so it keeps its own local data — see the sync note at the bottom of this file for why that matters right now.

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
   npx cap sync android
   ```
   The second command regenerates a few native config folders that Capacitor deliberately doesn't store in git (they're rebuilt from `node_modules` every time) — skipping it causes a "could not read script ... cordova.variables.gradle ... does not exist" error in Android Studio.

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

## 5. Live stock sync between devices (new)

Both `stores-terminal.html` and `master-list.html` now watch a shared table (`stock_transactions`) in your Supabase project. Every delivery, issue and spot check on the terminal side gets written there as its own row and instantly applied on every other device running either app — Master List included, even though it doesn't capture deliveries itself.

**How it stays correct under concurrent use (your delivery + issue example):** nothing is ever synced as a raw number. Deliveries and issues sync as +/- changes; spot checks sync as an absolute reset (same as your physical count already overrules everything before it locally). Two devices can both be mid-transaction offline and reconnect in any order — the math always lands the same, because it's always addition/subtraction of the same numbers, never one device's total overwriting another's.

**This only keeps quantities in sync** — not the full delivery/issue history (Master List's "Parts Issued" log stays tablet-only for now; the shared ledger is quantities only, by design).

**The old day-to-day "Paste Code from Tablet" / "Import File" buttons have been removed from Master List.** They applied the exact same quantity changes the live ledger now applies — running both was double-counting stock. The server (Supabase) is now the single source of truth for quantities; the tablet is no longer "the brain." **"Import Full State from Tablet" and "Restore Backup" are untouched** — those are a separate disaster-recovery tool, not part of the day-to-day flow, and still work exactly as before.

One thing not yet cleaned up: the Terminal app's own "Upload to Master List" / "Copy Code" button still exists on that side, but Master List can no longer accept what it produces (nowhere left to paste it). It's harmless to leave alone for now — pressing it just does nothing useful — but worth removing from the Terminal UI too at some point so it doesn't invite confusion.

**Sync is now bidirectional.** Originally Master List only received. It now also pushes its own local quantity corrections into the same shared ledger:
- "Correct Tank Reading" (Diesel and Generator)
- "View & Fix Spot Check List On Screen"
- "+ Add Item to Stock List" (a brand-new item entered by hand)
- Deleting/undoing a spot check or delivery ledger entry

The Terminal picks these up exactly like any other device would. One boundary that's expected, not a bug: each device still needs to know an item's SKU exists at all before it can show/track it — that's still handled by the existing "Import/Export Stock Reference" tool, unchanged. Sync keeps *quantities* agreeing for items both devices already have catalogued; it doesn't invent a brand-new SKU's tile on a device that's never heard of it.

**The "Parts Issued" and "Goods Received" history views in Master List are alive again**, now sourced from the shared ledger instead of the removed import path — new issues/deliveries from the terminal will appear there automatically, same as before, just via a different (better) mechanism underneath.

**How to actually test it:**
1. Build and open both `desktop-terminal-app`'s app and `desktop-app`'s (Master List) app on the laptop at the same time.
2. In the Terminal app, log a delivery for any item (or issue one out).
3. Watch Master List — that item's quantity should update within a second or two, with no action needed on the Master List side.
4. Once the tablet's `.apk` exists, repeat with the tablet instead of the second desktop app — same expected result.

If it doesn't sync: check the laptop has internet (sync needs it; local capture doesn't), and check the browser/Electron dev console (Ctrl+Shift+I inside the app) for `Sync push failed` or `Sync pull failed` messages — those log the real reason, they're not stayed silent.

## 6. What still needs internet, what doesn't

- Both apps run **fully offline** for everyday use — stock issuing, GRNs, counts, all of it.
- The one exception: **"Scan PO Page" OCR in Master List** (Tesseract.js) needs internet the moment you use that specific feature, same as it did in the browser. Nothing else does.

## 7. What wasn't done

- Master List still has no delivery-capture screen of its own — use the Terminal app (`desktop-terminal-app`) on the laptop for that; Master List just reflects it live now.
- No business logic was changed beyond the sync additions above (which are additive — they call the exact same local functions a manual entry would). If anything behaves differently from before, that's a bug in the wrapping, not an intended change — flag it.
