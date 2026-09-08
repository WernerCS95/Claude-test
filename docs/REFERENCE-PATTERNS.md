# Reference Patterns — The "Correct Way" for 4 Common Needs

When Claude Code builds something new, pointing it at one of these existing patterns (rather than describing what you want from scratch) gets a more consistent result, because it's reusing something already tested rather than inventing a new approach that might behave differently.

## 1. Correcting a mistaken entry (reverse-then-reapply, never delete-then-recreate)

**Where:** `stores-terminal.html`, `reverseLogEntryStock()` (~line 7508) and `editLogEntry()` (~line 7530). The Nameplates "undo" button added later (search `undoNameplateLogEntry`) follows the exact same idea for a different ledger.

**What it does:** when you correct an already-submitted Parts Issued slip (or undo a Nameplates Fit/Cut), the app never deletes the old entry and creates a fresh one with a new ID. Instead it reverses the stock change the original entry made (adding back what was deducted, or the reverse), *then* mutates the same entry in place with the corrected details, and finally reapplies the new deduction. The entry's identity never changes.

**Why this is the reference example:** an earlier version of this feature deleted-and-recreated on every edit, which created duplicate deductions the first time it got used in real testing (a real bug, not hypothetical). Reverse-then-reapply on the same record is what actually keeps stock counts correct across an edit, and it's the pattern to ask for by name ("do it like the Parts Issued edit fix") any time a future feature needs "let the user fix a mistake after the fact."

## 2. Asking the user for typed input (the in-app prompt modal)

**Where:** `showPromptModal()` in both files (`stores-terminal.html` ~line 1618, `master-list.html` ~line 436).

**What it does:** a styled on-screen box with a text field, Cancel and OK buttons, returning what was typed (or `null` if cancelled) — used everywhere the app needs to ask a quick question, like "What should this tablet be called?"

**Why this is the reference example:** the browser's plain built-in `prompt()` function is completely broken inside the packaged Electron app — it throws an error and silently does nothing the moment it's called, which was a real, confirmed bug found through testing. `showPromptModal()` is the fix, already used everywhere `prompt()` used to be. Any new feature that needs to ask the user to type something should call this, never the plain `prompt()` — this is exactly the kind of Electron-specific gap the Safe-Edit Checklist warns about.

## 3. Archiving instead of deleting (Retired Items / Retired Stock)

**Where:** `stores-terminal.html`, search `RETIRED_ITEMS_KEY` (~line 5412). `master-list.html`, search `RETIRED_STOCK_KEY` (~line 646).

**What it does:** removing an item from active use (a discontinued part, an old vehicle) moves it to a separate "retired" list rather than deleting it outright. It disappears from the normal groups/search, but stays fully restorable, and — critically — every historical record that mentions it (past deliveries, past issues) is completely untouched.

**Why this is the reference example:** this is the app's general philosophy toward anything that "goes away" — nothing is ever truly deleted if it has history attached, because deleting it would silently break old records that reference it. Any future "remove this" feature (a worker who left, a discontinued kit, a closed job) should follow this same soft-archive shape rather than a hard delete, unless there's a specific reason history doesn't matter for that particular thing.

## 4. A one-time correction that can't double-apply, even across devices

**Where:** `stores-terminal.html`, `seedNameplatePhysicalCountOnce()` and the deterministic transaction ID pattern (search `npcount-2026-09-07-`).

**What it does:** when the Nameplates physical stock count needed to be applied once, each transaction it pushes to the shared database uses a **deterministic ID** built from the plate's name (not the usual random ID every other transaction gets) — so if this ever accidentally ran twice, or on two different devices, the database itself rejects the second attempt as a duplicate, rather than quietly double-applying the same correction.

**Why this is the reference example:** this project's worst bugs so far have all been variations of "the same real-world event got counted twice" (the original manual-import double-counting, the Parts Issued edit duplication). Any future one-off bulk correction — a fresh physical count for a different category, a batch fix after finding a data error — should follow this same shape: a guarded, one-time function, using a deterministic ID tied to *what* is being corrected rather than *when* it happened to run.
