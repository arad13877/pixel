create type public.portfolio_status as enum ('draft', 'published', 'archived');

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  kind text not null check (kind in ('client', 'concept')),
  status public.portfolio_status not null default 'draft',
  draft_payload jsonb not null,
  published_payload jsonb,
  sort_order integer not null default 100,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  published_by uuid references auth.users(id),
  published_at timestamptz,
  archived_at timestamptz,
  consent_confirmed_at timestamptz,
  consent_confirmed_by uuid references auth.users(id),
  deployment_status public.article_deploy_status not null default 'idle',
  deployment_error text,
  deployment_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_payload_objects check (jsonb_typeof(draft_payload) = 'object' and (published_payload is null or jsonb_typeof(published_payload) = 'object')),
  constraint portfolio_published_snapshot check (status <> 'published' or (published_payload is not null and published_at is not null))
);

create index portfolio_items_workspace_order_idx on public.portfolio_items(workspace_id, sort_order, id);
create index portfolio_items_public_idx on public.portfolio_items(sort_order, id) where status = 'published' and archived_at is null;
create trigger portfolio_items_updated before update on public.portfolio_items for each row execute function private.set_updated_at();

alter table public.portfolio_items enable row level security;
revoke all on public.portfolio_items from public, anon, authenticated;
grant select(id, kind, status, published_payload, sort_order, published_at, updated_at, archived_at) on public.portfolio_items to anon;
grant select on public.portfolio_items to authenticated;
grant select, insert, update, delete on public.portfolio_items to service_role;
create policy portfolio_public_select on public.portfolio_items for select to anon using (
  status = 'published' and published_payload is not null and archived_at is null
);
create policy portfolio_member_select on public.portfolio_items for select to authenticated using (
  private.is_workspace_member(workspace_id)
);

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values
  ('portfolio-drafts', 'portfolio-drafts', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('portfolio-covers', 'portfolio-covers', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict(id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy portfolio_drafts_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'portfolio-drafts' and private.is_workspace_member(((storage.foldername(name))[1])::uuid)
);
create policy portfolio_drafts_select on storage.objects for select to authenticated using (
  bucket_id = 'portfolio-drafts' and private.is_workspace_member(((storage.foldername(name))[1])::uuid)
);

-- Existing fictional concepts only. No customer content is seeded.
insert into public.portfolio_items(id, workspace_id, kind, status, draft_payload, published_payload, sort_order, published_at)
values
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'concept', 'published',
    '{"title":"نیلورا؛","subtitle":"آرامش، پیش از اولین مراجعه.","description":"یک لندینگ فارسی برای کلینیک دندانپزشکی فرضی؛ با مسیر روشن آشنایی با خدمات و فرم نمایشی درخواست نوبت.","link":"/portfolio/nilora/","imagePath":"/images/nilora/reception.jpg","imageAlt":"فضای داخلی فرضی کلینیک دندانپزشکی نیلورا","imageWidth":1536,"imageHeight":1024,"label":"NILORA / DENTAL CONCEPT","service":"طراحی لندینگ","conceptNote":"کانسپت نمایشی پیکسل؛ کلینیک واقعی نیست","theme":"mint"}'::jsonb,
    '{"title":"نیلورا؛","subtitle":"آرامش، پیش از اولین مراجعه.","description":"یک لندینگ فارسی برای کلینیک دندانپزشکی فرضی؛ با مسیر روشن آشنایی با خدمات و فرم نمایشی درخواست نوبت.","link":"/portfolio/nilora/","imagePath":"/images/nilora/reception.jpg","imageAlt":"فضای داخلی فرضی کلینیک دندانپزشکی نیلورا","imageWidth":1536,"imageHeight":1024,"label":"NILORA / DENTAL CONCEPT","service":"طراحی لندینگ","conceptNote":"کانسپت نمایشی پیکسل؛ کلینیک واقعی نیست","theme":"mint"}'::jsonb,
    10, now()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'concept', 'published',
    '{"title":"وِلوما؛","subtitle":"فشن، بدون قواعد تکراری.","description":"یک لندینگ فارسی برای برند پوشاک فرضی؛ با تصویرپردازی ادیتوریال، تایپوگرافی جسور و مسیری ساده برای کشف کالکشن نمایشی.","link":"/portfolio/veloma/","imagePath":"/images/veloma/hero.jpg","imageAlt":"تصویر ادیتوریال نمایشی فشن وِلوما با کت تیره در استودیو","imageWidth":1122,"imageHeight":1402,"label":"VELOMA / FASHION CONCEPT","service":"طراحی لندینگ","conceptNote":"کانسپت نمایشی پیکسل؛ برند واقعی نیست","theme":"sand"}'::jsonb,
    '{"title":"وِلوما؛","subtitle":"فشن، بدون قواعد تکراری.","description":"یک لندینگ فارسی برای برند پوشاک فرضی؛ با تصویرپردازی ادیتوریال، تایپوگرافی جسور و مسیری ساده برای کشف کالکشن نمایشی.","link":"/portfolio/veloma/","imagePath":"/images/veloma/hero.jpg","imageAlt":"تصویر ادیتوریال نمایشی فشن وِلوما با کت تیره در استودیو","imageWidth":1122,"imageHeight":1402,"label":"VELOMA / FASHION CONCEPT","service":"طراحی لندینگ","conceptNote":"کانسپت نمایشی پیکسل؛ برند واقعی نیست","theme":"sand"}'::jsonb,
    20, now()
  )
on conflict(id) do nothing;

create function public.reorder_portfolio_items(p_workspace_id uuid, p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare expected_count integer;
begin
  select count(*) into expected_count from public.portfolio_items
  where workspace_id = p_workspace_id and archived_at is null;
  if cardinality(p_ids) <> expected_count
     or (select count(distinct u.item_id) from unnest(p_ids) as u(item_id)) <> expected_count
     or exists (
       select 1 from unnest(p_ids) as u(item_id)
       where not exists (
         select 1 from public.portfolio_items p
         where p.id = u.item_id and p.workspace_id = p_workspace_id and p.archived_at is null
       )
     ) then
    raise exception 'invalid_portfolio_order';
  end if;
  update public.portfolio_items p
  set sort_order = ordered.position * 10
  from unnest(p_ids) with ordinality as ordered(id, position)
  where p.id = ordered.id and p.workspace_id = p_workspace_id;
end;
$$;
revoke all on function public.reorder_portfolio_items(uuid, uuid[]) from public, anon, authenticated;
grant execute on function public.reorder_portfolio_items(uuid, uuid[]) to service_role;
