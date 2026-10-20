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
