import { Contact } from './Contact';
import { Icon, type IconName } from './Icons';

const needs = [
  'شرکت و خدمات خود را حرفه‌ای‌تر معرفی کنید.',
  'اعتبار بیشتری در فضای آنلاین داشته باشید.',
  'خدمات و محصولات خود را به‌صورت منظم معرفی کنید.',
  'راه‌های ارتباطی مشتریان را ساده‌تر کنید.',
  'از طریق گوگل مخاطبان جدید جذب کنید.',
  'یک مرجع رسمی برای معرفی مجموعه خود داشته باشید.',
];

const services: { title: string; description: string; icon: IconName }[] = [
  { title: 'معرفی شرکت', description: 'معرفی مجموعه، تاریخچه، حوزه فعالیت، ارزش‌ها و اطلاعات حرفه‌ای شرکت.', icon: 'globe' },
  { title: 'معرفی خدمات', description: 'ایجاد صفحات اختصاصی برای خدمات اصلی شرکت و ارائه کامل‌تر اطلاعات به مخاطبان.', icon: 'layers' },
  { title: 'معرفی محصولات', description: 'نمایش محصولات، دسته‌بندی‌ها، مشخصات و اطلاعات مورد نیاز مشتریان.', icon: 'sales' },
  { title: 'پروژه‌ها و نمونه‌کارها', description: 'نمایش پروژه‌های انجام‌شده برای معرفی توانمندی و تجربه مجموعه.', icon: 'spark' },
  { title: 'مقالات و اخبار', description: 'ایجاد بخش محتوا برای انتشار مطالب تخصصی، اخبار شرکت و توسعه حضور در گوگل.', icon: 'search' },
  { title: 'تماس با ما', description: 'نمایش شماره تماس، آدرس، فرم ارتباطی، شبکه‌های اجتماعی و مسیر دسترسی.', icon: 'chat' },
];

const features: { title: string; icon: IconName }[] = [
  { title: 'طراحی کاملاً واکنش‌گرا برای موبایل، تبلت و دسکتاپ', icon: 'globe' },
  { title: 'طراحی ساختار متناسب با هویت شرکت', icon: 'layers' },
  { title: 'معرفی خدمات و محصولات', icon: 'sales' },
  { title: 'صفحات اختصاصی خدمات', icon: 'layers' },
  { title: 'بخش پروژه‌ها و نمونه‌کارها', icon: 'spark' },
  { title: 'بخش مقالات و اخبار', icon: 'search' },
  { title: 'فرم تماس و درخواست همکاری', icon: 'chat' },
  { title: 'نمایش آدرس و موقعیت شرکت', icon: 'globe' },
  { title: 'اتصال به واتساپ و راه‌های ارتباطی', icon: 'chat' },
  { title: 'ساختار فنی مناسب برای سئو', icon: 'search' },
  { title: 'سرعت و تجربه کاربری مناسب', icon: 'spark' },
  { title: 'قابلیت توسعه در آینده', icon: 'code' },
  { title: 'امکان پشتیبانی و به‌روزرسانی سایت', icon: 'check' },
];

const audiences = [
  'شرکت‌های خدماتی',
  'شرکت‌های بازرگانی',
  'شرکت‌های ساختمانی و پیمانکاری',
  'شرکت‌های تولیدی و صنعتی',
  'شرکت‌های فناوری و IT',
  'شرکت‌های مشاوره‌ای',
  'مجموعه‌های B2B',
  'کسب‌وکارهایی که می‌خواهند فعالیت خود را حرفه‌ای‌تر در فضای آنلاین معرفی کنند',
];

const questions = [
  'شرکت چه کاری انجام می‌دهد؟',
  'چه خدمات یا محصولاتی ارائه می‌کند؟',
  'چه تجربه و پروژه‌هایی دارد؟',
  'چگونه می‌توان با مجموعه تماس گرفت؟',
];

const steps = [
  { title: 'بررسی نیازهای شرکت', description: 'حوزه فعالیت، خدمات، مخاطبان و امکانات مورد نیاز بررسی می‌شود.' },
  { title: 'طراحی ساختار سایت', description: 'صفحات و بخش‌های مورد نیاز بر اساس نوع کسب‌وکار مشخص می‌شوند.' },
  { title: 'پیاده‌سازی سایت', description: 'سایت با تمرکز بر سرعت، تجربه کاربری، نمایش مناسب در موبایل و ساختار فنی استاندارد توسعه داده می‌شود.' },
  { title: 'آماده‌سازی محتوا و اطلاعات', description: 'اطلاعات شرکت، خدمات، پروژه‌ها و راه‌های ارتباطی در سایت قرار می‌گیرند.' },
  { title: 'انتشار و توسعه', description: 'سایت آماده انتشار می‌شود و در ادامه امکان توسعه، سئو و پشتیبانی وجود خواهد داشت.' },
];

const faqs = [
  ['هزینه طراحی سایت شرکتی در گرگان چقدر است؟', 'هزینه طراحی به امکانات، تعداد صفحات، نوع ساختار و نیازهای شرکت بستگی دارد. پس از بررسی نیازهای مجموعه، برآورد مناسب ارائه می‌شود.'],
  ['آیا سایت شرکتی روی موبایل هم به‌خوبی نمایش داده می‌شود؟', 'بله، سایت به‌صورت واکنش‌گرا طراحی می‌شود تا در موبایل، تبلت و دسکتاپ قابل استفاده باشد.'],
  ['آیا می‌توان خدمات شرکت را در صفحات جداگانه معرفی کرد؟', 'بله. برای خدمات مهم می‌توان صفحات اختصاصی ایجاد کرد تا اطلاعات کامل‌تری در اختیار کاربران قرار گیرد و سایت قابلیت توسعه بهتری داشته باشد.'],
  ['آیا امکان نمایش محصولات و پروژه‌های شرکت وجود دارد؟', 'بله. می‌توان بخش اختصاصی برای محصولات، پروژه‌ها و نمونه‌کارهای شرکت ایجاد کرد.'],
  ['آیا سایت برای سئو آماده می‌شود؟', 'ساختار فنی و محتوایی سایت با رعایت اصول پایه سئو و با قابلیت توسعه برای فعالیت‌های سئویی آینده پیاده‌سازی می‌شود.'],
  ['آیا امکان اتصال سایت به واتساپ و فرم تماس وجود دارد؟', 'بله، در صورت نیاز می‌توان راه‌های ارتباطی مختلف و فرم‌های مورد نیاز را در سایت قرار داد.'],
  ['آیا بعداً می‌توان امکانات جدید به سایت اضافه کرد؟', 'بله، ساختار سایت می‌تواند به‌گونه‌ای پیاده‌سازی شود که در آینده امکان توسعه و اضافه کردن قابلیت‌های جدید وجود داشته باشد.'],
];

export default function CorporateWebDesignGorganPage() {
  return <div className="web-design-page wd-local-service-page">
    <section className="container wd-hero" aria-labelledby="wd-title">
      <div className="wd-hero-copy">
        <h1 id="wd-title">طراحی سایت شرکتی در گرگان</h1>
        <p className="wd-local-service-lead">طراحی سایت حرفه‌ای برای شرکت‌ها و کسب‌وکارهای گرگان</p>
        <p>یک سایت شرکتی حرفه‌ای فقط یک معرفی ساده از شرکت نیست؛ بلکه می‌تواند ویترین آنلاین کسب‌وکار، ابزار معرفی خدمات و یکی از مهم‌ترین نقاط تماس شما با مشتریان باشد.</p>
        <p>ما برای شرکت‌ها و کسب‌وکارهای گرگان، سایت‌های حرفه‌ای، سریع، واکنش‌گرا و متناسب با هویت و نیازهای هر مجموعه طراحی و پیاده‌سازی می‌کنیم.</p>
        <div className="wd-actions">
          <Contact className="primary" id="hero-contact" location="corporate-gorgan-hero" service="طراحی سایت شرکتی در گرگان">دریافت مشاوره طراحی سایت شرکتی</Contact>
          <a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a>
        </div>
      </div>
    </section>

    <section className="wd-trust" aria-labelledby="corporate-need-title"><div className="container wd-trust-inner"><div><h2 id="corporate-need-title">چرا شرکت شما به یک سایت حرفه‌ای نیاز دارد؟</h2></div><div><p>امروزه بسیاری از مشتریان و همکاری‌های تجاری، قبل از تماس با یک شرکت، نام آن مجموعه و خدماتش را در اینترنت بررسی می‌کنند.</p><p>یک سایت شرکتی حرفه‌ای می‌تواند به شما کمک کند تا:</p></div><ul className="wd-trust-points">{needs.map(item => <li key={item}><Icon name="check" size={16}/>{item}</li>)}</ul></div></section>

    <section id="types" className="container wd-section wd-types" aria-labelledby="corporate-services-title"><div className="wd-section-heading"><div><h2 id="corporate-services-title">سایت شرکتی متناسب با کسب‌وکار شما</h2></div><p>هر شرکت ساختار، خدمات و مخاطبان متفاوتی دارد.<br/>به همین دلیل سایت شما می‌تواند بر اساس نوع فعالیت مجموعه طراحی شود و بخش‌هایی مانند موارد زیر را داشته باشد:</p></div><div className="wd-type-grid">{services.map(({ title, description, icon }, index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name={icon} size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section id="features" className="wd-deliverables" aria-labelledby="corporate-features-title"><div className="container wd-deliverables-layout"><div className="wd-deliverables-copy"><h2 id="corporate-features-title">امکانات قابل ارائه در سایت شرکتی</h2></div><div className="wd-deliverables-list">{features.map(({ title, icon }, index) => <article className="wd-deliverable" key={title}><span className="wd-deliverable-icon"><Icon name={icon} size={20}/></span><span className="wd-deliverable-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3></div></article>)}</div></div></section>

    <section className="container wd-section wd-reasons" aria-labelledby="corporate-audience-title"><div className="wd-section-heading"><div><h2 id="corporate-audience-title">چه شرکت‌هایی می‌توانند از طراحی سایت شرکتی استفاده کنند؟</h2></div><p>این خدمات می‌تواند برای طیف مختلفی از کسب‌وکارها مناسب باشد؛ از جمله:</p></div><div className="wd-reason-grid">{audiences.map((title, index) => <article className="wd-reason" key={title}><span className="wd-reason-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3></article>)}</div></section>

    <section className="wd-trust" aria-labelledby="corporate-seo-title"><div className="container wd-trust-inner"><div><h2 id="corporate-seo-title">طراحی سایت شرکتی در گرگان با تمرکز بر رشد آنلاین</h2></div><div><p>یک سایت شرکتی خوب باید علاوه بر ظاهر حرفه‌ای، ساختار مناسبی برای توسعه و جذب مخاطب داشته باشد.</p><p>ساختار صفحات، عناوین، خدمات، لینک‌های داخلی، سرعت و تجربه کاربری از ابتدا باید به شکلی پیاده‌سازی شوند که سایت بتواند در آینده برای سئو، تولید محتوا و توسعه خدمات مورد استفاده قرار گیرد.</p><p>هدف این است که سایت فقط یک بروشور آنلاین نباشد؛ بلکه به یک ابزار کاربردی برای معرفی شرکت و ایجاد ارتباط با مشتریان تبدیل شود.</p><a className="wd-text-link" href="/web-design-gorgan/">طراحی سایت در گرگان <Icon name="arrow" size={18}/></a></div></div></section>

    <section className="container wd-section wd-types" aria-labelledby="corporate-value-title"><div className="wd-section-heading"><div><h2 id="corporate-value-title">سایت شما، نماینده آنلاین شرکت شماست</h2></div><p>وقتی یک مشتری نام شرکت شما را جستجو می‌کند، سایت شما می‌تواند اولین تصویری باشد که از مجموعه شما می‌بیند.<br/>به همین دلیل ساختار سایت باید اطلاعات مهم را به‌صورت واضح در اختیار کاربر قرار دهد:</p></div><div className="wd-type-grid">{questions.map((title, index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name="check" size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3></article>)}</div><p className="wd-local-service-after-grid">با یک ساختار درست، کاربر بدون سردرگمی می‌تواند پاسخ این سوالات را پیدا کند.</p></section>

    <section id="process" className="container wd-section wd-process" aria-labelledby="corporate-process-title"><div className="wd-process-heading"><h2 id="corporate-process-title">مراحل طراحی سایت شرکتی</h2></div><div className="wd-steps"><span className="wd-process-track" aria-hidden="true"><i className="wd-process-fill"/></span>{steps.map(({ title, description }, index) => <article className="wd-step" key={title}><span className="wd-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>

    <section id="faq" className="container wd-section wd-faq" aria-labelledby="corporate-faq-title"><div className="wd-faq-heading"><h2 id="corporate-faq-title">سوالات متداول</h2></div><div className="wd-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span className="wd-faq-index">{String(index + 1).padStart(2, '0')}</span><span>{question}</span><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section id="contact" className="container contact-section wd-contact" aria-labelledby="corporate-contact-title"><div className="closing-card"><div className="closing-orbit" aria-hidden="true"/><h2 id="corporate-contact-title">سایت حرفه‌ای شرکت خود را راه‌اندازی کنید</h2><p>اگر شرکت شما به یک سایت حرفه‌ای برای معرفی خدمات، محصولات و فعالیت‌های خود نیاز دارد، می‌توانیم نیازهای مجموعه شما را بررسی و ساختار مناسب سایت را پیشنهاد کنیم.</p><div className="wd-actions"><Contact className="primary" location="corporate-gorgan-final" service="طراحی سایت شرکتی در گرگان">مشاوره و برآورد طراحی سایت شرکتی</Contact><a className="wd-text-link seo-request-link" href="/request/">ثبت درخواست پروژه <Icon name="arrow" size={16}/></a><a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a></div></div></section>
  </div>;
}
