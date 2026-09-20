begin;
select plan(13);

select has_table('public','contacts','contacts table exists');
select has_table('public','opportunities','opportunities table exists');
select has_table('public','lead_submissions','lead submissions table exists');
select ok((select relrowsecurity from pg_class where oid='public.contacts'::regclass),'contacts RLS enabled');
select ok((select relrowsecurity from pg_class where oid='public.opportunities'::regclass),'opportunities RLS enabled');
select ok(not has_table_privilege('anon','public.lead_submissions','SELECT'),'anonymous role has no lead access');

insert into auth.users(id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at) values
('10000000-0000-0000-0000-000000000001','authenticated','authenticated','admin@test.local','',now(),now(),now()),
('10000000-0000-0000-0000-000000000002','authenticated','authenticated','member@test.local','',now(),now(),now()),
('10000000-0000-0000-0000-000000000003','authenticated','authenticated','other@test.local','',now(),now(),now()),
('10000000-0000-0000-0000-000000000004','authenticated','authenticated','inactive@test.local','',now(),now(),now());

insert into public.workspace_members(workspace_id,user_id,role,is_active) values
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','admin',true),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','member',true),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','member',true),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000004','member',false);

insert into public.contacts(id,workspace_id,full_name,phone,owner_id) values
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','مخاطب تست یک','09120000001','10000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','مخاطب تست دو','09120000002','10000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','مخاطب تست غیرفعال','09120000003','10000000-0000-0000-0000-000000000004');

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select is((select count(*) from public.contacts),3::bigint,'admin sees all workspace contacts');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
select is((select count(*) from public.contacts),1::bigint,'member sees assigned contact');
update public.contacts set full_name='ویرایش مجاز' where id='20000000-0000-0000-0000-000000000001';
select is((select full_name from public.contacts where id='20000000-0000-0000-0000-000000000001'),'ویرایش مجاز','member updates assigned contact');
update public.contacts set full_name='ویرایش غیرمجاز' where id='20000000-0000-0000-0000-000000000002';
select is((select count(*) from public.contacts where full_name='ویرایش غیرمجاز'),0::bigint,'member cannot update another owner contact');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000004',true);
select is((select count(*) from public.contacts),0::bigint,'inactive member sees no contacts');
update public.contacts set full_name='ویرایش غیرفعال' where id='20000000-0000-0000-0000-000000000003';
select is((select count(*) from public.contacts where full_name='ویرایش غیرفعال'),0::bigint,'inactive member cannot update an owned contact');

reset role;
select lives_ok($$select public.consume_submission_rate_limit('test-fingerprint',5,interval '1 hour')$$,'service helper executes as owner');

select * from finish();
rollback;
