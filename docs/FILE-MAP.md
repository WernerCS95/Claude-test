# File Map — "Where Is X?"

Both real source files live at the repo root: **`stores-terminal.html`** (the tablet/floor app, ~8,000 lines) and **`master-list.html`** (the laptop/admin app, ~4,100 lines). Every other copy (`desktop-app/master-list.html`, `android-app/www/index.html`, etc.) is a mirror of one of these two — never edit a mirror directly, always edit the root file and copy it out (the Rebuild Checklist covers this).

Line numbers below are approximate — they'll drift a little every time something's added above them — but the **function/constant names are exact** and are the reliable way to find your way back if a line number is off by a few dozen. Use your editor's "Find" (Ctrl+F) on the bold name in each row.

## `stores-terminal.html` (tablet/floor terminal)

| Feature | What to search for | Roughly where |
|---|---|---|
| Diesel tank tracking | `DIESEL_TANK_LEVEL_KEY`, `renderDieselTankGaugeMini`, `dieselModal` (HTML) | ~1140–1231 (screen), ~5136–6050 (logic) |
| Generator tank tracking | `GENERATOR_TANK_LEVEL_KEY`, `renderGeneratorTankGaugeMini` | ~5144–5650 |
| Gas bottles | `loadGasState`, `renderGasBottleModal`, `openGasBottleModal` | ~1725–1731 (storage), ~6916–6930 (screen) |
| Vehicle registration & service tracking | `loadVehicleRegistry`, `openVehicleServicePage`, `renderVehicleServiceList` | ~5523–5560 (storage), ~6050–6130 (screen) |
| Nameplates | `NAMEPLATE_QTY_KEY`, `NAMEPLATE_CLIENT_MAP_KEY`, `formatNameplateText`, `openNameplatesModal`, `NAMEPLATE_PHYSICAL_COUNT_2026_09_07` | ~1872–2020 |
| Goods Received (deliveries in) | `loadGoodsReceived`, `openGoodsReceivedModal`, `renderGoodsReceivedHistory` | ~2624–2660 (storage/open), ~5731 (history list) |
| Parts Issued (slips) | `LOG_KEY`, `state.log`, `editLogEntry`, `submitBtn` onclick | ~3953 onward |
| Manual Sync Code (fallback for live sync) | `RECENT_TXN_LOG_KEY`, `copyManualSyncCodeBtn` | ~7737 |
| Live sync to Master List | `SUPABASE_URL`, `queueTransaction`, `applyRemoteTransaction`, `pullMissedTransactions` | ~7790–7900 (near the very end of the file) |

Order Lists and most Admin/Reports screens live in **`master-list.html`**, not here — the terminal is a capture device, Master List is where planning/reporting happens.

## `master-list.html` (laptop/admin)

| Feature | What to search for | Roughly where |
|---|---|---|
| Diesel tank gauge (mirrors terminal readings) | `renderDieselTankGauge`, `correctTankBtn` | ~2016 |
| Generator tank gauge | `renderGeneratorTankGauge`, `correctGeneratorTankBtn` | ~2061 |
| Nameplates section | `renderNameplatesSection`, `nameplatesBody` | ~2169–2249 |
| Goods Received Ledger | `renderGoodsReceivedLedger`, `goodsReceivedLedgerWrap` | ~2755–2900 |
| Parts Issued ledger (live from terminal) | `renderLedger`, `ledgerWrap`, `addHistoryFromRemoteTransaction` | ~2900–2965 |
| Order Lists | `openOrderListModal`, `generateOrderList`, `renderOrderListModal`, `orderListsBtn` | ~700–1420 |
| Reports menu (Director Statement, Spot Check print) | `reportsMenuModal` (HTML), `generateDirectorStatement` | ~150 (screen), ~1377 (logic) |
| Admin menu (New Day, Retired Items, Supplier Codes, Full Reset) | `adminMenuModal` (HTML) | ~161–172 |
| Catalog gap-filling (new items, missing fields) | `syncMissingCatalogFields` | ~519 |
| Manual Sync Code (paste-in fallback) | `pasteManualSyncBtn`, `applyManualSyncBtn` | search for `pasteManualSyncBtn` |
| Live sync from terminal | `SUPABASE_URL`, `queueMasterTransaction`, `applyRemoteStockTransaction` | ~3886–3990 (near the end of the file) |

## Quick orientation rule

In both files, the very top of the `<script>` block is mostly **setup** (constants, localStorage keys, one-time data seeds). The very bottom is mostly the **live sync module** (Supabase connection, push/pull functions) — that's deliberate, it's the last thing wired up historically and stayed there. Everything in between is organized roughly in the order features were built, not alphabetically or by category — so searching by name (Ctrl+F) is always faster than scrolling.
