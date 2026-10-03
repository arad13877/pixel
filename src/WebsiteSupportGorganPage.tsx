import FeaturedPortfolio from './FeaturedPortfolio';
import { Contact } from './Contact';
import { Icon, type IconName } from './Icons';

const reasons = [
  'بروزرسانی و مدیریت محتوا',
  'رفع خطاهای سایت',
  'بررسی مشکلات فنی',
  'بروزرسانی بخش‌های مختلف سایت',
  'توسعه و اضافه کردن امکانات',
  'بررسی عملکرد و وضعیت کلی سایت',
];

const services: { title: string; description: string; icon: IconName }[] = [
  { title: 'رفع مشکلات و خطاهای سایت', description: 'بررسی و رفع خطاها و مشکلاتی که در عملکرد سایت ایجاد می‌شوند.', icon: 'code' },
  { title: 'بروزرسانی محتوا', description: 'ویرایش یا بروزرسانی متن‌ها، تصاویر، صفحات و اطلاعات سایت.', icon: 'layers' },
  { title: 'بروزرسانی فنی', description: 'رسیدگی به بروزرسانی‌های مورد نیاز بخش‌های مختلف سایت در صورت نیاز.', icon: 'spark' },
  { title: 'تغییرات و اصلاحات', description: 'انجام تغییرات مورد نیاز در صفحات، بخش‌ها و ساختار سایت.', icon: 'layers' },
  { title: 'توسعه امکانات', description: 'اضافه کردن قابلیت‌ها و امکانات جدید در صورت نیاز کسب‌وکار.', icon: 'code' },
  { title: 'بررسی و نگهداری', description: 'بررسی دوره‌ای سایت و رسیدگی به مواردی که می‌توانند روی عملکرد آن تأثیر بگذارند.', icon: 'search' },
];

const audiences = [
  'شرکت‌ها',
  'فروشگاه‌های اینترنتی',
  'پزشکان و کلینیک‌ها',
  'کسب‌وکارهای خدماتی',
  'وب‌سایت‌های شخصی و حرفه‌ای',
  'مجموعه‌هایی که سایت خود را قبلاً راه‌اندازی کرده‌اند اما تیم فنی داخلی ندارند',
];

const steps = [
  { title: 'بررسی سایت', description: 'وضعیت فعلی سایت، نوع پروژه و نیازهای شما بررسی می‌شود.' },
  { title: 'مشخص کردن نیازها', description: 'مشخص می‌شود سایت به چه نوع خدماتی نیاز دارد.' },
  { title: 'تعیین محدوده خدمات', description: 'مواردی مانند بروزرسانی، رفع خطا، تغییرات یا توسعه مشخص می‌شوند.' },
  { title: 'شروع پشتیبانی', description: 'خدمات مورد نیاز طبق محدوده توافق‌شده انجام می‌شود.' },
  { title: 'توسعه در آینده', description: 'در صورت نیاز می‌توان امکانات و خدمات جدیدی به پروژه اضافه کرد.' },
];

const deliverables: { title: string; icon: IconName }[] = [
  { title: 'رسیدگی به مشکلات سایت', icon: 'code' },
  { title: 'بروزرسانی محتوا و بخش‌های مختلف', icon: 'layers' },
  { title: 'امکان اعمال تغییرات', icon: 'spark' },
  { title: 'امکان توسعه امکانات', icon: 'code' },
  { title: 'کاهش درگیری شما با مسائل فنی', icon: 'check' },
  { title: 'امکان ادامه همکاری برای توسعه سایت', icon: 'globe' },
];

const faqs = [
  ['پشتیبانی سایت شامل چه خدماتی می‌شود؟', 'خدمات پشتیبانی می‌تواند شامل بروزرسانی محتوا، رفع خطا، تغییرات، رسیدگی فنی و توسعه امکانات باشد و بر اساس نیاز هر پروژه تعیین شود.'],
  ['آیا پشتیبانی سایت برای سایتی که توسط شخص دیگری طراحی شده هم انجام می‌شود؟', 'بله، ابتدا وضعیت فنی سایت بررسی می‌شود و در صورت امکان، می‌توان خدمات پشتیبانی و توسعه آن را ادامه داد.'],
  ['آیا می‌توان فقط برای رفع یک مشکل از خدمات پشتیبانی استفاده کرد؟', 'بسته به نوع پروژه و نوع مشکل، امکان بررسی و انجام خدمات موردی نیز وجود دارد.'],
  ['آیا امکان پشتیبانی و توسعه همزمان سایت وجود دارد؟', 'بله، در صورت نیاز می‌توان علاوه بر نگهداری و پشتیبانی، تغییرات و امکانات جدید نیز به سایت اضافه کرد.'],
  ['آیا پشتیبانی شامل بروزرسانی محتوای سایت هم می‌شود؟', 'در صورت توافق، بروزرسانی و ویرایش محتوا می‌تواند بخشی از خدمات پشتیبانی باشد.'],
  ['هزینه پشتیبانی سایت در گرگان چقدر است؟', 'هزینه به نوع سایت، حجم کار، خدمات مورد نیاز و نحوه همکاری بستگی دارد و پس از بررسی پروژه مشخص می‌شود.'],
  ['آیا خدمات پشتیبانی به صورت ماهانه انجام می‌شود؟', 'نوع همکاری می‌تواند بر اساس نیاز پروژه تعیین شود و پس از بررسی سایت و خدمات مورد نیاز درباره آن توافق می‌شود.'],
];

const related = [
  { href: '/web-design-gorgan/', title: 'طراحی سایت در گرگان' },
  { href: '/web-design-price-gorgan/', title: 'قیمت طراحی سایت در گرگان' },
  { href: '/web-design-company-gorgan/', title: 'طراحی سایت شرکتی در گرگان' },
  { href: '/web-design-doctors-gorgan/', title: 'طراحی سایت پزشکان در گرگان' },
];

export default function WebsiteSupportGorganPage() {
  return <div className="web-design-page wd-local-service-page wd-support-page">
    <section className="container wd-hero" aria-labelledby="wd-title"><div className="wd-hero-copy"><h1 id="wd-title">پشتیبانی سایت در گرگان</h1><p>سایت بعد از راه‌اندازی هم به نگهداری، بروزرسانی و رسیدگی نیاز دارد. اگر برای مدیریت، رفع مشکلات، بروزرسانی محتوا یا توسعه سایت خود به پشتیبانی نیاز دارید، می‌توانید خدمات پشتیبانی سایت را متناسب با نیاز کسب‌وکارتان دریافت کنید.</p><div className="wd-actions"><Contact className="primary" id="hero-contact" location="support-gorgan-hero" service="پشتیبانی سایت در گرگان">دریافت مشاوره پشتیبانی سایت</Contact><a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a></div></div></section>

    <section className="wd-trust" aria-labelledby="support-importance-title"><div className="container wd-trust-inner"><div><h2 id="support-importance-title">چرا پشتیبانی سایت اهمیت دارد؟</h2></div><div><p>سایت یک پروژه یک‌باره نیست. بعد از راه‌اندازی، ممکن است به بروزرسانی محتوا، رفع خطا، بررسی عملکرد، تغییرات ظاهری، اضافه کردن امکانات و رسیدگی فنی نیاز داشته باشد.</p><p>پشتیبانی منظم می‌تواند کمک کند سایت شما به‌درستی مدیریت شود و مشکلات فنی یا محتوایی آن سریع‌تر شناسایی و برطرف شوند.</p></div><ul className="wd-trust-points">{reasons.map(item => <li key={item}><Icon name="check" size={16}/>{item}</li>)}</ul></div></section>

    <section id="types" className="container wd-section wd-types" aria-labelledby="support-services-title"><div className="wd-section-heading"><div><h2 id="support-services-title">خدمات پشتیبانی سایت در گرگان</h2></div><p>خدمات قابل ارائه می‌تواند بر اساس نیاز هر پروژه متفاوت باشد.</p></div><div className="wd-type-grid">{services.map(({ title, description, icon }, index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name={icon} size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section className="container wd-section wd-reasons" aria-labelledby="support-audience-title"><div className="wd-section-heading"><div><h2 id="support-audience-title">پشتیبانی سایت برای چه کسب‌وکارهایی مناسب است؟</h2></div><p>این خدمات می‌تواند برای مجموعه‌های مختلفی مورد استفاده قرار بگیرد:</p></div><div className="wd-reason-grid">{audiences.map((title, index) => <article className="wd-reason" key={title}><span className="wd-reason-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3></article>)}</div></section>

    <section className="wd-trust" aria-labelledby="support-existing-title"><div className="container wd-trust-inner"><div><h2 id="support-existing-title">سایت دارید اما پشتیبان ندارید؟</h2></div><div><p>لازم نیست برای هر تغییر کوچک یا مشکل فنی، خودتان درگیر مسائل فنی سایت شوید.</p><p>اگر سایت شما قبلاً توسط فرد یا مجموعه دیگری طراحی شده است، می‌توان وضعیت پروژه را بررسی کرد و در صورت امکان، خدمات پشتیبانی، رفع مشکلات و توسعه آن را ادامه داد.</p><Contact className="primary" location="support-gorgan-existing" service="بررسی وضعیت سایت برای پشتیبانی در گرگان">بررسی وضعیت سایت من</Contact></div></div></section>

    <section className="container wd-section wd-process" aria-labelledby="support-continuous-title"><div className="wd-process-heading"><h2 id="support-continuous-title">پشتیبانی مستمر برای یک سایت سالم</h2></div><div className="wd-support-prose"><p>رسیدگی به سایت فقط زمانی که یک مشکل جدی ایجاد شود، همیشه بهترین روش مدیریت سایت نیست.</p><p>پشتیبانی مستمر می‌تواند به شناسایی زودتر مشکلات، بروزرسانی منظم و انجام تغییرات مورد نیاز کمک کند.</p></div></section>

    <section className="container wd-section wd-process" aria-labelledby="support-project-scope"><div className="wd-process-heading"><h2 id="support-project-scope">پیش از شروع پشتیبانی، مسئولیت‌ها را مشخص کنید</h2></div><div className="wd-support-prose"><p>برای بررسی اولیه، آدرس سایت، شرح خطا، زمان مشاهده آن و تغییرات اخیر را آماده کنید. رمز هاست یا اطلاعات مشتریان را در فرم اولیه نفرستید. نیاز به دسترسی فنی پس از بررسی و از مسیر امن مشخص می‌شود.</p><p>رفع خطای موردی، تغییر محتوا و توسعه قابلیت جدید محدوده یکسانی ندارند. پیش از شروع باید موارد قابل انجام، روش تأیید تغییرات، مسئول نسخه پشتیبان و بازیابی و هزینه سرویس‌های بیرونی مشخص شوند. زمان پاسخ و برنامه بررسی دوره‌ای به توافق بستگی دارد؛ پشتیبانی شبانه‌روزی یا رفع فوری وعده داده نمی‌شود.</p><p>اگر هنوز مشکل اصلی مشخص نیست، از <a className="wd-text-link" href="/free-website-audit/">بررسی رایگان سایت کسب‌وکار</a> شروع کنید. برای مشکلات دیده‌شدن در جستجو، <a className="wd-text-link" href="/seo-gorgan/">خدمات سئو در گرگان</a> را ببینید.</p></div></section>

    <section id="process" className="container wd-section wd-process" aria-labelledby="support-process-title"><div className="wd-process-heading"><h2 id="support-process-title">روند پشتیبانی سایت چگونه است؟</h2></div><div className="wd-steps"><span className="wd-process-track" aria-hidden="true"><i className="wd-process-fill"/></span>{steps.map(({ title, description }, index) => <article className="wd-step" key={title}><span className="wd-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>

    <section className="wd-deliverables" aria-labelledby="support-deliverables-title"><div className="container wd-deliverables-layout"><div className="wd-deliverables-copy"><h2 id="support-deliverables-title">با پشتیبانی سایت چه چیزی دریافت می‌کنید؟</h2></div><div className="wd-deliverables-list">{deliverables.map(({ title, icon }, index) => <article className="wd-deliverable" key={title}><span className="wd-deliverable-icon"><Icon name={icon} size={20}/></span><span className="wd-deliverable-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3></div></article>)}</div></div></section>

    <section className="container wd-section wd-process" aria-labelledby="support-other-site-title"><div className="wd-process-heading"><h2 id="support-other-site-title">سایت شما از قبل طراحی شده است؟</h2></div><div className="wd-support-prose"><p>برای دریافت خدمات پشتیبانی، لزوماً لازم نیست سایت شما توسط ما طراحی شده باشد.</p><p>اگر سایت فعلی شما از نظر فنی قابلیت ادامه کار داشته باشد، می‌توان ابتدا وضعیت آن را بررسی کرد و سپس درباره امکان ارائه خدمات پشتیبانی و توسعه تصمیم گرفت.</p><Contact className="primary" location="support-gorgan-other-site" service="بررسی سایت فعلی برای پشتیبانی در گرگان">بررسی سایت فعلی</Contact></div></section>

    <FeaturedPortfolio/>
    <section id="faq" className="container wd-section wd-faq" aria-labelledby="support-faq-title"><div className="wd-faq-heading"><h2 id="support-faq-title">سوالات متداول</h2></div><div className="wd-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span className="wd-faq-index">{String(index + 1).padStart(2, '0')}</span><span>{question}</span><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section id="contact" className="container contact-section wd-contact" aria-labelledby="support-contact-title"><div className="closing-card"><div className="closing-orbit" aria-hidden="true"/><h2 id="support-contact-title">برای سایت خود پشتیبان مطمئن داشته باشید</h2><p>اگر سایت شما نیاز به بروزرسانی، رفع مشکل، نگهداری یا توسعه دارد، می‌توان وضعیت فعلی آن را بررسی کرد و خدمات مورد نیاز را مشخص کرد.</p><div className="wd-actions"><Contact className="primary" location="support-gorgan-final" service="پشتیبانی سایت در گرگان">دریافت مشاوره پشتیبانی سایت</Contact><Contact glass location="support-gorgan-final-review" service="بررسی سایت برای پشتیبانی در گرگان">بررسی سایت من</Contact><a className="wd-text-link seo-request-link" href="/request/">ثبت درخواست پروژه <Icon name="arrow" size={16}/></a></div></div></section>

    <nav className="container wd-local-related" aria-label="صفحه‌های مرتبط">{related.map(({ href, title }) => <a className="wd-text-link" href={href} key={href}>{title} <Icon name="arrow" size={18}/></a>)}</nav>
  </div>;
}
