# Safe-Edit Checklist

Before touching anything in `stores-terminal.html` or `master-list.html`, find your change in the list below. If it's not obviously in the "Safe" column, treat it as "Send to Claude Code" — the cost of asking unnecessarily is a few minutes; the cost of guessing wrong on a "not safe" one is a stock-count bug that's hard to trace back.

## ✅ Safe for you to edit directly

| What it looks like in the file | Example | Why it's safe |
|---|---|---|
| Plain text between HTML tags | `<h2 class="section">Parts Issued — Live From Terminal</h2>` | This is just a label. Changing the words changes what's displayed and nothing else — there's no logic reading or depending on this exact text. |
| Button/label text | `<button ...>+ Add Item to Stock List</button>` | Same reasoning — the button's behavior is wired to its `id` (e.g. `id="addNewItemBtn"`), never to its visible words. Change the words, leave the `id=` alone. |
| Placeholder text in a text box | `placeholder="e.g. 80"` | Purely a hint shown when the box is empty. No effect on what happens when you type or submit. |
| `alert(...)` and `confirm(...)` message wording | `alert("Nothing to upload — no new slips...")` | These are just the words in a popup box. Change the sentence, keep the quote marks (`"`) around it intact. |
| A color, spacing, or font-size value inside `style="..."` | `style="color:var(--gold); font-size:26px;"` | Visual only. **Caveat:** only change values you can see the immediate effect of (a color, a size in `px`) — don't touch the parts that look like `flex`, `grid`, `display`, or anything with `var(--...)` you don't recognize, since layout math can break in ways that only show up on a different screen size. When in doubt on a layout change, screenshot before and after and compare on both the laptop and tablet screen sizes before trusting it. |

**The pattern to recognize:** if the thing you're changing is a sentence a human reads, and everything around it stays exactly the same shape (same quote marks, same `id=`, same number of commas/brackets), it's safe.

## 🚫 Send to Claude Code — don't edit these yourself

| What it looks like | Example | Why it's risky |
|---|---|---|
| Anything calling `queueTransaction(...)` or `queueMasterTransaction(...)` | `queueTransaction({ item_id: text, type: 'issue', delta_qty: -qty, ... })` | This is what pushes a real change to the shared stock database. A typo here (wrong field name, wrong sign on a number) doesn't crash anything visibly — it silently sends wrong numbers to every other device, and you likely won't notice until a stock count looks wrong days later. |
| Anything with `localStorage` in it, especially a `_KEY` constant | `const NAMEPLATE_QTY_KEY = 'leader-stores-nameplate-qty-v1';` | These are the exact internal names your saved data is filed under. Changing one — even by a single character — makes the app treat all your existing data as if it doesn't exist, because it's now looking under a different name. This has already caused real, painful bugs this project. |
| `syncMissingCatalogFields()` or anything referencing `OPENING_STOCK` | in `master-list.html` around line 519 | This is the logic that decides which stock data is "real" (never overwrite) versus "still a gap" (safe to fill in). Editing it wrong can silently overwrite real counted stock with old reference numbers, or the reverse. |
| Anything inside `main.js` (Electron) touching `protocol.handle`, `BrowserWindow`, or the `app://leaderapp` address | `desktop-app/main.js`, `desktop-terminal-app/main.js` | This controls where your data is actually stored on the laptop. Getting it wrong can make the app start up with what looks like empty, lost data — even though nothing was actually deleted, the app is just looking in the wrong place. |
| Anything in `capacitor.config.json` or `AndroidManifest.xml` | `android-app/capacitor.config.json`, `master-list-android-app/android/app/src/main/AndroidManifest.xml` | Same risk as above but for the tablet — the `appId` here is what ties an install to its existing data. Change it and the next install looks like a brand new, empty app. |
| Any date/time handling code | `.toISOString()`, `mostRecentSpotCheckDateFor(...)`, anything comparing `.slice(0,10)` on a date string | The "a spot check always wins over an older delivery" rule (and similar rules) depend on exact date comparisons. A small change here can flip which entry "wins" for stock still counted correctly today, silently corrupting a count next week. |
| Any actual number math on quantities | `adjustQtyOnHand(...)`, `adjustNameplateQty(...)`, anything with `+=`, `-=`, or `Math.max(0, ...)` around a quantity | This is the arithmetic that keeps stock counts correct across two devices editing at once. It looks like ordinary addition/subtraction, but the specific order and guards (like never letting stock go below 0) exist because of real bugs found through testing. |
| Anything that behaves differently between the terminal and Master List, or between the `.exe` and the `.apk` | Sync code, `window.prompt()`-style browser APIs, anything using `navigator.` | These are exactly the kind of change that looked fine in a plain browser and broke once packaged (the `window.prompt()` bug is the textbook example). If a change touches how the app talks to Electron or Android specifically rather than just what's on screen, it needs testing in the actual packaged app, not a guess.

## The one-question shortcut

Ask yourself: **"If I typo this, will something visibly look wrong right away, or will it quietly do the wrong math somewhere I won't see today?"**

- Visibly wrong right away (a missing bracket breaks the whole page, a word is misspelled) → safe to try, you'll know instantly if you got it wrong, and dev mode (see `DEV-MODE.md`) shows you before it ever reaches the real installed app.
- Quietly wrong, discoverable only later, in a different screen, or on a different device → send it to Claude Code.
