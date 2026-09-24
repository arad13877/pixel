type RecoveryError = { status?: number; code?: string } | null;

export function recoveryRequestFeedback(error: RecoveryError) {
  if (!error) return { ok: true, message: 'اگر حسابی با این ایمیل وجود داشته باشد، لینک تغییر رمز ارسال می‌شود.' };
  if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
    return { ok: false, message: 'ارسال ایمیل فعلاً به‌دلیل درخواست‌های زیاد محدود شده است. کمی بعد دوباره تلاش کن؛ درخواست‌های پیاپی محدودیت را طولانی‌تر می‌کنند.' };
  }
  return { ok: false, message: 'درخواست بازیابی ثبت نشد. اتصال یا تنظیمات ایمیل را بررسی کن و کمی بعد دوباره تلاش کن.' };
}

export function recoveryLinkFeedback(search: string, hash: string) {
  const params = new URLSearchParams(search);
  const fragment = new URLSearchParams(hash.replace(/^#/, ''));
  const code = params.get('error_code') || fragment.get('error_code');
  if (code === 'otp_expired' || code === 'otp_disabled' || code === 'flow_state_not_found') {
    return 'این لینک یک‌بارمصرف قبلاً استفاده شده یا اعتبارش تمام شده است. یک لینک تازه درخواست کن و فقط یک‌بار بازش کن.';
  }
  return 'تأیید لینک کامل نشد. لینک را در همان مرورگر و دستگاهی باز کن که درخواست بازیابی را از آن فرستادی؛ در غیر این صورت لینک تازه بگیر.';
}
