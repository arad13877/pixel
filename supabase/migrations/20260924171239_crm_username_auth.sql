alter table public.profiles
  add column username text,
  add constraint profiles_username_format
    check (username is null or username ~ '^[a-z0-9_]{3,32}$');

create unique index profiles_username_unique
  on public.profiles(username)
  where username is not null;

comment on column public.profiles.username is
  'Case-normalized login name. The verified email remains in auth.users.';

-- The username is a one-time claim, not a profile field that can be cleared to
-- regain magic-link access after account setup.
revoke update on public.profiles from authenticated;
drop policy if exists profiles_update on public.profiles;
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated using (
  exists (
    select 1 from public.workspace_members mine
    join public.workspace_members theirs on theirs.workspace_id = mine.workspace_id
    where mine.user_id = (select auth.uid()) and mine.is_active
      and theirs.user_id = profiles.id and theirs.is_active
  )
);

create or replace function public.claim_username(p_username text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_username is null or p_username !~ '^[a-z0-9_]{3,32}$' then
    raise exception 'invalid_username' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.workspace_members m
    where m.user_id = (select auth.uid()) and m.is_active
  ) or not exists (
    select 1 from auth.users u
    where u.id = (select auth.uid()) and coalesce(u.encrypted_password, '') <> ''
  ) then
    raise exception 'account_not_ready' using errcode = '42501';
  end if;
  update public.profiles
  set username = p_username
  where id = (select auth.uid()) and username is null;
  if not found then
    raise exception 'username_already_set' using errcode = '23505';
  end if;
end;
$$;

revoke all on function public.claim_username(text) from public, anon;
grant execute on function public.claim_username(text) to authenticated;
