# Seeing the Tablet App's Console (Chrome Remote Debugging)

On the laptop, Electron's DevTools console shows every error the app hits live — that's exactly how the `window.prompt()` bug got found and confirmed. The tablet app doesn't have its own visible console (there's no keyboard shortcut to open one on Android), but you can see the *exact same kind of console* on your laptop screen, live, while the app runs on the tablet. This walks through it without needing to learn Android Studio's full interface.

## Do you need Android Studio installed?

**Yes, but only for one small part of it** — not to write code, not to open a project, just because it's the tool that installs `adb` (Android Debug Bridge), the piece that lets your laptop and tablet talk to each other over USB. If you already installed Android Studio to build the `.apk` (see `REBUILD-CHECKLIST.md`), you already have this — nothing extra to install.

## Step-by-step

### 1. Turn on Developer Options on the tablet (skip if already done)
Settings → About tablet → tap "Build number" 7 times. A toast message says "You are now a developer."

### 2. Turn on USB debugging
Settings → Developer options → toggle **USB debugging** on.

### 3. Plug the tablet into the laptop via USB
A popup on the tablet asks "Allow USB debugging?" — check "Always allow from this computer" and tap **Allow**.

### 4. Open the Stores Terminal app on the tablet
Just open it normally, like you would any other time.

### 5. On the laptop, open Chrome (regular Chrome browser, not the app) and go to:
```
chrome://inspect
```

### 6. Find the app in the list
Under "Remote Target," you should see an entry for the tablet with something like `co.leadertrailers.storesterminal` or the app's page title underneath it. If nothing shows up after a few seconds:
- Check the USB debugging popup wasn't missed on the tablet (unplug and replug if needed).
- Make sure "Discover USB devices" is ticked (checkbox near the top of the `chrome://inspect` page).

### 7. Click "inspect" under that entry
A new window opens — this **is** the tablet app's console, live, exactly like Electron's DevTools. Anything the app logs, any error it hits, shows up here in real time as you use the app on the tablet in your hand.

### 8. Use it like you would on the laptop
- The **Console** tab shows errors and anything logged with `console.log(...)`, `console.error(...)`.
- The **Elements** tab lets you inspect the actual screen layout, same as on the laptop app.
- Typing directly into the Console box runs JavaScript against the live tablet app — useful for a quick check (e.g. typing `document.lastModified`, see `REBUILD-CHECKLIST.md`, to confirm which build is running) without needing to add anything to the app itself.

## When to use this

Any time something "just doesn't work" on the tablet with no obvious reason — a button that does nothing, a screen that looks blank — this is the first place to look, the same instinct as opening DevTools on the laptop. If you see a red error message you don't understand, copy the exact text and send it to Claude Code — that error message is almost always the whole answer.
