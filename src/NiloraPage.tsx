import { useState, type FormEvent } from 'react';

const services = [
  { number: '01', title: 'معاینه و مشاوره', description: 'فرصتی برای گفت‌وگو درباره نیازها و آشنایی با مسیر پیشنهادی مراقبت.', symbol: '✦' },
  { number: '02', title: 'مراقبت‌های دوره‌ای', description: 'رسیدگی منظم به سلامت دهان و دندان، با توضیح روشن هر مرحله.', symbol: '◌' },
  { number: '03', title: 'ترمیم دندان', description: 'نگاهی دقیق به گزینه‌های ترمیم، متناسب با شرایط هر مراجعه‌کننده.', symbol: '⌁' },
  { number: '04', title: 'زیبایی لبخند', description: 'بررسی خواسته‌های زیبایی‌شناختی در کنار توجه به سلامت دندان.', symbol: '✳' },
];

const steps = [
  { number: '۰۱', title: 'درخواست را ثبت کن', description: 'موضوع موردنظرت را در فرم کوتاه پایین صفحه انتخاب کن.' },
  { number: '۰۲', title: 'نیازت را مرور کن', description: 'در یک فرایند واقعی، جزئیات و زمان مناسب با تو هماهنگ می‌شود.' },
  { number: '۰۳', title: 'با آگاهی شروع کن', description: 'پیش از هر تصمیم، درباره مسیر پیشنهادی گفت‌وگو می‌کنی.' },
];

const faqs = [
  { question: 'از کجا شروع کنم؟', answer: 'برای یک مراجعه واقعی، نخست باید با کلینیک موردنظر خود تماس بگیرید. فرم این صفحه تنها بخشی از کانسپت طراحی است و درخواستی ارسال نمی‌کند.' },
  { question: 'آیا این صفحه امکان رزرو نوبت دارد؟', answer: 'خیر. نیلورا یک پروژه نمایشی پیکسل است. اطلاعات فرم نه ذخیره می‌شود و نه برای کسی ارسال می‌شود.' },
  { question: 'آیا خدمات این صفحه واقعاً ارائه می‌شوند؟', answer: 'این فهرست برای نمایش شیوه سازمان‌دهی خدمات در یک لندینگ طراحی شده است و به یک مرکز درمانی واقعی تعلق ندارد.' },
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M8 6h10v10' : 'M19 12H5m7-7-7 7 7 7'} /></svg>;
}

export default function NiloraPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <div className="nilora-page" dir="rtl">
    <a className="nl-skip" href="#nilora-main">رفتن به محتوای اصلی</a>
    <div className="nl-demo-strip"><span>کانسپت نمایشی پیکسل؛ کلینیک واقعی نیست</span><a href="/portfolio/">بازگشت به نمونه‌کارها <ArrowIcon diagonal /></a></div>

    <header className="nl-header nl-container">
      <a href="#top" className="nl-brand" aria-label="نیلورا، بازگشت به ابتدای صفحه"><span className="nl-brand-mark" aria-hidden="true"><i/><i/><i/><i/></span><span>نیلورا<small lang="en" dir="ltr">NILORA DENTAL CONCEPT</small></span></a>
      <nav className="nl-nav" aria-label="بخش‌های نیلورا"><a href="#services">خدمات</a><a href="#space">فضای پیشنهادی</a><a href="#process">مسیر مراجعه</a><a href="#faq">پرسش‌ها</a></nav>
      <a className="nl-header-cta" href="#appointment">درخواست نوبت <ArrowIcon /></a>
    </header>

    <main id="nilora-main">
      <section className="nl-hero nl-container" id="top" aria-labelledby="nl-title">
        <div className="nl-hero-copy"><span className="nl-kicker"><span className="nl-kicker-line"/> یک تجربه آرام‌تر از اولین قدم</span><h1 id="nl-title">لبخند خوب،<br/>از <em>حس خوب</em> شروع می‌شود.</h1><p>اینجا هر قدم با گفت‌وگویی روشن آغاز می‌شود؛ از شناخت نیاز تو تا انتخاب مسیری که با آرامش در آن پیش بروی.</p><div className="nl-hero-actions"><a className="nl-button nl-button-dark" href="#appointment">درخواست نوبت <ArrowIcon /></a><a className="nl-link" href="#services">آشنایی با خدمات <ArrowIcon /></a></div><span className="nl-hero-note">این وب‌سایت یک طراحی مفهومی است و خدمات درمانی ارائه نمی‌کند.</span></div>
        <div className="nl-hero-visual"><div className="nl-hero-photo"><img src="/images/nilora/reception.jpg" alt="تصویر تولیدشده از فضای فرضی پذیرش کلینیک نیلورا" width="1536" height="1024" fetchPriority="high" /></div><div className="nl-photo-caption"><span className="nl-caption-flower" aria-hidden="true">✳</span><span>فضایی که برای آرامش<br/><strong>تصور شده است.</strong></span></div><span className="nl-hero-image-label" lang="en" dir="ltr">A CALMER WAY TO BEGIN</span></div>
      </section>

      <div className="nl-values"><div className="nl-container nl-values-inner"><span>گفت‌وگوی روشن</span><i aria-hidden="true"/><span>فضایی آرام</span><i aria-hidden="true"/><span>مسیر قابل فهم</span><i aria-hidden="true"/><span>توجه به جزئیات</span></div></div>

      <section className="nl-section nl-services nl-container" id="services" aria-labelledby="nl-services-title"><div className="nl-section-head"><div><span className="nl-section-label">۰۱ / خدمات</span><h2 id="nl-services-title">هر نیاز،<br/><em>یک شروع متفاوت.</em></h2></div><p>در این کانسپت، خدمات طوری چیده شده‌اند که بتوانی موضوع موردنظرت را سریع پیدا کنی و قدم بعدی را بدانی.</p></div><div className="nl-service-grid">{services.map(service => <article className="nl-service" key={service.number}><span className="nl-service-symbol" aria-hidden="true">{service.symbol}</span><span className="nl-service-number">{service.number}</span><h3>{service.title}</h3><p>{service.description}</p><a href="#appointment" aria-label={`درخواست نوبت برای ${service.title}`}>درخواست نوبت <ArrowIcon /></a></article>)}</div></section>

      <section className="nl-space" id="space" aria-labelledby="nl-space-title"><div className="nl-container nl-space-inner"><div className="nl-space-photos"><div className="nl-space-main-image"><img src="/images/nilora/room.jpg" alt="تصویر تولیدشده از اتاق درمان فرضی با نور طبیعی" width="1024" height="1536" loading="lazy" /></div><div className="nl-space-detail"><span>تصویری از یک محیط فرضی</span><strong lang="en" dir="ltr">ROOM FOR CALM</strong></div></div><div className="nl-space-copy"><span className="nl-section-label">۰۲ / فضای پیشنهادی</span><h2 id="nl-space-title">جایی برای مکث،<br/><em>پیش از شروع.</em></h2><p>در طراحی این تجربه، فضای کلینیک را روشن، خلوت و انسانی تصور کرده‌ایم؛ جایی که اطلاعات مهم به سادگی دیده می‌شوند و هیچ قدمی عجولانه نیست.</p><div className="nl-space-points"><span><b>01</b> محیط روشن و خوانا</span><span><b>02</b> اطلاعات بدون شلوغی</span><span><b>03</b> دسترسی ساده به اقدام بعدی</span></div><a className="nl-link" href="#process">مسیر مراجعه را ببین <ArrowIcon /></a></div></div></section>

      <section className="nl-section nl-process nl-container" id="process" aria-labelledby="nl-process-title"><div className="nl-section-head"><div><span className="nl-section-label">۰۳ / مسیر مراجعه</span><h2 id="nl-process-title">قدم بعدی همیشه<br/><em>روشن است.</em></h2></div><p>یک مسیر کوتاه و قابل فهم، از نخستین درخواست تا گفت‌وگو درباره نیاز تو.</p></div><div className="nl-steps">{steps.map(step => <article className="nl-step" key={step.number}><span className="nl-step-number">{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></section>

      <section className="nl-faq-wrap" id="faq" aria-labelledby="nl-faq-title"><div className="nl-container nl-faq"><div><span className="nl-section-label">۰۴ / پرسش‌های متداول</span><h2 id="nl-faq-title">پاسخ‌های روشن،<br/><em>برای شروعی ساده.</em></h2><p>این بخش هم بخشی از نمونهٔ طراحی است و جایگزین اطلاعات یک کلینیک واقعی نیست.</p></div><div className="nl-faq-list">{faqs.map((item, index) => <details key={item.question}><summary><span className="nl-faq-number">{['۰۱', '۰۲', '۰۳'][index]}</span>{item.question}<span className="nl-faq-plus" aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></section>

      <section className="nl-appointment" id="appointment" aria-labelledby="nl-appointment-title"><div className="nl-container nl-appointment-inner"><div className="nl-appointment-copy"><span className="nl-section-label">۰۵ / یک شروع ساده</span><h2 id="nl-appointment-title">اولین قدم را<br/><em>اینجا بردار.</em></h2><p>فرم روبه‌رو فقط عملکرد یک لندینگ واقعی را نشان می‌دهد. هیچ اطلاعاتی ارسال یا ذخیره نمی‌شود و نوبتی ثبت نخواهد شد.</p><span className="nl-appointment-flower" aria-hidden="true">✳</span></div><form className="nl-form" onSubmit={handleSubmit}><span className="nl-form-kicker">فرم نمایشی درخواست نوبت</span><h3>درباره نیازت بگو</h3><p>پر کردن فرم، صرفاً یک تعامل نمایشی است.</p><label htmlFor="nilora-name">نام و نام خانوادگی</label><input id="nilora-name" type="text" autoComplete="off" placeholder="نام شما" required onChange={() => setSubmitted(false)} /><label htmlFor="nilora-phone">شماره موبایل</label><input id="nilora-phone" type="tel" inputMode="numeric" autoComplete="off" placeholder="۰۹..." pattern="09[0-9]{9}" title="شماره موبایل را با ۰۹ و ارقام انگلیسی وارد کنید" required onChange={() => setSubmitted(false)} /><label htmlFor="nilora-service">موضوع موردنظر</label><select id="nilora-service" defaultValue="" required onChange={() => setSubmitted(false)}><option value="" disabled>یک گزینه انتخاب کنید</option>{services.map(service => <option key={service.number} value={service.number}>{service.title}</option>)}</select><button className="nl-button nl-button-dark" type="submit">نمایش ثبت درخواست <ArrowIcon /></button><p className="nl-form-disclosure">این کانسپت کلینیک واقعی نیست؛ اطلاعات فرم ارسال یا نگهداری نمی‌شود.</p><p className="nl-form-status" role="status" aria-live="polite">{submitted ? 'این نسخه نمایشی است؛ نوبتی ثبت نشد.' : ''}</p></form></div></section>
    </main>

    <footer className="nl-footer"><div className="nl-container nl-footer-inner"><span className="nl-brand nl-footer-brand"><span className="nl-brand-mark" aria-hidden="true"><i/><i/><i/><i/></span><span>نیلورا<small lang="en" dir="ltr">NILORA DENTAL CONCEPT</small></span></span><p>کانسپت نمایشی پیکسل؛ کلینیک واقعی نیست.</p><a href="/portfolio/">بازگشت به نمونه‌کارهای پیکسل <ArrowIcon diagonal /></a></div></footer>
  </div>;
}
