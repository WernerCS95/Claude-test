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

## 4. Live sync — RESOLVED 2026-10-20

Tested: a tablet Spot Check showed on the laptop within a minute. The Supabase
live sync is the channel actually carrying data.

## 5. A slip uploaded late can be missed by a device that was closed (noted 2026-10-20)

`created_at` on a synced transaction is when it was entered on its device. A
device that was closed asks only for transactions newer than the last one it saw.
So: tablet offline, slips entered, laptop app opened and pulls newer rows,
tablet comes online later and uploads the older-dated slips — the laptop's
"newer than" pull can skip them. While both apps are open, the live channel
catches them regardless. Fix needs a server-side "received at" column on
`stock_transactions` (small database change) and pulling by that instead.
Ask before changing the database.
