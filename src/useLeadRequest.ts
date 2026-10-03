import { type FormEvent, useEffect, useId, useState } from 'react';
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

function getEnv(name: string) {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return env?.[name]?.trim() || '';
}

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const endpoint = supabaseUrl ? `${supabaseUrl}/functions/v1/submit-lead` : '';
const turnstileKey = getEnv('VITE_TURNSTILE_SITE_KEY');

export function useLeadRequest(prepare?: (data: FormData) => Record<string, FormDataEntryValue>) {
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
    event.preventDefault();
    if (!endpoint || !turnstileKey || state === 'submitting') return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setState('submitting');
    setMessage('');
    let sent = false;
    try {
      const data = new FormData(form);
      const payload = prepare ? prepare(data) : Object.fromEntries(data.entries());
      if (!String(payload['cf-turnstile-response'] || '').trim()) {
        throw new Error('لطفاً اعتبارسنجی امنیتی فرم را کامل کن؛ اگر نمایش داده نمی‌شود، صفحه را تازه کن.');
      }
      sent = true;
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
      setMessage(error instanceof Error && !(error instanceof TypeError) ? error.message : 'ارتباط برقرار نشد. لطفاً دوباره تلاش کن.');
    } finally {
      if (sent) {
        const captcha = (window as Window & { turnstile?: { reset: () => void } }).turnstile;
        captcha?.reset();
      }
    }
  }

  return { state, message, statusId, submit, endpoint, turnstileKey };
}
