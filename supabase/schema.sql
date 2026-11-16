-- Magic Team site: run once in the Supabase SQL editor (Project → SQL Editor → New query → Run).
-- Only the server (service-role key) touches these tables, so RLS is on with no policies:
-- the public anon/publishable key can't read or write anything.

create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id text primary key,
  created_at timestamptz not null default now(),
  data jsonb not null
);
create index if not exists messages_created_at_idx on public.messages (created_at desc);

create table if not exists public.documents (
  id text primary key,
  type text not null,
  created_at timestamptz not null default now(),
  data jsonb not null
);
create index if not exists documents_type_created_idx on public.documents (type, created_at desc);

alter table public.site_content enable row level security;
alter table public.messages enable row level security;
alter table public.documents enable row level security;

-- Public bucket for images/videos uploaded from the dashboard (50MB = free plan max per file)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'uploads', 'uploads', true, 52428800,
  array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','image/avif',
        'video/mp4','video/webm','video/quicktime','video/x-m4v']
)
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
