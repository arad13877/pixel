import { Contact } from './Contact';
import { Icon, type IconName } from './Icons';
import { useLeadRequest } from './useLeadRequest';

export function normalizeAuditPhone(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.includes(digit) ? '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit) : '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace(/[\s()-]/g, '').replace(/^(?:\+98|0098|98)(?=9)/, '0');
}
export function normalizeAuditUrl(value: string) {
  const text = value.trim();
  let url: URL;
  try { url = new URL(/^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`); }
  catch { throw new Error('آدرس سایت را به‌صورت معتبر وارد کنید؛ مانند example.com.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || !url.hostname.includes('.') || url.hostname.endsWith('.')) throw new Error('آدرس سایت را به‌صورت معتبر وارد کنید؛ مانند example.com.');
  return url.href;
}
const checks: { title: string; description: string; icon: IconName }[] = [
  { title: 'طراحی و ظاهر سایت', description: 'خوانایی، نظم بصری و هماهنگی با هویت کسب‌وکار.', icon: 'layers' },
  { title: 'تجربه کاربری و مسیر تبدیل', description: 'راهی که بازدیدکننده برای شناخت خدمات و تماس طی می‌کند.', icon: 'sales' },
  { title: 'سرعت و عملکرد', description: 'موانع بارگذاری و استفاده روان از صفحات.', icon: 'code' },
  { title: 'سئوی اولیه و ساختار صفحات', description: 'ساختار محتوا و پایه‌های فنی دیده‌شدن در جستجو.', icon: 'search' },
  { title: 'نمایش صحیح در موبایل', description: 'خوانایی متن، دسترسی به دکمه‌ها و چیدمان روی موبایل.', icon: 'globe' },
  { title: 'نقاط ضعف و فرصت‌های بهبود', description: 'بخش‌هایی که می‌توانند بهتر به نیاز مشتری پاسخ دهند.', icon: 'custom' },
  { title: 'پیشنهادهای عملی', description: 'قدم‌های مشخص برای بهتر شدن سایت، متناسب با نیاز شما.', icon: 'check' },
];
const faqs = [
  ['بررسی سایت واقعاً رایگان است؟', 'بله. این بررسی اولیه رایگان است و هیچ تعهد مالی برای شما ایجاد نمی‌کند.'],
  ['نتیجه بررسی چگونه به من اعلام می‌شود؟', 'از طریق شماره‌ای که در فرم ثبت می‌کنید، برای ارائه نتیجه و پیشنهادهای بهبود با شما ارتباط می‌گیریم.'],
  ['آیا فقط سایت‌های قدیمی را بررسی می‌کنید؟', 'خیر. سایت‌های تازه‌راه‌اندازی‌شده هم ممکن است فرصت‌هایی برای بهبود طراحی، تجربه کاربری یا ساختار فنی داشته باشند.'],
  ['اگر سایت نداشته باشم می‌توانم درخواست بررسی بدهم؟', 'این فرم برای بررسی سایت موجود است. اگر هنوز سایت ندارید، از صفحه طراحی سایت برای مشاوره شروع پروژه اقدام کنید.'],
  ['آیا بعد از بررسی مجبور به خرید خدمات هستم؟', 'خیر. تصمیم برای اجرای پیشنهادها یا همکاری با پیکسل کاملاً با شماست.'],
];

function AuditForm() {
  const { state, message, statusId, submit, endpoint, turnstileKey } = useLeadRequest(data => {
    const phone = normalizeAuditPhone(String(data.get('phone') || ''));
    if (!/^09\d{9}$/.test(phone)) throw new Error('شماره موبایل معتبر وارد کنید؛ مانند ۰۹۱۲۱۲۳۴۵۶۷.');
    const site = normalizeAuditUrl(String(data.get('site_url') || ''));
    return { ...Object.fromEntries(data.entries()), phone, service_type: 'other', brief: `درخواست بررسی رایگان سایت\nآدرس سایت: ${site}\nزمینه فعالیت: ${data.get('activity')}\nمسئله اصلی: ${data.get('problem') || 'ذکر نشده'}` };
  });
  return <form id="audit-form" className="request-form" method="post" action={endpoint || undefined} onSubmit={submit} aria-labelledby="audit-form-title" aria-describedby={`audit-assurance ${statusId}`} aria-busy={state === 'submitting'}>
    <div className="request-form-head"><span id="audit-form-title">درخواست بررسی رایگان</span><small>اطلاعات کسب‌وکار شما</small></div>
    <div className="form-grid">
      <label><span>نام و نام خانوادگی</span><input name="name" autoComplete="name" minLength={2} maxLength={100} required/></label>
      <label><span>شماره موبایل</span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} required placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr"/></label>
      <label><span>نام کسب‌وکار</span><input name="business_name" autoComplete="organization" maxLength={120} required/></label>
      <label><span>آدرس سایت</span><input name="site_url" type="text" inputMode="url" autoComplete="url" maxLength={500} required placeholder="example.com" dir="ltr"/></label>
      <label className="form-wide"><span>زمینه فعالیت</span><input name="activity" maxLength={160} required placeholder="مثلاً خدمات معماری"/></label>
      <label className="form-wide"><span>مهم‌ترین مشکلی که با سایت دارید؟ <small>(اختیاری)</small></span><textarea name="problem" rows={3} maxLength={900}/></label>
    </div>
    <label className="honeypot" aria-hidden="true">وب‌سایت<input name="website" tabIndex={-1} autoComplete="off"/></label>
    {turnstileKey ? <div className="cf-turnstile" data-sitekey={turnstileKey} data-language="fa" data-theme="light" data-size="flexible"/> : <p className="form-config-note">ثبت آنلاین فعلاً در دسترس نیست. می‌توانید درخواست بررسی را در واتساپ ارسال کنید.</p>}
    <label className="consent"><input name="consent" type="checkbox" value="true" required/><span>موافقم پیکسل برای بررسی همین درخواست با من تماس بگیرد.</span></label>
    <button className="button primary request-submit" type="submit" disabled={state === 'submitting' || !endpoint || !turnstileKey}>{state === 'submitting' ? 'در حال ثبت درخواست…' : 'درخواست بررسی رایگان سایت'}<Icon name="arrow" size={18}/></button>
    <p id="audit-assurance" className="audit-assurance">این بررسی رایگان است و هیچ تعهدی برای شما ایجاد نمی‌کند.</p>
    <p id={statusId} className={`form-status ${state}`} role="status" aria-live="polite">{message}</p>
    <Contact glass location="free-audit-form" service="بررسی رایگان سایت کسب‌وکار">ارسال درخواست در واتساپ</Contact>
    <noscript><p className="form-config-note">برای ارسال امن فرم JavaScript لازم است؛ درخواست را در واتساپ ارسال کنید.</p></noscript>
  </form>;
}

export default function FreeWebsiteAuditPage() {
  return <div className="audit-page web-design-page">
    <section className="request-page"><div className="request-hero container">
      <div className="request-copy"><span className="eyebrow"><span className="blue-dot"/> یک نگاه دقیق، پیش از قدم بعدی</span><h1>بررسی رایگان سایت کسب‌وکار شما</h1><p className="audit-hero-question">رایگان بررسی کنیم سایت کسب‌وکار شما چه چیزی کم دارد؟</p><p>آدرس سایتتان را برای ما ارسال کنید تا وضعیت طراحی، تجربه کاربری، سرعت و سئوی آن را بررسی کنیم و مهم‌ترین فرصت‌های بهبود را به شما بگوییم.</p><a className="button primary" href="#audit-form">درخواست بررسی رایگان <Icon name="arrow" size={18}/></a><ul className="request-promises"><li><Icon name="check" size={17}/> بررسی اولیه، بدون تعهد خرید</li><li><Icon name="check" size={17}/> پیشنهادهای روشن برای قدم بعدی</li></ul></div>
      <AuditForm/>
    </div></section>
    <section className="container wd-section" aria-labelledby="audit-checks"><div className="wd-section-heading"><div><span className="wd-section-index">۰۱ / نگاه همه‌جانبه</span><h2 id="audit-checks">در این بررسی چه چیزهایی<br/><span>را بررسی می‌کنیم؟</span></h2></div></div><div className="wd-type-grid">{checks.map(({title,description,icon},index)=><article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name={icon}/></span><span className="wd-index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="wd-deliverables" aria-labelledby="audit-results"><div className="container wd-deliverables-layout"><div className="wd-deliverables-copy"><span className="wd-section-index">۰۲ / نتیجه قابل استفاده</span><h2 id="audit-results">بعد از بررسی چه چیزی<br/><span>دریافت می‌کنید؟</span></h2><p>یک تصویر روشن از وضعیت سایت و کارهایی که می‌توانید برای بهبود آن انجام دهید.</p><a className="button primary" href="#audit-form">درخواست بررسی رایگان <Icon name="arrow" size={18}/></a></div><div className="wd-deliverables-list">{[['شناسایی مهم‌ترین ایرادات','مسائلی که استفاده از سایت و ارتباط با کسب‌وکارتان را دشوار می‌کنند.'],['فرصت‌های بهبود','بخش‌هایی که با اصلاح آن‌ها تجربه بهتری برای کاربر می‌سازید.'],['اولویت‌بندی مشکلات','تشخیص اینکه بهتر است از کدام مسئله شروع کنید.'],['پیشنهاد اقدامات بعدی','پیشنهادهایی برای طراحی، سئو یا بهبود فنی، متناسب با وضعیت سایت.']].map(([title,description],index)=><article className="wd-deliverable" key={title}><span className="wd-deliverable-icon"><Icon name="check"/></span><span className="wd-deliverable-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></div></section>
    <section className="wd-trust"><div className="container wd-trust-inner"><h2>قرار نیست فقط بگوییم<br/><span>سایتتان خوب است یا بد.</span></h2><p>هدف این بررسی این است که مشخص شود سایت شما در کدام بخش‌ها می‌تواند بهتر عمل کند و چه تغییراتی بیشترین ارزش را برای کسب‌وکار شما ایجاد می‌کنند.</p></div></section>
    <section className="container wd-section wd-faq" aria-labelledby="audit-faq"><div className="wd-faq-heading"><span className="wd-section-index">قبل از ثبت درخواست</span><h2 id="audit-faq">پرسش‌های متداول</h2><a className="text-link" href="/web-design/">هنوز سایت ندارید؟ <Icon name="arrow" size={18}/></a></div><div className="wd-faq-list">{faqs.map(([question,answer],index)=><details key={question}><summary><span className="wd-faq-index">{String(index+1).padStart(2,'0')}</span><span>{question}</span><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>
    <section className="container contact-section wd-contact"><div className="closing-card"><div className="closing-orbit" aria-hidden="true"/><h2>آماده‌اید ببینید سایتتان<br/><span>چه چیزهایی برای بهتر شدن دارد؟</span></h2><a className="button primary" href="#audit-form">درخواست بررسی رایگان <Icon name="arrow" size={18}/></a></div></section>
  </div>;
}
