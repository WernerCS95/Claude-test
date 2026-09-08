# Developer Docs — Index

These six documents let you make small, safe changes yourself without going through a full rebuild-and-reinstall cycle every time, and give you a way to tell "safe for me" from "send to Claude Code" before you touch anything.

1. **[DEV-MODE.md](DEV-MODE.md)** — run the apps live from the source file, see your edit instantly, no `.exe`/`.apk` rebuild. Read the limitations section before you rely on it.
2. **[FILE-MAP.md](FILE-MAP.md)** — "where is X" for every major feature, by file and line range.
3. **[SAFE-EDIT-CHECKLIST.md](SAFE-EDIT-CHECKLIST.md)** — decide, before touching anything, whether an edit is yours to make or belongs with Claude Code.
4. **[CHROME-DEBUGGING.md](CHROME-DEBUGGING.md)** — see the tablet app's live error console from your laptop, the Android equivalent of the Electron DevTools console that caught the `window.prompt()` bug.
5. **[REBUILD-CHECKLIST.md](REBUILD-CHECKLIST.md)** — the exact, ordered steps to produce a real `.exe`/`.apk` once changes are ready to ship, plus how to prove the new build isn't stale.
6. **[REFERENCE-PATTERNS.md](REFERENCE-PATTERNS.md)** — 4 existing patterns in this codebase worth copying whenever you need something similar, and exactly where to find them.

**Read DEV-MODE.md first.** It has two safety warnings in it (about real data and the real shared database) that matter before you open dev mode even once.
