import ResponsiveImage from './ResponsiveImage';
import { useState, type FormEvent } from 'react';

const services = [
  { number: '01', title: 'جزئیات بدنه', description: 'مروری بر سطح، خطوط و جلوهٔ بصری خودرو در یک مسیر پیشنهادی.', tag: 'EXTERIOR', image: '/images/zero-line/bodywork.jpg', alt: 'نمای نزدیک بدنهٔ خودروی بی‌نشان با بازتاب نور و قطره‌های آب' },
  { number: '02', title: 'فضای داخلی', description: 'توجه به بافت‌ها و نقاطی که تجربهٔ حضور در خودرو را شکل می‌دهند.', tag: 'INTERIOR', image: '/images/zero-line/interior.jpg', alt: 'فضای داخلی تیرهٔ خودروی بی‌نشان با صندلی و سطوح چرمی' },
  { number: '03', title: 'نگاه کامل', description: 'دیدن بدنه و کابین در کنار هم، پیش از انتخاب مسیر مناسب.', tag: 'FULL VIEW', image: '/images/zero-line/hero.jpg', alt: 'خودروی تیرهٔ بی‌نشان در استودیوی صنعتی' },
];

const steps = [
  { number: '01', title: 'نیازت را بگو', description: 'در نسخهٔ واقعی، نوع خودرو و موضوع موردنظرت را شرح می‌دهی.' },
  { number: '02', title: 'جزئیات بررسی می‌شود', description: 'مسیر پیشنهادی پس از شناخت وضعیت خودرو مشخص می‌شود.' },
  { number: '03', title: 'آگاهانه تصمیم بگیر', description: 'قبل از هر اقدامی، دربارهٔ گزینه‌ها و مراحل گفت‌وگو می‌کنی.' },
];

const faqs = [
  { question: 'آیا لاین صفر استودیوی واقعی است؟', answer: 'خیر. لاین صفر یک کانسپت نمایشی طراحی سایت توسط پیکسل است و کسب‌وکار واقعی نیست.' },
  { question: 'آیا می‌توان از این صفحه خدماتی درخواست کرد؟', answer: 'خیر. فرم تنها برای نمایش تجربهٔ کاربری ساخته شده و هیچ اطلاعاتی ارسال یا ذخیره نمی‌کند.' },
  { question: 'چطور برای خودروی خودم خدمات پیدا کنم؟', answer: 'برای دریافت خدمات واقعی، باید با یک مرکز معتبر و فعال در شهر خود تماس بگیری و شرایط خدمات آن را بررسی کنی.' },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M9 5h10v10' : 'M19 12H5m7-7-7 7 7 7'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function ZeroLinePage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <div className="zero-page" dir="rtl">
    <a className="zl-skip" href="#zero-main">رفتن به محتوای اصلی</a>
    <div className="zl-demo"><span>کانسپت نمایشی پیکسل؛ کسب‌وکار واقعی نیست</span><a href="/portfolio/">بازگشت به نمونه‌کارها <Arrow diagonal /></a></div>
    <header className="zl-header zl-container" id="top">
      <a className="zl-brand" href="#top" aria-label="لاین صفر، ابتدای صفحه"><span className="zl-brand-symbol" aria-hidden="true">//</span><span>لاین صفر<small lang="en" dir="ltr">ZERO LINE / DETAILING CONCEPT</small></span></a>
      <nav className="zl-nav" aria-label="ناوبری صفحه"><a href="#services">خدمات پیشنهادی</a><a href="#details">جزئیات</a><a href="#process">مسیر درخواست</a><a href="#faq">پرسش‌ها</a></nav>
      <a className="zl-header-cta" href="#inquiry">درخواست نمایشی <Arrow diagonal /></a>
    </header>

    <main id="zero-main">
      <section className="zl-hero" aria-labelledby="zl-title"><ResponsiveImage sizes="100vw" className="zl-hero-image" src="/images/zero-line/hero.jpg" alt="خودروی تیرهٔ بی‌نشان در استودیوی صنعتی با نور سبز لیمویی" width="1672" height="941" fetchPriority="high" /><div className="zl-hero-shade" aria-hidden="true" /><div className="zl-container zl-hero-content"><span className="zl-eyebrow">DETAILING / CONCEPT 001 <i /></span><h1 id="zl-title">جزئیات،<br /><em>اتفاقی نیستند.</em></h1><p>لاین صفر، یک کانسپت برای تجربهٔ دیجیتال استودیوی دیتیلینگ خودرو است؛ نگاهی دقیق به آنچه پیش از تصمیم‌گرفتن باید دید.</p><div className="zl-hero-actions"><a className="zl-button zl-button-lime" href="#inquiry">شروع درخواست نمایشی <Arrow diagonal /></a><a className="zl-outline-link" href="#services">دیدن خدمات پیشنهادی <Arrow /></a></div><span className="zl-hero-disclosure">این صفحه خدمات واقعی ارائه نمی‌کند.</span></div><div className="zl-hero-side" lang="en" dir="ltr" aria-hidden="true">PRECISION IN EVERY LINE — ZERO LINE</div></section>

      <div className="zl-signal" aria-hidden="true"><span lang="en" dir="ltr">ZERO LINE / 001</span><span>فرم. بافت. توجه.</span><span lang="en" dir="ltr">BUILT TO BE SEEN.</span></div>

      <section className="zl-services zl-container" id="services" aria-labelledby="zl-services-title"><div className="zl-section-top"><div><span className="zl-kicker">01 / خدمات پیشنهادی</span><h2 id="zl-services-title">هر سطح،<br /><em>یک داستان.</em></h2></div><p>این سه دسته صرفاً برای نمایش ساختار یک لندینگ خدماتی طراحی شده‌اند. انتخاب واقعی خدمات به بررسی خودرو و گفت‌وگو با ارائه‌دهندهٔ معتبر نیاز دارد.</p></div><div className="zl-service-grid">{services.map(service => <article className="zl-service" key={service.number}><div className="zl-service-image"><ResponsiveImage src={service.image} alt={service.alt} width={service.number === '02' ? 1122 : service.number === '03' ? 1672 : 1536} height={service.number === '02' ? 1402 : service.number === '03' ? 941 : 1024} loading="lazy" /><span lang="en" dir="ltr">{service.tag}</span></div><div className="zl-service-copy"><span className="zl-service-num" lang="en" dir="ltr">{service.number} / 03</span><h3>{service.title}</h3><p>{service.description}</p><a href="#inquiry">درخواست نمایشی <Arrow /></a></div></article>)}</div></section>

      <section className="zl-detail" id="details" aria-labelledby="zl-detail-title"><div className="zl-detail-image"><ResponsiveImage src="/images/zero-line/bodywork.jpg" alt="جزئیات سطح براق خودروی بی‌نشان با بازتاب نور در استودیو" width="1536" height="1024" loading="lazy" /><span lang="en" dir="ltr">SURFACE STUDY / 02</span></div><div className="zl-detail-copy"><span className="zl-kicker">02 / نگاه نزدیک‌تر</span><h2 id="zl-detail-title">تفاوت را<br />در <em>جزئیات</em> ببین.</h2><p>تصویرپردازی این کانسپت روی بافت، نور و فرم متمرکز است. هدف، نشان‌دادن یک مسیر طراحی است که به مخاطب کمک کند خدمات پیشنهادی را واضح‌تر مرور کند.</p><div className="zl-detail-lines"><span><b>01</b> معرفی روشن موضوع</span><span><b>02</b> نمایش تصویری دقیق</span><span><b>03</b> مسیر کوتاه تا درخواست</span></div><a className="zl-text-link" href="#inquiry">رفتن به فرم نمایشی <Arrow /></a></div></section>

      <section className="zl-process zl-container" id="process" aria-labelledby="zl-process-title"><div className="zl-section-top"><div><span className="zl-kicker">03 / مسیر درخواست</span><h2 id="zl-process-title">از اولین نگاه<br />تا <em>تصمیم روشن.</em></h2></div><p>یک فرایند کوتاه و قابل‌فهم برای نمایش مسیر درخواست؛ بدون ادعای زمان، نتیجه یا ارائهٔ خدمت واقعی.</p></div><div className="zl-step-grid">{steps.map(step => <article className="zl-step" key={step.number}><span lang="en" dir="ltr">{step.number}</span><h3>{step.title}</h3><p>{step.description}</p><i aria-hidden="true">↙</i></article>)}</div></section>

      <section className="zl-faq-wrap" id="faq" aria-labelledby="zl-faq-title"><div className="zl-container zl-faq"><div><span className="zl-kicker">04 / پرسش‌های روشن</span><h2 id="zl-faq-title">قبل از<br /><em>شروع.</em></h2><p>این بخش برای شفاف‌کردن ماهیت نمایشی صفحه و مسیر استفاده از فرم قرار گرفته است.</p></div><div className="zl-faq-list">{faqs.map((faq, index) => <details key={faq.question}><summary><span lang="en" dir="ltr">0{index + 1}</span>{faq.question}<b aria-hidden="true">+</b></summary><p>{faq.answer}</p></details>)}</div></div></section>

      <section className="zl-inquiry" id="inquiry" aria-labelledby="zl-inquiry-title"><div className="zl-container zl-inquiry-grid"><div className="zl-inquiry-copy"><span className="zl-kicker">05 / نسخهٔ نمایشی فرم</span><h2 id="zl-inquiry-title">آماده‌ای<br /><em>از صفر شروع کنی؟</em></h2><p>در یک سایت واقعی، اینجا مسیر گفت‌وگو دربارهٔ خودرو و نیاز شما شروع می‌شود. این نسخه فقط رفتار فرم را نشان می‌دهد.</p><span className="zl-inquiry-mark" aria-hidden="true">//</span></div><form className="zl-form" onSubmit={handleSubmit}><span className="zl-form-overline">درخواست بررسی / نسخهٔ نمایشی</span><h3>موضوعت را انتخاب کن.</h3><p className="zl-form-disclosure">این کسب‌وکار واقعی نیست. اطلاعات این فرم ارسال یا ذخیره نمی‌شود.</p><label htmlFor="zl-name">نام</label><input id="zl-name" name="name" type="text" autoComplete="off" placeholder="نام خود را بنویسید" required maxLength={80} /><label htmlFor="zl-mobile">شمارهٔ موبایل</label><input id="zl-mobile" name="mobile" type="tel" inputMode="numeric" autoComplete="off" placeholder="09121234567" pattern="09[0-9]{9}" title="شمارهٔ موبایل را با 09 و ۱۱ رقم وارد کنید" required /><label htmlFor="zl-service">موضوع موردنظر</label><select id="zl-service" name="service" defaultValue="" required><option value="" disabled>یک گزینه انتخاب کنید</option>{services.map(service => <option key={service.number} value={service.number}>{service.title}</option>)}</select><button className="zl-button zl-button-dark" type="submit">نمایش ثبت درخواست <Arrow diagonal /></button><p className="zl-form-status" role="status" aria-live="polite">{submitted ? 'این نسخه نمایشی است؛ درخواستی ثبت نشد.' : ''}</p></form></div></section>
    </main>

    <footer className="zl-footer"><div className="zl-container zl-footer-inner"><span className="zl-brand"><span className="zl-brand-symbol" aria-hidden="true">//</span><span>لاین صفر<small lang="en" dir="ltr">ZERO LINE / CONCEPT ONLY</small></span></span><p>کانسپت نمایشی پیکسل؛ کسب‌وکار واقعی نیست.</p><a href="/portfolio/">بازگشت به نمونه‌کارها <Arrow diagonal /></a></div></footer>
  </div>;
}
