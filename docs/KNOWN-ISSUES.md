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

## 5. A slip uploaded late can be missed by a device that was closed — RESOLVED in 2.4 (2026-10-20)

Each catch-up now re-reads the last 7 days of transactions (paged, 1000 at a
time) instead of only "newer than the last one seen". Anything already applied
is skipped by its id, so nothing counts twice; a late-uploaded slip up to 7 days
old is picked up. The catch-up point only ever moves forward. No database change.
The laptop also skips a transaction already in its ledgers (second guard).
Limit: a device that stays offline more than 7 days *after* the slip was entered
still needs the live channel or a backup check.

## 6. Laptop review edits shown on the tablet's slip — RESOLVED in 2.4 (2026-10-20)

When a line is edited, moved to another item or deleted in the laptop's Review
Queue, the adjustment carries a short note. The tablet pins it on the original
slip in Today's Log: "✎ Corrected on laptop <date>: <what changed>" (purple).
The original slip lines stay as posted; the note explains where the stock went.

## 7. Old separate apps — RESOLVED at the 2.3 install (2026-10-20)

Only the one app runs from 2.3 on. The old stand-alone Leader Master List app on
the tablet is uninstalled during the 2.3 install, after Admin is verified (its
data was moved into Admin at the 2.0 install).

## 8. Aftermarket edit / delete — RESOLVED (2026-10-20)

Recorded aftermarket deliveries can be edited or deleted on the tablet (Recent
list on the Aftermarket Delivery screen) and on the laptop (register). The change
syncs as one replace/delete for the whole delivery; newest edit wins; a deleted
delivery stays as a marker so late lines can't bring it back. Laptop edits and
deletes are in the Override Log. Never touches stock.

## 9. Kit Scheduler — real schedule checked (2026-10-21)

"Production Target Week 12 Okt - 23 Okt 2026 nr 1.xlsx" reads cleanly: 98 jobs,
468 unit rows, 5 Oct – 1 Dec. Road trains come as T + D + F with the customer
only on T — D and F now inherit from T (as F does from L on a link). A lone "0"
in Type/Customer/Axles is treated as blank. Flags on this file: 460 F listed
twice (Chassis and Finals) and 459 has no F — the flag names 459 F as the
likely intended row. Test case holds: WST 14–20 covered from JOST on hand,
Como short on JOST from 511, need-by 3 Nov, order by Fri 30 Oct (with 30 on hand).
T + D + F jobs (NWB, Como "Tridem ST") are drawbar road trains: Drawbar kit by
default, 4 cylinders per job. Types not matched yet: 20m Ratel (WST),
53 HWP (Gemini), Sement FD — pick "Kit based on" or fill in under Kit per Type.
