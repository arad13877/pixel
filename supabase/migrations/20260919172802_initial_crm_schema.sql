-- Pixel CRM v1 schema. Production data is intentionally not seeded.
create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  timezone text not null default 'Asia/Tehran',
  currency_code text not null default 'IRT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (full_name is null or char_length(full_name) <= 160),
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin','member')),
  is_active boolean not null default true,
  invited_at timestamptz not null default now(),
  deactivated_at timestamptz,
  primary key (workspace_id,user_id)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  website text,
  description text,
  owner_id uuid not null references public.profiles(id),
  archived_at timestamptz,
  archived_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  full_name text not null check (char_length(full_name) between 1 and 160),
  phone text,
  email text,
  preferred_channel text check (preferred_channel is null or preferred_channel in ('phone','email','whatsapp')),
  owner_id uuid not null references public.profiles(id),
  archived_at timestamptz,
  archived_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (phone is not null or email is not null)
);

create table public.pipelines (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (workspace_id,name)
);

create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  color text not null default '#8aa5d8' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  probability smallint not null default 0 check (probability between 0 and 100),
  position integer not null check (position >= 0),
  is_terminal boolean not null default false,
  terminal_status text check (terminal_status is null or terminal_status in ('won','lost')),
  created_at timestamptz not null default now(),
  unique (pipeline_id,position),
  check ((is_terminal and terminal_status is not null) or (not is_terminal and terminal_status is null))
);

create table public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 8 and 20),
  email text,
  business_name text,
  service_type text not null check (service_type in ('web_design','ai_agent','other')),
  budget_range text check (budget_range is null or budget_range in ('under_50','50_100','100_250','over_250')),
  brief text not null check (char_length(brief) between 10 and 2000),
  source text not null default 'website_request',
  consent boolean not null check (consent),
  consented_at timestamptz not null default now(),
  consent_version text not null default 'v1',
  status text not null default 'new' check (status in ('new','qualified','rejected','archived')),
  assigned_to uuid references public.profiles(id),
  qualified_opportunity_id uuid,
  archived_at timestamptz,
  archived_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  service_type text not null check (service_type in ('web_design','ai_agent','other')),
  stage_id uuid not null references public.pipeline_stages(id),
  owner_id uuid not null references public.profiles(id),
  contact_id uuid references public.contacts(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  source_lead_id uuid unique references public.lead_submissions(id) on delete set null,
  estimated_value bigint check (estimated_value is null or estimated_value >= 0),
  final_value bigint check (final_value is null or final_value >= 0),
  currency_code text not null default 'IRT',
  expected_close_date date,
  status text not null default 'open' check (status in ('open','won','lost')),
  lost_reason text,
  archived_at timestamptz,
  archived_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.lead_submissions add constraint lead_qualified_opportunity_fk foreign key (qualified_opportunity_id) references public.opportunities(id) on delete set null;

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  type text not null check (type in ('call','meeting','follow_up','note')),
  subject text not null check (char_length(subject) between 1 and 180),
  notes text,
  due_at timestamptz,
  status text not null default 'planned' check (status in ('planned','completed','cancelled')),
  assigned_to uuid not null references public.profiles(id),
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  completed_at timestamptz,
  archived_at timestamptz,
  archived_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (type = 'note' or due_at is not null)
);

create table public.timeline_events (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references public.profiles(id),
  actor_id uuid references public.profiles(id),
  entity_type text not null check (entity_type in ('lead','contact','company','opportunity','activity','member')),
  entity_id uuid not null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table private.submission_rate_limits (
  fingerprint_hash text primary key,
  window_started_at timestamptz not null,
  attempts integer not null default 1 check (attempts > 0),
  expires_at timestamptz not null
);

create index workspace_members_user_idx on public.workspace_members(user_id) where is_active;
create index companies_workspace_owner_idx on public.companies(workspace_id,owner_id) where archived_at is null;
create index contacts_workspace_owner_idx on public.contacts(workspace_id,owner_id) where archived_at is null;
create index contacts_phone_idx on public.contacts(workspace_id,phone) where phone is not null and archived_at is null;
create index contacts_email_idx on public.contacts(workspace_id,lower(email)) where email is not null and archived_at is null;
create index pipelines_workspace_idx on public.pipelines(workspace_id) where is_active;
create index stages_workspace_pipeline_idx on public.pipeline_stages(workspace_id,pipeline_id,position);
create index leads_workspace_assignee_idx on public.lead_submissions(workspace_id,assigned_to,status) where archived_at is null;
create index opportunities_workspace_owner_idx on public.opportunities(workspace_id,owner_id,status) where archived_at is null;
create index opportunities_stage_idx on public.opportunities(stage_id) where archived_at is null;
create index activities_workspace_assignee_due_idx on public.activities(workspace_id,assigned_to,status,due_at) where archived_at is null;
create index activities_opportunity_idx on public.activities(opportunity_id) where opportunity_id is not null;
create index activities_contact_idx on public.activities(contact_id) where contact_id is not null;
create index activities_company_idx on public.activities(company_id) where company_id is not null;
create index timeline_workspace_owner_created_idx on public.timeline_events(workspace_id,owner_id,created_at desc);
create index rate_limits_expires_idx on private.submission_rate_limits(expires_at);

create or replace function private.is_workspace_member(target_workspace uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.workspace_members wm where wm.workspace_id=target_workspace and wm.user_id=(select auth.uid()) and wm.is_active) $$;

create or replace function private.is_workspace_admin(target_workspace uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.workspace_members wm where wm.workspace_id=target_workspace and wm.user_id=(select auth.uid()) and wm.is_active and wm.role='admin') $$;

create or replace function private.can_access_owner(target_workspace uuid,target_owner uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select target_owner=(select auth.uid()) or private.is_workspace_admin(target_workspace) $$;

revoke all on function private.is_workspace_member(uuid) from public;
revoke all on function private.is_workspace_admin(uuid) from public;
revoke all on function private.can_access_owner(uuid,uuid) from public;
grant usage on schema private to authenticated;
grant execute on function private.is_workspace_member(uuid) to authenticated;
grant execute on function private.is_workspace_admin(uuid) to authenticated;
grant execute on function private.can_access_owner(uuid,uuid) to authenticated;

create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path=''
as $$ begin new.updated_at=now(); return new; end $$;
create trigger workspaces_updated before update on public.workspaces for each row execute function private.set_updated_at();
create trigger profiles_updated before update on public.profiles for each row execute function private.set_updated_at();
create trigger companies_updated before update on public.companies for each row execute function private.set_updated_at();
create trigger contacts_updated before update on public.contacts for each row execute function private.set_updated_at();
create trigger leads_updated before update on public.lead_submissions for each row execute function private.set_updated_at();
create trigger opportunities_updated before update on public.opportunities for each row execute function private.set_updated_at();
create trigger activities_updated before update on public.activities for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path=''
as $$ begin
  insert into public.profiles(id,full_name,email) values(new.id,nullif(new.raw_user_meta_data->>'full_name',''),new.email)
  on conflict(id) do update set email=excluded.email;
  return new;
end $$;
revoke all on function private.handle_new_user() from public;
create trigger auth_user_profile after insert or update of email on auth.users for each row execute function private.handle_new_user();

create or replace function private.log_opportunity_change()
returns trigger language plpgsql security definer set search_path=''
as $$ begin
  if tg_op='INSERT' then
    insert into public.timeline_events(workspace_id,owner_id,actor_id,entity_type,entity_id,event_type,metadata)
    values(new.workspace_id,new.owner_id,auth.uid(),'opportunity',new.id,'created',jsonb_build_object('stage_id',new.stage_id,'source_lead_id',new.source_lead_id));
  elsif old.stage_id is distinct from new.stage_id then
    insert into public.timeline_events(workspace_id,owner_id,actor_id,entity_type,entity_id,event_type,metadata)
    values(new.workspace_id,new.owner_id,auth.uid(),'opportunity',new.id,'stage_changed',jsonb_build_object('from',old.stage_id,'to',new.stage_id));
  elsif old.owner_id is distinct from new.owner_id then
    insert into public.timeline_events(workspace_id,owner_id,actor_id,entity_type,entity_id,event_type,metadata)
    values(new.workspace_id,new.owner_id,auth.uid(),'opportunity',new.id,'assigned',jsonb_build_object('from',old.owner_id,'to',new.owner_id));
  elsif old.archived_at is distinct from new.archived_at then
    insert into public.timeline_events(workspace_id,owner_id,actor_id,entity_type,entity_id,event_type,metadata)
    values(new.workspace_id,new.owner_id,auth.uid(),'opportunity',new.id,case when new.archived_at is null then 'restored' else 'archived' end,'{}');
  end if;
  return new;
end $$;
revoke all on function private.log_opportunity_change() from public;
create trigger opportunities_timeline after insert or update on public.opportunities for each row execute function private.log_opportunity_change();

create or replace function private.log_activity_change()
returns trigger language plpgsql security definer set search_path=''
as $$ begin
  if tg_op='INSERT' then
    insert into public.timeline_events(workspace_id,owner_id,actor_id,entity_type,entity_id,event_type)
    values(new.workspace_id,new.assigned_to,auth.uid(),'activity',new.id,'created');
  elsif old.status is distinct from new.status then
    insert into public.timeline_events(workspace_id,owner_id,actor_id,entity_type,entity_id,event_type,metadata)
    values(new.workspace_id,new.assigned_to,auth.uid(),'activity',new.id,'status_changed',jsonb_build_object('from',old.status,'to',new.status));
  end if;
  return new;
end $$;
revoke all on function private.log_activity_change() from public;
create trigger activities_timeline after insert or update on public.activities for each row execute function private.log_activity_change();

alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.workspace_members enable row level security;
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.pipelines enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.lead_submissions enable row level security;
alter table public.opportunities enable row level security;
alter table public.activities enable row level security;
alter table public.timeline_events enable row level security;
alter table private.submission_rate_limits enable row level security;

revoke all on all tables in schema public from anon,authenticated;
grant usage on schema public to authenticated;
grant select,update on public.workspaces to authenticated;
grant select,update on public.profiles to authenticated;
grant select on public.workspace_members to authenticated;
grant select,insert,update,delete on public.companies,public.contacts,public.pipelines,public.pipeline_stages,public.lead_submissions,public.opportunities,public.activities to authenticated;
grant select on public.timeline_events to authenticated;
grant usage,select on all sequences in schema public to authenticated;

create policy workspaces_select on public.workspaces for select to authenticated using (private.is_workspace_member(id));
create policy workspaces_update on public.workspaces for update to authenticated using (private.is_workspace_admin(id)) with check (private.is_workspace_admin(id));

create policy profiles_select on public.profiles for select to authenticated using (
  id=(select auth.uid()) or exists(
    select 1 from public.workspace_members mine join public.workspace_members theirs on theirs.workspace_id=mine.workspace_id
    where mine.user_id=(select auth.uid()) and mine.is_active and theirs.user_id=profiles.id and theirs.is_active
  )
);
create policy profiles_update on public.profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));

create policy members_select on public.workspace_members for select to authenticated using (private.is_workspace_member(workspace_id));

create policy companies_select on public.companies for select to authenticated using (private.can_access_owner(workspace_id,owner_id));
create policy companies_insert on public.companies for insert to authenticated with check (private.can_access_owner(workspace_id,owner_id));
create policy companies_update on public.companies for update to authenticated using (private.can_access_owner(workspace_id,owner_id)) with check (private.can_access_owner(workspace_id,owner_id));
create policy companies_delete on public.companies for delete to authenticated using (private.is_workspace_admin(workspace_id));

create policy contacts_select on public.contacts for select to authenticated using (private.can_access_owner(workspace_id,owner_id));
create policy contacts_insert on public.contacts for insert to authenticated with check (private.can_access_owner(workspace_id,owner_id));
create policy contacts_update on public.contacts for update to authenticated using (private.can_access_owner(workspace_id,owner_id)) with check (private.can_access_owner(workspace_id,owner_id));
create policy contacts_delete on public.contacts for delete to authenticated using (private.is_workspace_admin(workspace_id));

create policy pipelines_select on public.pipelines for select to authenticated using (private.is_workspace_member(workspace_id));
create policy pipelines_insert on public.pipelines for insert to authenticated with check (private.is_workspace_admin(workspace_id));
create policy pipelines_update on public.pipelines for update to authenticated using (private.is_workspace_admin(workspace_id)) with check (private.is_workspace_admin(workspace_id));
create policy pipelines_delete on public.pipelines for delete to authenticated using (private.is_workspace_admin(workspace_id));

create policy stages_select on public.pipeline_stages for select to authenticated using (private.is_workspace_member(workspace_id));
create policy stages_insert on public.pipeline_stages for insert to authenticated with check (private.is_workspace_admin(workspace_id));
create policy stages_update on public.pipeline_stages for update to authenticated using (private.is_workspace_admin(workspace_id)) with check (private.is_workspace_admin(workspace_id));
create policy stages_delete on public.pipeline_stages for delete to authenticated using (private.is_workspace_admin(workspace_id));

create policy leads_select on public.lead_submissions for select to authenticated using (private.is_workspace_admin(workspace_id) or assigned_to=(select auth.uid()));
create policy leads_update on public.lead_submissions for update to authenticated using (private.is_workspace_admin(workspace_id) or assigned_to=(select auth.uid())) with check (private.is_workspace_admin(workspace_id) or assigned_to=(select auth.uid()));
create policy leads_delete on public.lead_submissions for delete to authenticated using (private.is_workspace_admin(workspace_id));

create policy opportunities_select on public.opportunities for select to authenticated using (private.can_access_owner(workspace_id,owner_id));
create policy opportunities_insert on public.opportunities for insert to authenticated with check (private.can_access_owner(workspace_id,owner_id));
create policy opportunities_update on public.opportunities for update to authenticated using (private.can_access_owner(workspace_id,owner_id)) with check (private.can_access_owner(workspace_id,owner_id));
create policy opportunities_delete on public.opportunities for delete to authenticated using (private.is_workspace_admin(workspace_id));

create policy activities_select on public.activities for select to authenticated using (private.can_access_owner(workspace_id,assigned_to));
create policy activities_insert on public.activities for insert to authenticated with check (private.can_access_owner(workspace_id,assigned_to));
create policy activities_update on public.activities for update to authenticated using (private.can_access_owner(workspace_id,assigned_to)) with check (private.can_access_owner(workspace_id,assigned_to));
create policy activities_delete on public.activities for delete to authenticated using (private.is_workspace_admin(workspace_id));

create policy timeline_select on public.timeline_events for select to authenticated using (private.can_access_owner(workspace_id,owner_id));

create or replace function public.qualify_lead(p_lead_id uuid,p_owner_id uuid)
returns uuid language plpgsql security invoker set search_path=''
as $$
declare
  v_lead public.lead_submissions;
  v_company_id uuid;
  v_contact_id uuid;
  v_stage_id uuid;
  v_opportunity_id uuid;
begin
  select * into v_lead from public.lead_submissions where id=p_lead_id and status='new' for update;
  if not found then raise exception 'lead_not_available'; end if;
  if not private.can_access_owner(v_lead.workspace_id,p_owner_id) then raise exception 'invalid_owner'; end if;
  select ps.id into v_stage_id from public.pipeline_stages ps join public.pipelines p on p.id=ps.pipeline_id
    where ps.workspace_id=v_lead.workspace_id and p.is_active order by ps.position limit 1;
  if v_stage_id is null then raise exception 'pipeline_not_configured'; end if;
  if nullif(trim(v_lead.business_name),'') is not null then
    insert into public.companies(workspace_id,name,owner_id) values(v_lead.workspace_id,trim(v_lead.business_name),p_owner_id) returning id into v_company_id;
  end if;
  insert into public.contacts(workspace_id,company_id,full_name,phone,email,preferred_channel,owner_id)
    values(v_lead.workspace_id,v_company_id,v_lead.name,v_lead.phone,v_lead.email,'whatsapp',p_owner_id) returning id into v_contact_id;
  insert into public.opportunities(workspace_id,title,service_type,stage_id,owner_id,contact_id,company_id,source_lead_id)
    values(v_lead.workspace_id,coalesce(nullif(trim(v_lead.business_name),''),v_lead.name),v_lead.service_type,v_stage_id,p_owner_id,v_contact_id,v_company_id,v_lead.id)
    returning id into v_opportunity_id;
  update public.lead_submissions set status='qualified',assigned_to=p_owner_id,qualified_opportunity_id=v_opportunity_id where id=v_lead.id;
  return v_opportunity_id;
end $$;
revoke all on function public.qualify_lead(uuid,uuid) from public;
grant execute on function public.qualify_lead(uuid,uuid) to authenticated;

-- Create the single production workspace and default pipeline configuration only.
insert into public.workspaces(id,name,timezone,currency_code)
values('00000000-0000-0000-0000-000000000001','پیکسل','Asia/Tehran','IRT');
insert into public.pipelines(id,workspace_id,name,is_active)
values('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001','فروش خدمات پیکسل',true);
insert into public.pipeline_stages(workspace_id,pipeline_id,name,color,probability,position,is_terminal,terminal_status) values
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','سرنخ تأییدشده','#8AA5D8',10,0,false,null),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','تماس اولیه','#6F91D5',20,1,false,null),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','نیازسنجی','#527EE0',35,2,false,null),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','پیشنهاد','#2864EB',55,3,false,null),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','مذاکره','#224FB6',75,4,false,null),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','برنده','#3D8B62',100,5,true,'won'),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','از دست رفته','#A85A68',0,6,true,'lost');

create or replace function public.consume_submission_rate_limit(p_fingerprint_hash text,p_limit integer default 5,p_window interval default interval '1 hour')
returns boolean language plpgsql security definer set search_path=''
as $$
declare v_attempts integer;
begin
  delete from private.submission_rate_limits where expires_at<now();
  insert into private.submission_rate_limits(fingerprint_hash,window_started_at,attempts,expires_at)
    values(p_fingerprint_hash,now(),1,now()+p_window)
  on conflict(fingerprint_hash) do update set
    attempts=case when private.submission_rate_limits.expires_at<now() then 1 else private.submission_rate_limits.attempts+1 end,
    window_started_at=case when private.submission_rate_limits.expires_at<now() then now() else private.submission_rate_limits.window_started_at end,
    expires_at=case when private.submission_rate_limits.expires_at<now() then now()+p_window else private.submission_rate_limits.expires_at end
  returning attempts into v_attempts;
  return v_attempts<=p_limit;
end $$;
revoke all on function public.consume_submission_rate_limit(text,integer,interval) from public,anon,authenticated;
grant execute on function public.consume_submission_rate_limit(text,integer,interval) to service_role;

create or replace function public.admin_deactivate_member(p_workspace_id uuid,p_user_id uuid,p_transfer_to uuid)
returns void language plpgsql security definer set search_path=''
as $$
begin
  if p_user_id=p_transfer_to then raise exception 'transfer_target_must_differ'; end if;
  if not exists(select 1 from public.workspace_members where workspace_id=p_workspace_id and user_id=p_transfer_to and is_active) then raise exception 'invalid_transfer_target'; end if;
  update public.lead_submissions set assigned_to=p_transfer_to where workspace_id=p_workspace_id and assigned_to=p_user_id and status='new';
  update public.companies set owner_id=p_transfer_to where workspace_id=p_workspace_id and owner_id=p_user_id and archived_at is null;
  update public.contacts set owner_id=p_transfer_to where workspace_id=p_workspace_id and owner_id=p_user_id and archived_at is null;
  update public.opportunities set owner_id=p_transfer_to where workspace_id=p_workspace_id and owner_id=p_user_id and status='open' and archived_at is null;
  update public.activities set assigned_to=p_transfer_to where workspace_id=p_workspace_id and assigned_to=p_user_id and status='planned' and archived_at is null;
  update public.workspace_members set is_active=false,deactivated_at=now() where workspace_id=p_workspace_id and user_id=p_user_id;
  if not found then raise exception 'member_not_found'; end if;
end $$;
revoke all on function public.admin_deactivate_member(uuid,uuid,uuid) from public,anon,authenticated;
grant execute on function public.admin_deactivate_member(uuid,uuid,uuid) to service_role;

create or replace function public.reorder_pipeline_stage(p_stage_id uuid,p_direction integer)
returns void language plpgsql security invoker set search_path=''
as $$
declare
  v_stage public.pipeline_stages;
  v_other public.pipeline_stages;
begin
  if p_direction not in (-1,1) then raise exception 'invalid_direction'; end if;
  select * into v_stage from public.pipeline_stages where id=p_stage_id for update;
  if not found or not private.is_workspace_admin(v_stage.workspace_id) then raise exception 'forbidden'; end if;
  select * into v_other from public.pipeline_stages
    where pipeline_id=v_stage.pipeline_id and position=v_stage.position+p_direction for update;
  if not found then return; end if;
  update public.pipeline_stages set position=-1000000 where id=v_stage.id;
  update public.pipeline_stages set position=v_stage.position where id=v_other.id;
  update public.pipeline_stages set position=v_other.position where id=v_stage.id;
end $$;
revoke all on function public.reorder_pipeline_stage(uuid,integer) from public,anon;
grant execute on function public.reorder_pipeline_stage(uuid,integer) to authenticated;
