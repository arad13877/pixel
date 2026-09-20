import { FormEvent, useEffect, useId, useState } from 'react';
import { Contact } from './Contact';
import { Icon } from './Icons';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

function getEnv(name: string) {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return env?.[name]?.trim() || '';
}

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const endpoint = supabaseUrl ? `${supabaseUrl}/functions/v1/submit-lead` : '';
const turnstileKey = getEnv('VITE_TURNSTILE_SITE_KEY');

export default function RequestPage() {
  const [state, setState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const statusId = useId();

  useEffect(() => {
    if (!turnstileKey || document.querySelector('script[data-pixel-turnstile]')) return;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.dataset.pixelTurnstile = 'true';
    document.head.append(script);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    if (!endpoint) return;
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setState('submitting');
    setMessage('');
    try {
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(result.message || 'ثبت درخواست انجام نشد.');
      form.reset();
      setState('success');
      setMessage('درخواستت ثبت شد. تیم پیکسل برای ادامه گفتگو با تو تماس می‌گیرد.');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'ارتباط برقرار نشد. لطفاً دوباره تلاش کن.');
    }
  }

  return <div className="request-page">
    <section className="request-hero container" aria-labelledby="request-title">
      <div className="request-copy">
        <span className="eyebrow"><span className="blue-dot"/> شروع یک همکاری دقیق</span>
        <h1 id="request-title">درباره پروژه‌ات<br/><span>برایمان بگو.</span></h1>
        <p>چند خط درباره کسب‌وکار و چیزی که می‌خواهی بسازی کافی است. درخواست را بررسی می‌کنیم و برای قدم بعدی با تو تماس می‌گیریم.</p>
        <ul className="request-promises">
          <li><Icon name="check" size={17}/> اطلاعات فقط برای بررسی درخواست استفاده می‌شود.</li>
          <li><Icon name="check" size={17}/> ثبت فرم به معنی قرارداد یا تعهد مالی نیست.</li>
          <li><Icon name="check" size={17}/> اگر راحت‌تری، گفتگو را در واتساپ شروع کن.</li>
        </ul>
        <Contact glass className="request-whatsapp" location="request-page" service="ثبت درخواست پروژه">گفتگو در واتساپ</Contact>
      </div>

      <form className="request-form" method="post" action={endpoint || undefined} onSubmit={submit} aria-describedby={statusId}>
        <div className="request-form-head"><span>فرم درخواست</span><small>زمان تکمیل حدود ۲ دقیقه</small></div>
        <div className="form-grid">
          <label><span>نام و نام خانوادگی <b aria-hidden="true">*</b></span><input name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="نام شما" /></label>
          <label><span>شماره موبایل <b aria-hidden="true">*</b></span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" minLength={8} maxLength={20} required placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr" /></label>
          <label><span>نام کسب‌وکار</span><input name="business_name" autoComplete="organization" maxLength={120} placeholder="اختیاری" /></label>
          <label><span>ایمیل</span><input name="email" type="email" autoComplete="email" maxLength={180} placeholder="اختیاری" dir="ltr" /></label>
          <label><span>نوع خدمت <b aria-hidden="true">*</b></span><select name="service_type" required defaultValue=""><option value="" disabled>انتخاب کن</option><option value="web_design">طراحی سایت</option><option value="ai_agent">AI Agent اختصاصی</option><option value="other">سایر</option></select></label>
          <label><span>بازه بودجه</span><select name="budget_range" defaultValue=""><option value="">هنوز مشخص نیست</option><option value="under_50">کمتر از ۵۰ میلیون تومان</option><option value="50_100">۵۰ تا ۱۰۰ میلیون تومان</option><option value="100_250">۱۰۰ تا ۲۵۰ میلیون تومان</option><option value="over_250">بیشتر از ۲۵۰ میلیون تومان</option></select></label>
          <label className="form-wide"><span>کمی درباره پروژه بگو <b aria-hidden="true">*</b></span><textarea name="brief" required minLength={10} maxLength={2000} rows={5} placeholder="الان چه مسئله‌ای داری و دوست داری به چه نتیجه‌ای برسی؟" /></label>
        </div>
        <label className="honeypot" aria-hidden="true">وب‌سایت<input name="website" tabIndex={-1} autoComplete="off" /></label>
        {turnstileKey ? <div className="cf-turnstile" data-sitekey={turnstileKey} data-language="fa" data-theme="light"/> : <p className="form-config-note">فرم آنلاین هنوز به سرویس ثبت درخواست متصل نشده است؛ فعلاً از واتساپ استفاده کن.</p>}
        <label className="consent"><input name="consent" type="checkbox" value="true" required/><span>موافقم پیکسل برای بررسی همین درخواست با من تماس بگیرد.</span></label>
        <button className="button primary request-submit" disabled={state === 'submitting' || !endpoint || !turnstileKey} type="submit">{state === 'submitting' ? 'در حال ثبت…' : 'ثبت درخواست'}<Icon name="arrow" size={18}/></button>
        <p id={statusId} className={`form-status ${state}`} role="status" aria-live="polite">{message}</p>
        <noscript><p className="form-config-note">برای ارسال امن این فرم JavaScript لازم است. می‌توانی درخواستت را مستقیم در واتساپ بفرستی.</p></noscript>
      </form>
    </section>
  </div>;
}
