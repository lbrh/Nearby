-- Run this once in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dmhslwnzarinndwmkkfn/sql/new

create table if not exists public.translations (
  language         text primary key,
  language_display text not null,
  copy             jsonb not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.translations enable row level security;

create policy "public_read" on public.translations
  for select using (true);

create policy "public_insert" on public.translations
  for insert with check (true);

create policy "public_update" on public.translations
  for update using (true);
