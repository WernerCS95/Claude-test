# File Map — "Where Is X?"

Both real source files live at the repo root: **`stores-terminal.html`** (the tablet/floor app, ~8,000 lines) and **`master-list.html`** (the laptop/admin app, ~4,100 lines). Every other copy (`desktop-app/master-list.html`, `android-app/www/index.html`, etc.) is a mirror of one of these two — never edit a mirror directly, always edit the root file and copy it out (the Rebuild Checklist covers this).

Line numbers below are approximate — they'll drift a little every time something's added above them — but the **function/constant names are exact** and are the reliable way to find your way back if a line number is off by a few dozen. Use your editor's "Find" (Ctrl+F) on the bold name in each row.

## `app.html` — the combined app (since 2026-10-20)

One app on both devices: a thin shell with an **Input | Admin** switch at the top.
**Input** loads `stores-terminal.html`, **Admin** loads `master-list.html`, each
unchanged in its own frame (no shared code or styles, no name clashes). Both
frames stay loaded, so each keeps syncing as before. Storage is shared and safe:
Input keys start `leader-stores-`, Admin keys `leader-master-`, the shell only
adds `leader-shell-section-v1` (which section opens). Both source files start with
a small shim that borrows the shell's Android bridge when running in a frame.

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
| Live sync to Master List | `SUPABASE_URL`, `queueTransaction`, `applyRemoteTransaction`, `pullMissedTransactions`, `fetchTransactionsForCatchUp` (7-day overlap, paged), `pinLaptopCorrectionNote` (laptop-correction note on a Today's Log slip) | ~7790–7900 (near the very end of the file) |
| Override rule (incoming laptop correction + tablet activity after it) | `isSupersededByOverride`, `tabletActivityRecordedAfter` (read `spotCheckHistory[].at`) | right after `recordSpotCheckHistory` |
| Aftermarket Delivery (record only, not our stock) | `aftermarketModal` (HTML), `AFTERMARKET_DELIVERIES_KEY`, `AFTERMARKET_ITEMS_KEY`, `fileAftermarketTxn`, `amStartEdit`, `amDelete`, `amSendReplaceOrDelete`; guard at top of `applyRemoteTransaction` | just above `SLIP GRID` |
| Slip Grid (batch capture of paper slips) | `slipGridScreen` (HTML), `SLIP_GRID_KEY`, `sgRender`, `sgReviewBeforePost`, `sgPostAll`, `sgEligible` | just above `RENDER: LOG` |
| Import Counts (from Master List Stock Count) | `importPendingCounts`, `activitySinceCount`, `applyImportedCount`, `APPLIED_COUNT_IDS_KEY`, `importCountsPreviewModal` (HTML) | right after `importStockReference` |
| Backup / Restore / Verify | `BACKUP_LOCALSTORAGE_KEYS`, `downloadFullSnapshot`, `restoreFromSnapshotFile`, `verifyAgainstBackupFile` | search for `BACKUP_LOCALSTORAGE_KEYS` |

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
| Live sync from terminal | `SUPABASE_URL`, `queueMasterTransaction`, `applyRemoteStockTransaction`, `pullMissedStockTransactions`, `fetchTransactionsForCatchUp` (7-day overlap, paged) | ~3886–3990 (near the end of the file) |
| Review Queue (tablet batches: edit / delete / mark reviewed) | `reviewQueueModal` (HTML), `REVIEW_KEY`, `rqBatches`, `renderReviewQueue`, `editLedgerQty`, `editLedgerItem`, `deleteLedgerLine`, `rqAdjust` (sends note + noteId to the tablet) | search for `REVIEW QUEUE + OVERRIDE LOG` |
| Override Log (every laptop change: old, new, when) | `OVERRIDE_LOG_KEY`, `logOverride`, `renderOverrideLog` | same section |
| Aftermarket Deliveries register (record only, print) | `aftermarketModal` (HTML), `AFTERMARKET_KEY`, `fileAftermarketLine`, `amrOpenEdit`, `amrSaveEdit`, `amrDelete`, `printAftermarket`; guard at top of `applyRemoteStockTransaction` | search for `AFTERMARKET DELIVERIES REGISTER` |
| Laptop keyboard fix after pop-ups (Electron, Windows) | `desktop-app/preload.js` (`leaderDesktop.refocus`), `ipcMain.on('leader-refocus')` in `desktop-app/main.js`, alert/confirm wrapper at the top of each page | first `<script>` in app.html, stores-terminal.html, master-list.html |
| Kit Scheduler — Production Planner (schedule .xlsx import, Kit per Type, allocation, order list) | `kitSchedulerModal` (HTML), `PS_*_KEY`, `psReadSheet`, `psImportWorkbook`, `psCompare`, `PSK_*` (kit tables copied from the tablet), `psKitForJob`, `psPlan`, `psCylSupplierFor`, `psOrderList`, `psPrintOrders`; needs `vendor/xlsx.full.min.js` | search for `KIT SCHEDULER — Production Planner` |
| **Order List — one buying list (2.8.6)**: Sections 1 / 1.2 / 2 / 2.1 + Ruben Stoor, picking sheets, SAF airbag check | `olBuild`, `olRender`, `olPrint`, `olPickingSheets`, `OL_*_KEY`, `psIssuedToJob`, `psSafFlags` | search for `ORDER LIST — one buying list` |
| Print Full Count Sheet from Admin (uses Input's print) | `printFullCountAdminBtn`, `fcInputWindow`, `fcAdminModal` | Reports menu; search `PRINT FULL COUNT SHEET (from Admin)` |
| Kit Scheduler working days + 📆 Day changes (holidays, working Saturdays, shift / catch up) | `PS_SA_HOLIDAYS`, `psIsWorkday`, `psDays`, `psShiftPlan`, `psRunShift`, `psRunCatchUp`, `psDaysBoxHtml` | search `Working days: weekends, public holidays` |
| Issued History / tally (filters, totals, print) | `issuedHistoryModal` (HTML), `ihRows`, `ihTotals`, `printIssuedHistory` | search for `ISSUED HISTORY / TALLY` |
| Override rule (laptop correction wins, exact time) | `isSupersededByOverride` (reads `spotLedger[].at`) | right above `applyRemoteStockTransaction` |
| Price Compare (supplier prices, preferred supplier) | `SUPPLIER_PRICES_KEY`, `SUPPLIER_SETTINGS_KEY`, `buyFromInfoForSku`, `priceCompareModal` (HTML) | search for `SUPPLIER PRICE COMPARISON` |
| Stock Count (count entry + Export Pending Counts) | `PENDING_COUNTS_KEY`, `renderStockCountResults`, `laptopActivitySinceCount`, `scExportPendingBtn` | search for `STOCK COUNT ======` |
| Stock Level Report (read-only, by supplier) | `STOCK_LEVEL_BELOW_MIN_INCLUSIVE`, `isBelowMin`, `buildStockLevelReportData`, `printStockLevelReport` | right after the Stock Count section |
| Backup / Restore / Verify | `MASTER_BACKUP_LOCALSTORAGE_KEYS`, `downloadMasterFullSnapshot`, `masterDataCounts`, `verifyMasterBackupBtn` | search for `MASTER_BACKUP_LOCALSTORAGE_KEYS` |

## Quick orientation rule

In both files, the very top of the `<script>` block is mostly **setup** (constants, localStorage keys, one-time data seeds). The very bottom is mostly the **live sync module** (Supabase connection, push/pull functions) — that's deliberate, it's the last thing wired up historically and stayed there. Everything in between is organized roughly in the order features were built, not alphabetically or by category — so searching by name (Ctrl+F) is always faster than scrolling.
