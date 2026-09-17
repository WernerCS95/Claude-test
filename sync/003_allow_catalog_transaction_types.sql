-- Leader Stores System — allow catalog-change transaction types
-- Run this once in the Supabase SQL Editor for the leader-stores project.
--
-- The original stock_transactions table's CHECK constraint only allowed
-- 'delivery','issue','spot_check','adjustment' — every rename/category
-- move/retire/restore transaction has been silently rejected by the
-- database itself since those types were added, with no error surfaced
-- back to the app (the client only distinguishes a unique-violation from
-- "some other error, stay queued and retry" — it never actually reads
-- the rejection reason).

alter table stock_transactions drop constraint if exists stock_transactions_type_check;

alter table stock_transactions add constraint stock_transactions_type_check
  check (type in ('delivery','issue','spot_check','adjustment','item_rename','item_category','item_retire','item_restore'));
