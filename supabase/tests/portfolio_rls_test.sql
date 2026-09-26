begin;
select plan(12);

select has_table('public', 'portfolio_items', 'portfolio table exists');
select ok((select relrowsecurity from pg_class where oid = 'public.portfolio_items'::regclass), 'portfolio RLS is enabled');
select ok((select count(*) from public.portfolio_items where kind = 'concept') >= 2, 'fictional concepts are seeded');
select ok(not has_table_privilege('authenticated', 'public.portfolio_items', 'INSERT'), 'members cannot insert directly');
select ok(not has_table_privilege('authenticated', 'public.portfolio_items', 'UPDATE'), 'members cannot update directly');
select ok(not has_table_privilege('authenticated', 'public.portfolio_items', 'DELETE'), 'members cannot delete directly');
select ok(not has_function_privilege('authenticated', 'public.reorder_portfolio_items(uuid,uuid[])', 'EXECUTE'), 'members cannot call privileged reordering');

insert into public.workspaces(id, name) values ('00000000-0000-0000-0000-000000000099', 'فضای آزمایشی');
insert into public.portfolio_items(id, workspace_id, kind, status, draft_payload)
values
  ('20000000-0000-0000-0000-000000000091', '00000000-0000-0000-0000-000000000001', 'client', 'draft', '{"title":"پیش‌نویس تست"}'::jsonb),
  ('20000000-0000-0000-0000-000000000092', '00000000-0000-0000-0000-000000000099', 'client', 'draft', '{"title":"فضای دیگر"}'::jsonb);

insert into auth.users(id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at) values
  ('30000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'portfolio-admin@test.local', '', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'portfolio-inactive@test.local', '', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000013', 'authenticated', 'authenticated', 'portfolio-other@test.local', '', now(), now(), now());
insert into public.workspace_members(workspace_id, user_id, role, is_active) values
  ('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000011', 'admin', true),
  ('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000012', 'member', false),
  ('00000000-0000-0000-0000-000000000099', '30000000-0000-0000-0000-000000000013', 'member', true);

select set_config('test.portfolio_concept_count', (select count(*) from public.portfolio_items where kind = 'concept')::text, true);

set local role anon;
select is((select count(*) from public.portfolio_items), current_setting('test.portfolio_concept_count')::bigint, 'anonymous sees only published concepts');
select throws_ok($$select draft_payload from public.portfolio_items limit 1$$, '42501', null, 'anonymous cannot read drafts');

set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-0000-0000-000000000011', true);
select is((select count(*) from public.portfolio_items), current_setting('test.portfolio_concept_count')::bigint + 1, 'active workspace admin sees its draft and published items');
select set_config('request.jwt.claim.sub', '30000000-0000-0000-0000-000000000012', true);
select is((select count(*) from public.portfolio_items), 0::bigint, 'inactive member sees nothing');
select set_config('request.jwt.claim.sub', '30000000-0000-0000-0000-000000000013', true);
select is((select count(*) from public.portfolio_items), 1::bigint, 'other workspace member sees only own item');

select * from finish();
rollback;
