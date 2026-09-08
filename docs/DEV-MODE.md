# Dev Mode — See a Change Without Rebuilding

Two completely different setups, one for each app family. Read the warnings in each section — they're not the same risk in both, and they're real, not just caution for caution's sake.

---

## 1. Master List and Terminal on the laptop (Electron)

This one is genuine, instant live-reload: edit the `.html` file, hit save, and the open window refreshes itself automatically — no `npm run dist`, no reinstalling.

### How to start it

**Master List:**
```
cd desktop-app
npm run dev
```

**Stores Terminal (desktop copy):**
```
cd desktop-terminal-app
npm run dev
```

A window opens exactly like the real app, except its DevTools panel (the same console used to catch the `window.prompt()` bug) opens automatically alongside it. Leave this window and the PowerShell window it's running in both open while you work.

### How to use it

Open `desktop-app\master-list.html` (or `desktop-terminal-app\stores-terminal.html`) in a plain text editor — Notepad works, VS Code is nicer if you have it. Make a small change (a label, some display text), save the file, and switch back to the dev window. It reloads itself within a second or two, showing your change.

### ⚠️ Real limitation #1 — this is your REAL data, not a test copy

Dev mode loads through the exact same `app://leaderapp/` address the installed app uses, which is what your stock data is tied to. **That means dev mode is very likely reading and writing your actual, real stock numbers** — not a sandboxed copy. Before you rely on this:

1. Open dev mode once.
2. Check that a stock quantity you recognize matches what the real installed app shows.
3. If it matches — dev mode is sharing real data. Treat every button you press in there as a real action, exactly like the installed app. Don't "just try" a delivery or a Full Reset to see what happens.
4. If it comes up empty instead — good, it's a separate, disposable data set, and you can experiment freely without a warning label. Test this once and note down which case you're in.

### ⚠️ Real limitation #2 — it still talks to the real shared database

Dev mode doesn't touch the sync code differently to the packaged app — the same Supabase address is baked into the file either way. **Any delivery, issue, or spot check you submit in dev mode pushes a real row to the shared ledger**, and every other device (the tablet, the other laptop app) will see it and adjust their quantities accordingly. Dev mode is for checking that a label or a screen looks right, not for practicing real workflows — a "test" Fit or Cut or delivery in dev mode is exactly as real as one typed on the tablet on the factory floor.

### What's genuinely identical to the packaged app

The page content, the styling, the sync connection, the localStorage location — all identical, because dev mode loads the literal same file through the literal same address. The only practical difference is *how* it launches (a dev window instead of an installer) and that DevTools is already open.

---

## 2. Stores Terminal on the tablet (Capacitor / Android)

This one is **not** true live-reload the way Electron's is — Capacitor's own tools don't include automatic file-watching. What this setup gives you instead: **skip the rebuild-and-reinstall cycle entirely** — no Android Studio build, no new `.apk`, no Google Drive upload — but you do have to manually refresh to see a change. Don't expect it to behave like a browser dev server; it doesn't.

### One-time setup

You need a way to serve the `www` folder over your WiFi network. `npx http-server` does this without installing anything permanently:

```
cd android-app\www
npx http-server -p 8100
```

Leave that window running. Note the "On Your Network" address it prints (something like `http://192.168.1.42:8100`) — you'll need your laptop's actual local IP. If you don't already know it, open a **second** PowerShell window and run:
```
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter.

### Point the tablet at your laptop

`android-app/capacitor.config.dev-example.json` is a ready-made template — copy its contents into `android-app/capacitor.config.json`, replacing `YOUR-LAPTOP-IP` with the address from `ipconfig`:

```json
{
  "appId": "co.leadertrailers.storesterminal",
  "appName": "Leader Stores Terminal",
  "webDir": "www",
  "server": {
    "url": "http://192.168.1.42:8100",
    "cleartext": true
  }
}
```

Then:
```
npx cap sync android
npx cap open android
```
In Android Studio, click the green ▶ Run button with the tablet connected — this installs a dev build that loads from your laptop instead of its own bundled files.

### How to use it

Edit `stores-terminal.html` at the repo root, then copy it into `android-app/www/index.html` (same as a real rebuild would need — this part doesn't go away). On the tablet, **fully close and reopen the app** (swipe it away from recent apps, don't just background it) — that's what makes it re-fetch the file from your laptop's server. There is no "hit save and watch it refresh" here; the refresh only happens on a fresh app launch.

### ⚠️ Real limitation #1 — this is a SEPARATE, empty data set

Unlike Electron's dev mode, this one is the *opposite* risk: pointing the app at `http://192.168.1.42:8100` puts it on a completely different internal address than the real installed app uses, and your data is tied to that address. **The dev build will not show your real tablet stock data — it starts empty.** This is actually convenient: you can freely test workflows here without touching anything real. Just don't mistake "it's empty" for "something broke" — it's supposed to be empty.

### ⚠️ Real limitation #2 — it still talks to the real shared database

Same as Electron's dev mode: the Supabase connection is baked into the HTML regardless of where the page itself loaded from. **A delivery, issue, or spot check submitted from this dev build is a real transaction** that lands in the shared ledger and updates Master List and every other device. Test screens and labels here freely; don't test real workflows unless you mean the numbers to count.

### ⚠️ Before you build a real `.apk` again

**You must put `capacitor.config.json` back to its normal, non-dev form** (no `server` key at all) before running a real "Build APK(s)." If you forget, the shipped app will try to load from your laptop's dev server forever — and break the moment you close that server or leave the WiFi network. The Rebuild Checklist (`docs/REBUILD-CHECKLIST.md`) has a step that checks for exactly this.

### Same setup for Master List's tablet app

Identical process inside `master-list-android-app`, using its own `capacitor.config.dev-example.json` and a different port (`8101`, so you can run both dev servers at once if you ever need to).
