begin;
select plan(10);

select has_table('public','articles','articles table exists');
select ok((select relrowsecurity from pg_class where oid='public.articles'::regclass),'articles RLS enabled');
select is((select count(*) from public.articles where status='published'),3::bigint,'three editorial articles are seeded');
select ok(not has_table_privilege('authenticated','public.articles','INSERT'),'authenticated cannot insert articles directly');
select ok(not has_table_privilege('authenticated','public.articles','UPDATE'),'authenticated cannot update articles directly');
select ok(not has_table_privilege('authenticated','public.articles','DELETE'),'authenticated cannot delete articles directly');

insert into auth.users(id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at) values
('30000000-0000-0000-0000-000000000001','authenticated','authenticated','article-admin@test.local','',now(),now(),now()),
('30000000-0000-0000-0000-000000000002','authenticated','authenticated','article-inactive@test.local','',now(),now(),now());
insert into public.workspace_members(workspace_id,user_id,role,is_active) values
('00000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','admin',true),
('00000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','member',false);

set local role anon;
select is((select count(*) from public.articles),3::bigint,'anonymous sees only published articles');
select throws_ok($$select draft_payload from public.articles limit 1$$,'42501',null,'anonymous cannot read draft payload');

set local role authenticated;
select set_config('request.jwt.claim.sub','30000000-0000-0000-0000-000000000001',true);
select is((select count(*) from public.articles),3::bigint,'active member sees workspace articles');
select set_config('request.jwt.claim.sub','30000000-0000-0000-0000-000000000002',true);
select is((select count(*) from public.articles),0::bigint,'inactive member sees no articles');

select * from finish();
rollback;
