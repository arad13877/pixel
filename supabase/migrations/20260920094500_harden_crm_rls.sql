-- Tighten ownership and relationship checks without exposing additional data.
create or replace function private.can_access_owner(target_workspace uuid,target_owner uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select private.is_workspace_member(target_workspace)
    and (target_owner=(select auth.uid()) or private.is_workspace_admin(target_workspace))
$$;

create or replace function private.valid_owned_record(target_workspace uuid,target_owner uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select private.can_access_owner(target_workspace,target_owner)
    and exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id=target_workspace and wm.user_id=target_owner and wm.is_active
    )
$$;

create or replace function private.valid_opportunity_links(target_workspace uuid,target_stage uuid,target_contact uuid,target_company uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
      select 1 from public.pipeline_stages ps
      where ps.id=target_stage and ps.workspace_id=target_workspace
    )
    and (target_contact is null or exists (
      select 1 from public.contacts c
      where c.id=target_contact and c.workspace_id=target_workspace
        and private.can_access_owner(c.workspace_id,c.owner_id)
    ))
    and (target_company is null or exists (
      select 1 from public.companies c
      where c.id=target_company and c.workspace_id=target_workspace
        and private.can_access_owner(c.workspace_id,c.owner_id)
    ))
$$;

create or replace function private.valid_activity_links(target_workspace uuid,target_opportunity uuid,target_contact uuid,target_company uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select (target_opportunity is null or exists (
      select 1 from public.opportunities o
      where o.id=target_opportunity and o.workspace_id=target_workspace
        and private.can_access_owner(o.workspace_id,o.owner_id)
    ))
    and (target_contact is null or exists (
      select 1 from public.contacts c
      where c.id=target_contact and c.workspace_id=target_workspace
        and private.can_access_owner(c.workspace_id,c.owner_id)
    ))
    and (target_company is null or exists (
      select 1 from public.companies c
      where c.id=target_company and c.workspace_id=target_workspace
        and private.can_access_owner(c.workspace_id,c.owner_id)
    ))
$$;

create or replace function private.valid_lead_assignee(target_workspace uuid,target_assignee uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select private.is_workspace_member(target_workspace)
    and (
      (target_assignee is null and private.is_workspace_admin(target_workspace))
      or (target_assignee is not null and private.valid_owned_record(target_workspace,target_assignee))
    )
$$;

revoke all on function private.valid_owned_record(uuid,uuid) from public;
revoke all on function private.valid_opportunity_links(uuid,uuid,uuid,uuid) from public;
revoke all on function private.valid_activity_links(uuid,uuid,uuid,uuid) from public;
revoke all on function private.valid_lead_assignee(uuid,uuid) from public;
grant execute on function private.valid_owned_record(uuid,uuid) to authenticated;
grant execute on function private.valid_opportunity_links(uuid,uuid,uuid,uuid) to authenticated;
grant execute on function private.valid_activity_links(uuid,uuid,uuid,uuid) to authenticated;
grant execute on function private.valid_lead_assignee(uuid,uuid) to authenticated;

alter policy companies_insert on public.companies with check (private.valid_owned_record(workspace_id,owner_id));
alter policy companies_update on public.companies with check (private.valid_owned_record(workspace_id,owner_id));
alter policy contacts_insert on public.contacts with check (private.valid_owned_record(workspace_id,owner_id));
alter policy contacts_update on public.contacts with check (private.valid_owned_record(workspace_id,owner_id));
alter policy opportunities_insert on public.opportunities with check (
  private.valid_owned_record(workspace_id,owner_id)
  and private.valid_opportunity_links(workspace_id,stage_id,contact_id,company_id)
);
alter policy opportunities_update on public.opportunities with check (
  private.valid_owned_record(workspace_id,owner_id)
  and private.valid_opportunity_links(workspace_id,stage_id,contact_id,company_id)
);
alter policy activities_insert on public.activities with check (
  private.valid_owned_record(workspace_id,assigned_to)
  and private.valid_activity_links(workspace_id,opportunity_id,contact_id,company_id)
);
alter policy activities_update on public.activities with check (
  private.valid_owned_record(workspace_id,assigned_to)
  and private.valid_activity_links(workspace_id,opportunity_id,contact_id,company_id)
);
alter policy leads_select on public.lead_submissions using (
  private.is_workspace_member(workspace_id)
  and (private.is_workspace_admin(workspace_id) or assigned_to=(select auth.uid()))
);
alter policy leads_update on public.lead_submissions using (
  private.is_workspace_member(workspace_id)
  and (private.is_workspace_admin(workspace_id) or assigned_to=(select auth.uid()))
) with check (private.valid_lead_assignee(workspace_id,assigned_to));

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
  if not private.valid_owned_record(v_lead.workspace_id,p_owner_id) then raise exception 'invalid_owner'; end if;
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
