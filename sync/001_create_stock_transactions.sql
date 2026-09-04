-- Leader Stores System — shared transaction ledger
-- Run this once in the Supabase SQL Editor for the leader-stores project.

create table if not exists stock_transactions (
  id text primary key,                 -- client-generated unique id (so a retried push never double-counts)
  item_id text not null,               -- sku / item id, matches the ids already used in both HTML files
  type text not null check (type in ('delivery','issue','spot_check','adjustment')),
  delta_qty numeric,                   -- for delivery / issue / adjustment: the +/- change
  absolute_qty numeric,                -- for spot_check: the true counted value (overrides everything before it)
  source_device text not null,         -- which device made this entry (tablet name / "Master List" / "Laptop Terminal")
  created_at timestamptz not null default now(),
  meta jsonb                           -- optional: supplier, job no, worker name, grn no, etc.
);

create index if not exists stock_transactions_item_id_idx on stock_transactions (item_id, created_at);

-- Append-only ledger: nothing is ever edited or deleted from the client,
-- corrections happen by adding a new spot_check row, same principle as
-- the existing local logic. Row Level Security is on; the publishable
-- key can only insert and read, never update or delete.
alter table stock_transactions enable row level security;

create policy "Allow read for all" on stock_transactions
  for select using (true);

create policy "Allow insert for all" on stock_transactions
  for insert with check (true);

-- Enables realtime so both devices get notified the instant a new
-- transaction is inserted by the other one.
alter publication supabase_realtime add table stock_transactions;
