# Known Issues — parked for a later phase

## 1. Two stock figures per device (parked 2026-10-20)

Since the merge into one app (Input + Admin sections), each device still holds
**two separate stock figures** for the same item:

- **Input** (`stores-terminal.html`) — Qty on Hand in `leader-stores-qty-on-hand-v1`
- **Admin** (`master-list.html`) — `stock[].qty` in `leader-master-stock-v1`

They are kept in line by the existing live sync (Supabase `stock_transactions`),
exactly as when they were two apps. Offline, or if a sync is missed, the two can
drift apart on the same device.

Fix (later phase): make one of them the single source and have the other section
read it, instead of keeping its own copy. Needs its own plan and data migration.

## 2. Verify Against Backup says "laptop" on the tablet (noted 2026-10-20)

Admin's Verify message reads "MISSING on this laptop now" even when it runs on
the tablet. Wording only — the check itself is correct. Fix: say "this device".

## 3. Tablet once showed the app on only the left part of the screen (noted 2026-10-20)

After returning from a file picker, the app drew in a narrower area with grey on
the right. Seen once; not reproduced. If it happens again, note what was done just
before (file picker, rotation, keyboard) — likely the shell needs to re-measure the
screen when the tablet resizes or rotates.

## 4. Live sync not yet confirmed working (noted 2026-10-20)

Both the Supabase live sync and the file/paste-code transfer are active. Which one
actually carries the data between tablet and laptop hasn't been tested. Must be
tested before Phase 1c (exact-time overrides): tablet Spot Check -> laptop should
show a corner pop-up within a minute.
