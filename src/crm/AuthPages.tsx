import { FormEvent, type ReactNode, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { markLogin } from './auth-session';
import { recoveryLinkFeedback, recoveryRequestFeedback } from './auth-recovery';
import { isSupabaseConfigured, requireSupabase, signInWithUsername } from './supabase';
import type { Membership } from './types';

const usernamePattern = /^[a-z0-9_]{3,32}$/;

function AuthCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <main className="login-page"><section className="login-card" aria-labelledby="login-title">
    <a className="crm-brand login-brand" href="https://pxlgrid.design/" aria-label="بازگشت به سایت پیکسل"><span className="crm-brand-mark"><i/><i/><i/><i/></span><span>پیکسل<small>PIXEL CRM</small></span></a>
    <span className="login-kicker">پنل داخلی تیم</span><h1 id="login-title">{title}</h1><p>{description}</p>{children}
  </section></main>;
}

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [setupOpen, setSetupOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const tokens = await signInWithUsername(username.trim().toLowerCase(), password);
      markLogin(tokens.access_token);
      const { error: sessionError } = await requireSupabase().auth.setSession(tokens);
      if (sessionError) throw sessionError;
    } catch { setError('نام کاربری یا رمز عبور درست نیست، یا حساب هنوز فعال نشده است.'); }
    finally { setBusy(false); }
  }
  async function requestSetup(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      await requireSupabase().auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: false, emailRedirectTo: `${location.origin}/auth/callback` } });
      setMessage('اگر این ایمیل عضو تیم باشد، لینک راه‌اندازی برای آن ارسال می‌شود.');
    } catch { setMessage('اگر این ایمیل عضو تیم باشد، لینک راه‌اندازی برای آن ارسال می‌شود.'); }
    finally { setBusy(false); }
  }
  return <AuthCard title="ورود به CRM پیکسل" description="با نام کاربری و رمز عبورت وارد پنل شو.">
    {!isSupabaseConfigured ? <div className="notice warning" role="status">اتصال Supabase هنوز تنظیم نشده است.</div> : <>
      <form onSubmit={login}><label>نام کاربری<input className="crm-field" value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" required dir="ltr" maxLength={32}/></label><label>رمز عبور<input className="crm-field" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required dir="ltr"/></label><button className="crm-primary" disabled={busy}>{busy ? 'در حال ورود…' : 'ورود به پنل'}</button></form>
      <div className="auth-links"><Link to="/auth/forgot-password">فراموشی رمز عبور</Link><button type="button" className="text-button" aria-expanded={setupOpen} onClick={() => setSetupOpen(open => !open)}>راه‌اندازی حساب دعوت‌شده</button></div>
      {setupOpen && <form className="setup-request" onSubmit={requestSetup}><label>ایمیل دعوت‌شده<input className="crm-field" type="email" dir="ltr" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required/></label><button className="crm-secondary" disabled={busy}>ارسال لینک راه‌اندازی</button></form>}
    </>}
    {error && <p className="field-error auth-message" role="alert">{error}</p>}{message && <p className="auth-message" role="status">{message}</p>}
    <a className="login-back" href="https://pxlgrid.design/">بازگشت به سایت پیکسل</a>
  </AuthCard>;
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(''); setError('');
    try {
      const result = await requireSupabase().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/auth/reset-password` });
      const feedback = recoveryRequestFeedback(result.error);
      if (feedback.ok) setMessage(feedback.message);
      else setError(feedback.message);
    } catch { setError(recoveryRequestFeedback({}).message); }
    finally { setBusy(false); }
  }
  return <AuthCard title="بازیابی رمز عبور" description="ایمیل ثبت‌شده برای حساب تیم پیکسل را وارد کن. لینک را در همان مرورگر و دستگاه، فقط یک‌بار باز کن.">
    <form onSubmit={submit}><label>ایمیل حساب<input className="crm-field" type="email" dir="ltr" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required/></label><button className="crm-primary" disabled={busy}>{busy ? 'در حال ارسال…' : 'ارسال لینک تغییر رمز'}</button></form>
    {message && <p className="auth-message" role="status">{message}</p>}{error && <p className="field-error auth-message" role="alert">{error}</p>}<Link className="login-back" to="/login">بازگشت به ورود</Link>
  </AuthCard>;
}

export function ResetPasswordPage({ session }: { session: Session | null }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 12 || password !== confirm) { setError('رمز باید حداقل ۱۲ نویسه باشد و تکرار آن یکسان باشد.'); return; }
    setBusy(true); setError('');
    const { error: updateError } = await requireSupabase().auth.updateUser({ password });
    if (updateError) setError('تغییر رمز انجام نشد. لینک یا رمز انتخابی را بررسی کن.');
    else { await requireSupabase().auth.signOut({ scope: 'local' }); setDone(true); }
    setBusy(false);
  }
  return <AuthCard title="تنظیم رمز تازه" description="بعد از تغییر رمز، با نام کاربری وارد شو.">
    {done ? <p role="status">رمز تغییر کرد. <Link to="/login">ورود به پنل</Link></p> : !session ? <p role="alert">{recoveryLinkFeedback(location.search, location.hash)} <Link to="/auth/forgot-password">درخواست لینک تازه</Link></p> : <form onSubmit={submit}><label>رمز تازه<input className="crm-field" type="password" autoComplete="new-password" dir="ltr" minLength={12} value={password} onChange={event => setPassword(event.target.value)} required/></label><label>تکرار رمز تازه<input className="crm-field" type="password" autoComplete="new-password" dir="ltr" minLength={12} value={confirm} onChange={event => setConfirm(event.target.value)} required/></label><button className="crm-primary" disabled={busy}>{busy ? 'در حال ثبت…' : 'ثبت رمز تازه'}</button></form>}
    {error && <p className="field-error auth-message" role="alert">{error}</p>}
  </AuthCard>;
}

export function AccountSetupPage({ session, membership }: { session: Session; membership: Membership }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    const normalized = username.trim().toLowerCase();
    if (!usernamePattern.test(normalized)) { setError('نام کاربری باید ۳ تا ۳۲ نویسهٔ لاتین، عدد یا زیرخط باشد.'); return; }
    if (password.length < 12 || password !== confirm) { setError('رمز باید حداقل ۱۲ نویسه باشد و تکرار آن یکسان باشد.'); return; }
    setBusy(true);
    const client = requireSupabase();
    const { error: passwordError } = await client.auth.updateUser({ password });
    if (passwordError) { setError('ثبت رمز انجام نشد. رمز دیگری انتخاب کن یا لینک راه‌اندازی تازه بگیر.'); setBusy(false); return; }
    const { error: usernameError } = await client.rpc('claim_username', { p_username: normalized });
    if (usernameError) { setError('این نام کاربری در دسترس نیست. نام دیگری انتخاب کن.'); setBusy(false); return; }
    markLogin(session.access_token);
    location.replace('/');
  }
  return <AuthCard title="راه‌اندازی حساب" description={`برای حساب ${session.user.email || ''} نام کاربری و رمز انتخاب کن.`}>
    <form onSubmit={submit}><label>نام کاربری<input className="crm-field" dir="ltr" autoComplete="username" pattern="[a-zA-Z0-9_]{3,32}" maxLength={32} value={username} onChange={event => setUsername(event.target.value)} required/></label><label>رمز عبور<input className="crm-field" type="password" dir="ltr" autoComplete="new-password" minLength={12} value={password} onChange={event => setPassword(event.target.value)} required/></label><label>تکرار رمز<input className="crm-field" type="password" dir="ltr" autoComplete="new-password" minLength={12} value={confirm} onChange={event => setConfirm(event.target.value)} required/></label><button className="crm-primary" disabled={busy}>{busy ? 'در حال ثبت…' : 'ساخت حساب ورود'}</button></form>
    {error && <p className="field-error auth-message" role="alert">{error}</p>}
  </AuthCard>;
}

export function AccountSecurityPage({ session, membership }: { session: Session; membership: Membership }) {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function changePassword(event: FormEvent) {
    event.preventDefault(); setError(''); setMessage('');
    if (password.length < 12 || password !== confirm) { setError('رمز تازه باید حداقل ۱۲ نویسه باشد و تکرار آن یکسان باشد.'); return; }
    setBusy(true);
    const { error: updateError } = await requireSupabase().auth.updateUser({ password, current_password: current });
    if (updateError) setError('تغییر رمز انجام نشد. رمز فعلی یا رمز تازه را بررسی کن.');
    else { setCurrent(''); setPassword(''); setConfirm(''); setMessage('رمز حساب تغییر کرد.'); }
    setBusy(false);
  }
  async function sendReset() {
    if (!session.user.email) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await requireSupabase().auth.resetPasswordForEmail(session.user.email, { redirectTo: `${location.origin}/auth/reset-password` });
      const feedback = recoveryRequestFeedback(result.error);
      if (feedback.ok) setMessage('درخواست لینک تغییر رمز پذیرفته شد. ایمیل حساب را بررسی کن.');
      else setError(feedback.message);
    } catch { setError(recoveryRequestFeedback({}).message); }
    finally { setBusy(false); }
  }
  return <><div className="page-header"><div><span>حساب کاربری</span><h1>امنیت حساب</h1><p>نام کاربری ورود: <bdi>{membership.profile?.username}</bdi> · ایمیل بازیابی: <bdi>{session.user.email}</bdi></p></div></div>
    <section className="account-security"><h2>تغییر رمز عبور</h2><form onSubmit={changePassword}><label>رمز فعلی<input className="crm-field" type="password" autoComplete="current-password" value={current} onChange={event => setCurrent(event.target.value)} required/></label><label>رمز تازه<input className="crm-field" type="password" autoComplete="new-password" minLength={12} value={password} onChange={event => setPassword(event.target.value)} required/></label><label>تکرار رمز تازه<input className="crm-field" type="password" autoComplete="new-password" minLength={12} value={confirm} onChange={event => setConfirm(event.target.value)} required/></label><button className="crm-primary" disabled={busy}>{busy ? 'در حال ثبت…' : 'تغییر رمز'}</button></form><div className="account-reset"><p>به رمز فعلی دسترسی نداری؟ لینک تغییر رمز را به ایمیل حساب بفرست.</p><button type="button" className="crm-secondary" disabled={busy} onClick={() => void sendReset()}>ارسال لینک به ایمیل</button></div>{error && <p className="field-error" role="alert">{error}</p>}{message && <p className="notice success" role="status">{message}</p>}</section>
  </>;
}
