-- Bloomia — Supabase schema
-- Run in the Supabase SQL editor.

create table orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  email text,                          -- nullable: added at Step 6 (profile)
  name text,                           -- nullable: added at Step 6 (profile)
  stripe_session_id text unique,
  status text default 'incomplete',    -- incomplete | pending | paid | delivered | failed
  current_step integer default 1,      -- tracks how far user got
  intake_data jsonb not null default '{}'::jsonb,
  protocol_data jsonb,
  access_token text unique,            -- secret token for the hosted /protocol/<token> page
  error_message text
);

-- Auto-update updated_at on every change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Merge partial intake data into existing jsonb (used by update-intake route)
create or replace function merge_intake_data(p_order_id uuid, p_partial jsonb, p_step integer)
returns void as $$
  update orders
  set
    intake_data = intake_data || p_partial,
    current_step = p_step,
    -- Promote email/name to top-level columns when they appear (Step 6)
    email = coalesce((p_partial->>'email'), email),
    name  = coalesce((p_partial->>'name'),  name)
  where id = p_order_id;
$$ language sql;

-- Indexes
create index orders_stripe_session_id_idx on orders(stripe_session_id);
create index orders_email_idx on orders(email);
create index orders_status_idx on orders(status);
create index orders_created_at_idx on orders(created_at desc);
-- access_token already has a unique index from the column constraint above.

-- ───────────────────────────────────────────────────────────────
-- Migration for an EXISTING orders table (run only if the table was
-- created before access_token existed):
--
--   alter table orders add column access_token text unique;
-- ───────────────────────────────────────────────────────────────
