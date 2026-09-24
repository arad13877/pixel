begin;
select plan(8);

select has_column('public', 'profiles', 'username', 'profiles has username');
select has_function('public', 'claim_username', array['text'], 'username claim RPC exists');
select ok(not has_table_privilege('anon', 'public.profiles', 'SELECT'), 'anonymous user cannot read profiles');
select ok(not has_table_privilege('authenticated', 'public.profiles', 'UPDATE'), 'members cannot update username directly');
select ok(has_function_privilege('authenticated', 'public.claim_username(text)', 'EXECUTE'), 'members may claim username via RPC');
select ok(not has_function_privilege('anon', 'public.claim_username(text)', 'EXECUTE'), 'anonymous user may not claim username');

insert into auth.users(id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at) values
('10000000-0000-0000-0000-000000000091','authenticated','authenticated','username-test@test.local','hashed-password',now(),now(),now());
insert into public.workspace_members(workspace_id,user_id,role,is_active)
values ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000091','member',true);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000091',true);
select lives_ok($$select public.claim_username('pixel_test')$$, 'member claims first username');
select throws_ok($$select public.claim_username('another_name')$$, '23505', 'username_already_set', 'username cannot be replaced');

select * from finish();
rollback;
