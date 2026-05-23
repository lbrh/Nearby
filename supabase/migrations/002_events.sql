create table if not exists public.events (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null,
  description text        not null default '',
  category    text        not null default '',
  suburb      text        not null default '',
  address     text        not null default '',
  phone       text        not null default '',
  email       text        not null default '',
  website     text        not null default '',
  event_date  date        not null,
  start_time  time        not null,
  end_time    time        not null,
  repeat_type text        not null default 'none'
                          check (repeat_type in ('none', 'daily', 'weekly', 'monthly', 'yearly')),
  created_at  timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "public_read_events"  on public.events for select using (true);
create policy "auth_insert_events"  on public.events for insert with check (auth.uid() = user_id);
create policy "auth_update_events"  on public.events for update  using (auth.uid() = user_id);
create policy "auth_delete_events"  on public.events for delete  using (auth.uid() = user_id);
