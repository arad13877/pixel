import { Contact } from './Contact';
import { Icon, type IconName } from './Icons';

const needs = [
  'معرفی رستوران',
  'نمایش منو',
  'نمایش آدرس و موقعیت',
  'نمایش ساعات کاری',
  'دسترسی سریع به شماره تماس',
  'لینک سفارش آنلاین در صورت وجود',
  'معرفی شعبه‌ها',
  'انتشار اخبار، پیشنهادها یا مطالب مجموعه',
];

const services: { title: string; description: string; icon: IconName }[] = [
  { title: 'منوی آنلاین', description: 'نمایش دسته‌بندی‌ها، غذاها، نوشیدنی‌ها و اطلاعات هر آیتم به شکل منظم.', icon: 'layers' },
  { title: 'معرفی رستوران', description: 'معرفی مجموعه، فضای رستوران، داستان برند و اطلاعات مورد نیاز مشتریان.', icon: 'globe' },
  { title: 'سفارش آنلاین', description: 'در صورت وجود سیستم سفارش، امکان قرار دادن لینک یا اتصال مسیر سفارش به سایت.', icon: 'sales' },
  { title: 'اطلاعات شعب', description: 'در صورت داشتن چند شعبه، نمایش جداگانه آدرس و اطلاعات هر شعبه.', icon: 'globe' },
  { title: 'گالری تصاویر', description: 'نمایش تصاویر غذاها، محیط رستوران و فضای مجموعه.', icon: 'spark' },
  { title: 'تماس و موقعیت', description: 'نمایش شماره تماس، آدرس، ساعات کاری و مسیر دسترسی.', icon: 'chat' },
];

const features: { title: string; icon: IconName }[] = [
  { title: 'طراحی واکنش‌گرا برای موبایل، تبلت و دسکتاپ', icon: 'globe' },
  { title: 'منوی آنلاین', icon: 'layers' },
  { title: 'دسته‌بندی غذاها و محصولات', icon: 'layers' },
  { title: 'معرفی رستوران', icon: 'globe' },
  { title: 'گالری تصاویر', icon: 'spark' },
  { title: 'معرفی شعبه‌ها', icon: 'globe' },
  { title: 'نمایش آدرس و موقعیت', icon: 'globe' },
  { title: 'ساعات کاری', icon: 'check' },
  { title: 'تماس مستقیم', icon: 'chat' },
  { title: 'اتصال به مسیر سفارش آنلاین', icon: 'sales' },
  { title: 'لینک شبکه‌های اجتماعی', icon: 'chat' },
  { title: 'بخش اخبار و مطالب', icon: 'search' },
  { title: 'ساختار مناسب برای سئو', icon: 'search' },
  { title: 'قابلیت توسعه در آینده', icon: 'code' },
  { title: 'پشتیبانی و بروزرسانی', icon: 'check' },
];

const audiences = [
  'رستوران‌ها',
  'کافه‌ها',
  'فست‌فودها',
  'کافی‌شاپ‌ها',
  'مجموعه‌های غذایی',
  'رستوران‌های دارای چند شعبه',
  'مجموعه‌هایی که سیستم سفارش آنلاین دارند',
  'کسب‌وکارهای غذایی که می‌خواهند حضور آنلاین حرفه‌ای‌تری داشته باشند',
];

const menuItems = [
  'دسته‌بندی غذاها',
  'نام و توضیحات',
  'تصویر',
  'قیمت در صورت ارائه توسط مجموعه',
  'پیشنهادها و آیتم‌های ویژه',
];

const restaurantInfo = ['منو', 'آدرس', 'ساعات کاری', 'شماره تماس', 'شعب', 'تصاویر', 'راه سفارش', 'شبکه‌های اجتماعی'];
const seoItems = ['صفحات معرفی', 'صفحات شعب', 'صفحات منو', 'محتوای متنی', 'لینک‌سازی داخلی', 'تجربه کاربری موبایل', 'سرعت سایت'];

const steps = [
  { title: 'بررسی نیازهای مجموعه', description: 'نوع فعالیت، منو، شعب، روش سفارش و امکانات مورد نیاز بررسی می‌شود.' },
  { title: 'مشخص کردن ساختار سایت', description: 'صفحات و بخش‌های اصلی مانند منو، درباره مجموعه، شعب و تماس مشخص می‌شوند.' },
  { title: 'پیاده‌سازی سایت', description: 'سایت بر اساس ساختار نهایی و Design System پروژه توسعه داده می‌شود.' },
  { title: 'قرار دادن اطلاعات', description: 'اطلاعات رستوران، منو، آدرس‌ها و راه‌های ارتباطی در سایت قرار می‌گیرند.' },
  { title: 'انتشار و توسعه', description: 'سایت منتشر می‌شود و در آینده امکان توسعه امکانات و خدمات پشتیبانی وجود دارد.' },
];

const benefits = [
  'دسترسی سریع مشتری به منو',
  'معرفی حرفه‌ای مجموعه',
  'نمایش اطلاعات کامل رستوران',
  'دسترسی ساده به آدرس و تماس',
  'امکان نمایش شعب مختلف',
  'امکان اتصال به سفارش آنلاین',
  'ایجاد بستر مناسب برای حضور در گوگل',
  'امکان توسعه امکانات در آینده',
];

const faqs = [
  ['هزینه طراحی سایت برای رستوران در گرگان چقدر است؟', 'هزینه به امکانات، تعداد صفحات، ساختار سایت و نیازهای مجموعه بستگی دارد و پس از بررسی پروژه مشخص می‌شود.'],
  ['آیا امکان نمایش منوی رستوران در سایت وجود دارد؟', 'بله، می‌توان منوی آنلاین را با دسته‌بندی‌ها و اطلاعات مورد نیاز مجموعه در سایت قرار داد.'],
  ['آیا امکان سفارش آنلاین وجود دارد؟', 'در صورت وجود سیستم سفارش آنلاین، امکان بررسی و اتصال مسیر سفارش به سایت وجود دارد.'],
  ['آیا می‌توان چند شعبه رستوران را در سایت معرفی کرد؟', 'بله، می‌توان برای هر شعبه اطلاعاتی مانند آدرس، شماره تماس و ساعات کاری را نمایش داد.'],
  ['آیا سایت روی موبایل هم به‌خوبی نمایش داده می‌شود؟', 'بله، سایت به‌صورت واکنش‌گرا پیاده‌سازی می‌شود.'],
  ['آیا امکان قرار دادن تصاویر غذاها و محیط رستوران وجود دارد؟', 'بله، می‌توان گالری تصاویر و تصاویر مربوط به غذاها و فضای مجموعه را در سایت قرار داد.'],
  ['آیا سایت رستوران برای سئو مناسب است؟', 'ساختار سایت می‌تواند با رعایت اصول پایه سئو و قابلیت توسعه در آینده پیاده‌سازی شود.'],
  ['آیا بازطراحی سایت رستورانی که قبلاً طراحی شده هم انجام می‌شود؟', 'ابتدا وضعیت سایت بررسی می‌شود و در صورت امکان می‌توان آن را بازطراحی یا توسعه داد.'],
];

const related = [
  { href: '/web-design-gorgan/', title: 'طراحی سایت در گرگان' },
  { href: '/web-design-price-gorgan/', title: 'قیمت طراحی سایت در گرگان' },
  { href: '/website-support-gorgan/', title: 'پشتیبانی سایت در گرگان' },
  { href: '/web-design-company-gorgan/', title: 'طراحی سایت شرکتی در گرگان' },
];

export default function RestaurantWebDesignGorganPage() {
  return <div className="web-design-page wd-local-service-page wd-restaurant-page">
    <section className="container wd-hero" aria-labelledby="wd-title"><div className="wd-hero-copy"><h1 id="wd-title">طراحی سایت برای رستوران‌های گرگان</h1><p>یک سایت حرفه‌ای می‌تواند رستوران شما را در فضای آنلاین بهتر معرفی کند و دسترسی مشتریان به منو، اطلاعات رستوران، آدرس و راه‌های سفارش را ساده‌تر کند.</p><p>ما برای رستوران‌ها، کافه‌ها، فست‌فودها و مجموعه‌های غذایی گرگان، سایت‌هایی سریع، واکنش‌گرا و متناسب با نیاز کسب‌وکار طراحی و پیاده‌سازی می‌کنیم.</p><div className="wd-actions"><Contact className="primary" id="hero-contact" location="restaurant-gorgan-hero" service="طراحی سایت رستوران در گرگان">دریافت مشاوره طراحی سایت رستوران</Contact><a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a></div></div></section>

    <section className="wd-trust" aria-labelledby="restaurant-need-title"><div className="container wd-trust-inner"><div><h2 id="restaurant-need-title">چرا یک رستوران به سایت حرفه‌ای نیاز دارد؟</h2></div><div><p>بسیاری از مشتریان قبل از انتخاب یک رستوران، نام آن را در اینترنت جستجو می‌کنند تا منو، آدرس، ساعات کاری، تصاویر و راه‌های سفارش را پیدا کنند.</p><p>یک سایت حرفه‌ای می‌تواند این اطلاعات را به‌صورت مرتب و در یک مرجع رسمی در اختیار مشتری قرار دهد.</p></div><ul className="wd-trust-points">{needs.map(item => <li key={item}><Icon name="check" size={16}/>{item}</li>)}</ul></div></section>

    <section id="types" className="container wd-section wd-types" aria-labelledby="restaurant-services-title"><div className="wd-section-heading"><div><h2 id="restaurant-services-title">سایت رستوران با امکانات مورد نیاز شما</h2></div><p>ساختار سایت می‌تواند متناسب با مدل فعالیت رستوران طراحی شود.</p></div><div className="wd-type-grid">{services.map(({ title, description, icon }, index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name={icon} size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section id="features" className="wd-deliverables" aria-labelledby="restaurant-features-title"><div className="container wd-deliverables-layout"><div className="wd-deliverables-copy"><h2 id="restaurant-features-title">امکانات قابل ارائه در سایت رستوران</h2></div><div className="wd-deliverables-list">{features.map(({ title, icon }, index) => <article className="wd-deliverable" key={title}><span className="wd-deliverable-icon"><Icon name={icon} size={20}/></span><span className="wd-deliverable-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3></div></article>)}</div></div></section>

    <section className="container wd-section wd-reasons" aria-labelledby="restaurant-audience-title"><div className="wd-section-heading"><div><h2 id="restaurant-audience-title">چه کسب‌وکارهایی می‌توانند از این سرویس استفاده کنند؟</h2></div><p>این صفحه برای مجموعه‌های مختلف حوزه غذا مناسب است:</p></div><div className="wd-reason-grid">{audiences.map((title, index) => <article className="wd-reason" key={title}><span className="wd-reason-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3></article>)}</div></section>

    <section className="wd-trust" aria-labelledby="restaurant-menu-title"><div className="container wd-trust-inner"><div><h2 id="restaurant-menu-title">منوی آنلاین؛ همیشه در دسترس مشتری</h2></div><div><p>یکی از مهم‌ترین بخش‌های سایت رستوران، منوی آنلاین است.</p><p>مشتری می‌تواند بدون نیاز به مراجعه حضوری، غذاها و نوشیدنی‌های مجموعه را مشاهده کند و اطلاعات مورد نیاز خود را پیدا کند.</p><p>ساختار منو می‌تواند شامل:</p></div><ul className="wd-trust-points">{menuItems.map(item => <li key={item}><Icon name="check" size={16}/>{item}</li>)}</ul></div></section>

    <section className="container wd-section wd-types" aria-labelledby="restaurant-info-title"><div className="wd-section-heading"><div><h2 id="restaurant-info-title">سایت رستوران فقط برای معرفی منو نیست</h2></div><p>سایت می‌تواند نقش یک مرجع آنلاین برای کسب‌وکار شما داشته باشد.<br/>کاربر می‌تواند در یک صفحه یا چند بخش مشخص به اطلاعاتی مانند:</p></div><div className="wd-type-grid">{restaurantInfo.map((title, index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name="check" size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3></article>)}</div></section>

    <section className="wd-trust" aria-labelledby="restaurant-seo-title"><div className="container wd-trust-inner"><div><h2 id="restaurant-seo-title">طراحی سایت رستوران در گرگان با قابلیت توسعه سئو</h2></div><div><p>اگر هدف مجموعه حضور بهتر در جستجوهای گوگل باشد، ساختار سایت باید از ابتدا قابلیت توسعه داشته باشد.</p><p>می‌توان ساختار مناسب برای:</p></div><ul className="wd-trust-points">{seoItems.map(item => <li key={item}><Icon name="check" size={16}/>{item}</li>)}</ul></div></section>

    <section className="container wd-section wd-process" aria-labelledby="restaurant-existing-title"><div className="wd-process-heading"><h2 id="restaurant-existing-title">اگر رستوران شما از قبل سایت دارد</h2></div><div className="wd-restaurant-prose"><p>اگر رستوران یا مجموعه غذایی شما قبلاً سایت دارد اما نیاز به بازطراحی، بروزرسانی یا توسعه آن دارید، ابتدا می‌توان وضعیت فعلی سایت را بررسی کرد.</p><p>در صورت امکان می‌توان روی همان ساختار موجود کار کرد یا برای بخش‌های مورد نیاز راهکار جدید ارائه داد.</p><Contact className="primary" location="restaurant-gorgan-existing" service="بررسی سایت فعلی رستوران در گرگان">بررسی سایت فعلی من</Contact></div></section>

    <section id="process" className="container wd-section wd-process" aria-labelledby="restaurant-process-title"><div className="wd-process-heading"><h2 id="restaurant-process-title">مراحل طراحی سایت رستوران</h2></div><div className="wd-steps"><span className="wd-process-track" aria-hidden="true"><i className="wd-process-fill"/></span>{steps.map(({ title, description }, index) => <article className="wd-step" key={title}><span className="wd-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>

    <section className="container wd-section wd-reasons" aria-labelledby="restaurant-benefits-title"><div className="wd-section-heading"><div><h2 id="restaurant-benefits-title">مزایای داشتن سایت برای رستوران</h2></div></div><div className="wd-reason-grid">{benefits.map((title, index) => <article className="wd-reason" key={title}><span className="wd-reason-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3></article>)}</div></section>

    <section id="faq" className="container wd-section wd-faq" aria-labelledby="restaurant-faq-title"><div className="wd-faq-heading"><h2 id="restaurant-faq-title">سوالات متداول</h2></div><div className="wd-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span className="wd-faq-index">{String(index + 1).padStart(2, '0')}</span><span>{question}</span><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section id="contact" className="container contact-section wd-contact" aria-labelledby="restaurant-contact-title"><div className="closing-card"><div className="closing-orbit" aria-hidden="true"/><h2 id="restaurant-contact-title">سایت حرفه‌ای رستوران خود را راه‌اندازی کنید</h2><p>اگر رستوران، کافه یا مجموعه غذایی شما در گرگان به یک سایت حرفه‌ای برای معرفی منو، اطلاعات مجموعه و راه‌های ارتباطی نیاز دارد، می‌توانیم نیازهای پروژه را بررسی و ساختار مناسب را پیشنهاد کنیم.</p><div className="wd-actions"><Contact className="primary" location="restaurant-gorgan-final" service="طراحی سایت رستوران در گرگان">دریافت مشاوره طراحی سایت رستوران</Contact><a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a></div></div></section>

    <nav className="container wd-local-related" aria-label="صفحه‌های مرتبط">{related.map(({ href, title }) => <a className="wd-text-link" href={href} key={href}>{title} <Icon name="arrow" size={18}/></a>)}</nav>
  </div>;
}
