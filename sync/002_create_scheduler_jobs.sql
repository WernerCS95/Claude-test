-- Leader Stores System — Kit Scheduler job registry
-- Run this once in the Supabase SQL Editor for the leader-stores project,
-- same as 001_create_stock_transactions.sql was.
--
-- Unlike stock_transactions (an append-only ledger of deltas), a job record
-- is a single mutable row: its Chassis/Finals dates get set, unset, and
-- re-set as it moves through scheduling, from either Master List or the
-- terminal. So this table allows update, not just insert — the publishable
-- key still can never delete a row outright (a job is marked completed,
-- not removed, matching this app's usual archive-not-delete philosophy).

create table if not exists scheduler_jobs (
  job_nr text primary key,             -- the real job number, matches JOB_SPECS / Parts Issued job numbers
  customer text,
  trailer_type text,                   -- as typed/known today (e.g. "Ratel 3CR12") — may not be a full BOM variant
  variant_code text,                   -- matches Trailer Types & Variants "Variant Code" once confirmed; null = unmatched
  chassis_date date,                   -- null = not yet scheduled for Chassis
  finals_date date,                    -- null = not yet scheduled for Finals
  completed boolean not null default false,
  source_device text not null,         -- which device last touched this row
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists scheduler_jobs_chassis_date_idx on scheduler_jobs (chassis_date);

alter table scheduler_jobs enable row level security;

create policy "Allow read for all" on scheduler_jobs
  for select using (true);

create policy "Allow insert for all" on scheduler_jobs
  for insert with check (true);

create policy "Allow update for all" on scheduler_jobs
  for update using (true);

-- Enables realtime so a job dragged onto a day on one device shows up
-- instantly on the other, same as stock_transactions already does.
alter publication supabase_realtime add table scheduler_jobs;
