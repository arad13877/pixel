import { Contact } from './Contact';
import { Icon, type IconName } from './Icons';

const needs = [
  'خدمات و تخصص‌های خود را بهتر معرفی کنید.',
  'اطلاعات مطب، آدرس و راه‌های ارتباطی را در اختیار بیمار قرار دهید.',
  'امکان درخواست یا نوبت‌دهی آنلاین را در صورت وجود، به سایت متصل کنید.',
  'در جستجوهای مرتبط با خدمات پزشکی در گرگان حضور آنلاین بهتری داشته باشید.',
  'اعتماد اولیه بیمار را پیش از مراجعه افزایش دهید.',
  'یک مرجع رسمی برای معرفی خود، خدمات و سوابق حرفه‌ای داشته باشید.',
];

const services: { title: string; description: string; icon: IconName }[] = [
  { title: 'معرفی پزشک', description: 'معرفی تخصص، سوابق، مدارک، حوزه‌های فعالیت و اطلاعات حرفه‌ای.', icon: 'globe' },
  { title: 'معرفی خدمات و درمان‌ها', description: 'ایجاد صفحات اختصاصی برای خدمات و درمان‌های مختلف، با ساختاری مناسب برای کاربران و موتورهای جستجو.', icon: 'layers' },
  { title: 'نوبت‌دهی', description: 'امکان اتصال سایت به سیستم نوبت‌دهی آنلاین یا قرار دادن مسیر ساده برای درخواست نوبت، در صورت وجود زیرساخت مربوطه.', icon: 'check' },
  { title: 'مقالات پزشکی', description: 'ایجاد بخش مقالات برای انتشار محتوای آموزشی و توسعه حضور سایت در گوگل.', icon: 'search' },
  { title: 'اطلاعات مطب', description: 'نمایش آدرس، شماره تماس، ساعات کاری، لوکیشن و مسیر دسترسی.', icon: 'globe' },
  { title: 'ارتباط سریع', description: 'دسترسی سریع به تماس، واتساپ یا سایر کانال‌های ارتباطی مورد استفاده مطب.', icon: 'chat' },
];

const features: { title: string; icon: IconName }[] = [
  { title: 'طراحی کاملاً واکنش‌گرا برای موبایل، تبلت و دسکتاپ', icon: 'globe' },
  { title: 'سرعت مناسب و ساختار فنی استاندارد', icon: 'spark' },
  { title: 'معرفی تخصص و خدمات پزشک', icon: 'layers' },
  { title: 'صفحات اختصاصی خدمات', icon: 'layers' },
  { title: 'فرم درخواست مشاوره یا نوبت', icon: 'chat' },
  { title: 'اتصال به سیستم نوبت‌دهی در صورت وجود', icon: 'check' },
  { title: 'نمایش آدرس و موقعیت مطب', icon: 'globe' },
  { title: 'لینک تماس مستقیم', icon: 'chat' },
  { title: 'اتصال به واتساپ', icon: 'chat' },
  { title: 'بخش مقالات و مطالب آموزشی', icon: 'search' },
  { title: 'ساختار مناسب برای سئو', icon: 'search' },
  { title: 'قابلیت توسعه در آینده', icon: 'code' },
  { title: 'امکان پشتیبانی و به‌روزرسانی سایت', icon: 'check' },
];

const audiences = [
  'پزشکان عمومی و متخصص',
  'دندانپزشکان و کلینیک‌های دندانپزشکی',
  'متخصصان دارای مطب شخصی',
  'کلینیک‌های پزشکی و درمانی',
  'مراکز خدمات تخصصی سلامت',
];

const steps = [
  { title: 'بررسی نیازهای شما', description: 'تخصص، خدمات، مخاطبان و امکانات مورد نیاز سایت بررسی می‌شود.' },
  { title: 'طراحی ساختار سایت', description: 'صفحات و بخش‌های مورد نیاز بر اساس نوع فعالیت شما مشخص می‌شوند.' },
  { title: 'پیاده‌سازی سایت', description: 'سایت با تمرکز بر سرعت، تجربه کاربری، نمایش صحیح در موبایل و ساختار مناسب موتورهای جستجو توسعه داده می‌شود.' },
  { title: 'آماده‌سازی برای انتشار', description: 'محتوا، اطلاعات تماس، صفحات خدمات و بخش‌های مورد نیاز نهایی می‌شوند.' },
  { title: 'پشتیبانی و توسعه', description: 'در صورت نیاز، امکان پشتیبانی، توسعه و خدمات سئو برای ادامه مسیر وجود دارد.' },
];

const faqs = [
  ['هزینه طراحی سایت پزشک در گرگان چقدر است؟', 'هزینه به امکانات، تعداد صفحات، نوع طراحی و قابلیت‌های مورد نیاز سایت بستگی دارد. بعد از بررسی نیازهای شما، برآورد مشخص ارائه می‌شود.'],
  ['آیا سایت پزشک روی موبایل هم به‌خوبی نمایش داده می‌شود؟', 'بله، ساختار سایت به‌صورت واکنش‌گرا پیاده‌سازی می‌شود تا در موبایل، تبلت و دسکتاپ قابل استفاده باشد.'],
  ['آیا امکان نوبت‌دهی آنلاین وجود دارد؟', 'در صورت وجود سیستم یا سرویس نوبت‌دهی مورد نظر شما، امکان بررسی و اتصال آن به سایت وجود دارد.'],
  ['آیا می‌توانم خدمات مختلف خودم را در صفحات جداگانه معرفی کنم؟', 'بله. برای خدمات مهم می‌توان صفحات اختصاصی ایجاد کرد تا هم تجربه کاربر بهتر شود و هم سایت قابلیت توسعه سئویی داشته باشد.'],
  ['آیا سایت برای گوگل و سئو آماده می‌شود؟', 'ساختار فنی و محتوایی سایت با در نظر گرفتن اصول پایه سئو و قابلیت توسعه در آینده پیاده‌سازی می‌شود.'],
  ['آیا بعداً می‌توان سایت را توسعه داد؟', 'بله. ساختار سایت می‌تواند به‌گونه‌ای باشد که در آینده بخش‌های جدید، خدمات، مقالات و امکانات دیگر به آن اضافه شوند.'],
  ['آیا برای مطب‌های گرگان طراحی سایت انجام می‌دهید؟', 'بله، این صفحه به‌طور اختصاصی برای ارائه خدمات طراحی سایت به پزشکان، مطب‌ها و کلینیک‌های گرگان تهیه شده است.'],
];

export default function DoctorWebDesignGorganPage() {
  return <div className="web-design-page wd-doctor-page wd-local-service-page">
    <section className="container wd-hero" aria-labelledby="wd-title">
      <div className="wd-hero-copy">
        <h1 id="wd-title">طراحی سایت پزشکان در گرگان</h1>
        <p className="wd-local-service-lead">سایت حرفه‌ای برای پزشکان، مطب‌ها و کلینیک‌های گرگان</p>
        <p>اگر پزشک هستید و می‌خواهید بیماران جدید راحت‌تر شما را پیدا کنند، خدمات‌تان را حرفه‌ای معرفی کنید و یک حضور آنلاین معتبر داشته باشید، یک سایت پزشکی حرفه‌ای می‌تواند نقطه شروع خوبی باشد.</p>
        <p>ما برای پزشکان، متخصصان، دندانپزشکان، مطب‌ها و کلینیک‌های گرگان، سایت‌هایی سریع، حرفه‌ای، موبایل‌محور و متناسب با نیازهای حوزه پزشکی طراحی می‌کنیم.</p>
        <div className="wd-actions">
          <Contact className="primary" id="hero-contact" location="doctor-gorgan-hero" service="طراحی سایت پزشکان در گرگان">دریافت مشاوره برای طراحی سایت پزشک</Contact>
          <a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a>
        </div>
      </div>
    </section>

    <section className="wd-trust" aria-labelledby="doctor-need-title"><div className="container wd-trust-inner">
      <div><h2 id="doctor-need-title">چرا یک پزشک به سایت حرفه‌ای نیاز دارد؟</h2></div>
      <div><p>امروزه بسیاری از افراد قبل از مراجعه، نام پزشک یا کلینیک را در گوگل جستجو می‌کنند.</p><p>یک سایت حرفه‌ای می‌تواند به شما کمک کند تا:</p></div>
      <ul className="wd-trust-points">{needs.map(item => <li key={item}><Icon name="check" size={16}/>{item}</li>)}</ul>
    </div></section>

    <section id="types" className="container wd-section wd-types" aria-labelledby="doctor-services-title"><div className="wd-section-heading"><div><h2 id="doctor-services-title">طراحی سایت پزشکی متناسب با نیاز شما</h2></div><p>سایت پزشک فقط یک صفحه معرفی نیست.<br/>ساختار سایت می‌تواند متناسب با تخصص و نوع فعالیت شما طراحی شود و بخش‌هایی مانند این موارد را شامل شود:</p></div><div className="wd-type-grid">{services.map(({ title, description, icon }, index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name={icon} size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section id="features" className="wd-deliverables" aria-labelledby="doctor-features-title"><div className="container wd-deliverables-layout"><div className="wd-deliverables-copy"><h2 id="doctor-features-title">امکاناتی که می‌توان برای سایت پزشک در نظر گرفت</h2></div><div className="wd-deliverables-list">{features.map(({ title, icon }, index) => <article className="wd-deliverable" key={title}><span className="wd-deliverable-icon"><Icon name={icon} size={20}/></span><span className="wd-deliverable-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3></div></article>)}</div></div></section>

    <section className="container wd-section wd-reasons" aria-labelledby="doctor-audience-title"><div className="wd-section-heading"><div><h2 id="doctor-audience-title">مناسب چه کسانی است؟</h2></div><p>این سرویس می‌تواند برای موارد زیر مناسب باشد:</p></div><div className="wd-reason-grid">{audiences.map((title, index) => <article className="wd-reason" key={title}><span className="wd-reason-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3></article>)}</div></section>

    <section className="wd-trust" aria-labelledby="doctor-seo-title"><div className="container wd-trust-inner"><div><h2 id="doctor-seo-title">طراحی سایت پزشکان در گرگان با تمرکز روی دیده‌شدن</h2></div><div><p>یک سایت حرفه‌ای فقط ظاهر مناسب ندارد؛ ساختار آن باید از ابتدا به شکلی پیاده‌سازی شود که امکان توسعه سئو و جذب ورودی از گوگل را داشته باشد.</p><p>در طراحی سایت شما، ساختار صفحات، عناوین، محتوای خدمات، لینک‌سازی داخلی، سرعت، تجربه کاربری و قابلیت توسعه سایت در آینده در نظر گرفته می‌شود.</p><p>هدف این است که سایت شما فقط یک کارت ویزیت آنلاین نباشد و بتواند به یک ابزار واقعی برای معرفی خدمات و جذب مراجعه‌کننده تبدیل شود.</p></div></div></section>

    <section className="container wd-section wd-process" aria-labelledby="doctor-dedicated-title"><div className="wd-process-heading"><h2 id="doctor-dedicated-title">چرا سایت اختصاصی برای پزشکان؟</h2></div><div className="wd-doctor-prose"><p>هر پزشک تخصص، خدمات، مخاطب و نیاز متفاوتی دارد.</p><p>به همین دلیل ساختار سایت باید بر اساس فعالیت همان پزشک تنظیم شود؛ نه اینکه صرفاً یک قالب عمومی برای همه استفاده شود.</p><p>ساختار مناسب سایت می‌تواند باعث شود بیمار سریع‌تر به پاسخ سوال خود برسد، خدمات را پیدا کند و مسیر تماس یا دریافت نوبت برایش ساده باشد.</p><a className="wd-text-link" href="/web-design-gorgan/">طراحی سایت در گرگان <Icon name="arrow" size={18}/></a></div></section>

    <section id="process" className="container wd-section wd-process" aria-labelledby="doctor-process-title"><div className="wd-process-heading"><h2 id="doctor-process-title">روند طراحی سایت</h2></div><div className="wd-steps"><span className="wd-process-track" aria-hidden="true"><i className="wd-process-fill"/></span>{steps.map(({ title, description }, index) => <article className="wd-step" key={title}><span className="wd-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>

    <section id="faq" className="container wd-section wd-faq" aria-labelledby="doctor-faq-title"><div className="wd-faq-heading"><h2 id="doctor-faq-title">سوالات متداول</h2></div><div className="wd-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span className="wd-faq-index">{String(index + 1).padStart(2, '0')}</span><span>{question}</span><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section id="contact" className="container contact-section wd-contact" aria-labelledby="doctor-contact-title"><div className="closing-card"><div className="closing-orbit" aria-hidden="true"/><h2 id="doctor-contact-title">آماده‌اید سایت حرفه‌ای مطب خود را راه‌اندازی کنید؟</h2><p>اگر برای مطب یا کلینیک خود به یک سایت حرفه‌ای نیاز دارید، اطلاعات کسب‌وکار و نیازهای شما بررسی می‌شود و بر اساس آن، ساختار مناسب سایت پیشنهاد خواهد شد.</p><div className="wd-actions"><Contact className="primary" location="doctor-gorgan-final" service="طراحی سایت پزشکان در گرگان">مشاوره و برآورد طراحی سایت</Contact><a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a></div></div></section>
  </div>;
}
