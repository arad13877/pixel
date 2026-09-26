import { Contact } from './Contact';
import { Icon, type IconName } from './Icons';
import WebDesignHeroArt from './WebDesignHeroArt';

const services: { title: string; icon: IconName }[] = [
  { title: 'سایت شرکتی', icon: 'globe' },
  { title: 'سایت خدماتی', icon: 'layers' },
  { title: 'سایت فروشگاهی', icon: 'sales' },
  { title: 'سایت شخصی و معرفی برند', icon: 'spark' },
  { title: 'سایت رستوران و کافه', icon: 'globe' },
  { title: 'سایت سالن زیبایی و کلینیک', icon: 'layers' },
  { title: 'سایت برای کسب‌وکارهای محلی', icon: 'globe' },
];

const advantages: { title: string; icon: IconName }[] = [
  { title: 'طراحی متناسب با هویت و نیاز کسب‌وکار', icon: 'layers' },
  { title: 'نمایش صحیح در موبایل، تبلت و دسکتاپ', icon: 'globe' },
  { title: 'سرعت و عملکرد مناسب', icon: 'spark' },
  { title: 'ساختار فنی مناسب برای SEO', icon: 'search' },
  { title: 'مسیر ساده برای تماس و دریافت درخواست مشتری', icon: 'chat' },
  { title: 'قابلیت توسعه و اضافه کردن امکانات در آینده', icon: 'code' },
  { title: 'امکان اتصال به ابزارهای تحلیل و مدیریت سایت', icon: 'layers' },
  { title: 'پشتیبانی و نگهداری پس از راه‌اندازی، بر اساس پلن انتخابی', icon: 'check' },
];

const steps = [
  'بررسی کسب‌وکار و نیازهای پروژه',
  'تعیین ساختار و امکانات موردنیاز',
  'طراحی و توسعه سایت',
  'بررسی عملکرد و سازگاری با دستگاه‌های مختلف',
  'راه‌اندازی و انتشار',
  'پشتیبانی و توسعه در صورت نیاز',
];

const audiences = [
  'شرکت‌ها و مجموعه‌های خدماتی',
  'فروشگاه‌ها و کسب‌وکارهای آنلاین',
  'پزشکان، کلینیک‌ها و متخصصان',
  'سالن‌های زیبایی و مجموعه‌های خدماتی',
  'رستوران‌ها و کافه‌ها',
  'آموزشگاه‌ها و مجموعه‌های آموزشی',
  'مشاغل و برندهای محلی گرگان',
];

const faqs = [
  ['هزینه طراحی سایت در گرگان چقدر است؟', 'هزینه طراحی سایت به نوع سایت، تعداد صفحات، امکانات و نیازهای هر کسب‌وکار بستگی دارد. پس از بررسی نیازهای پروژه می‌توان پیشنهاد دقیق‌تری ارائه کرد.'],
  ['طراحی سایت چقدر زمان می‌برد؟', 'مدت زمان اجرای پروژه به نوع سایت و امکانات موردنیاز بستگی دارد و پس از مشخص شدن محدوده پروژه اعلام می‌شود.'],
  ['آیا سایت روی موبایل هم نمایش داده می‌شود؟', 'بله. سایت باید برای نمایش صحیح و تجربه کاربری مناسب در موبایل، تبلت و دسکتاپ توسعه داده شود.'],
  ['آیا امکان اضافه کردن امکانات جدید در آینده وجود دارد؟', 'بله. معماری پروژه تا حد امکان به شکلی در نظر گرفته می‌شود که در آینده بتوان امکانات و بخش‌های جدید را به آن اضافه کرد.'],
  ['آیا SEO هم انجام می‌دهید؟', 'طراحی سایت با ساختار فنی مناسب برای SEO انجام می‌شود و خدمات SEO و بهینه‌سازی مستمر می‌تواند به‌صورت جداگانه ارائه شود.'],
  ['آیا بعد از تحویل سایت پشتیبانی دارید؟', 'بله. امکان ارائه خدمات پشتیبانی و نگهداری سایت بر اساس نیاز پروژه وجود دارد.'],
];

export default function WebDesignGorganPage() {
  return <div className="web-design-page wd-gorgan-page">
    <section className="container wd-hero" aria-labelledby="wd-title">
      <div className="wd-hero-copy">
        <h1 id="wd-title">طراحی سایت در گرگان</h1>
        <p>طراحی و توسعه سایت حرفه‌ای برای کسب‌وکارهای گرگان؛ سریع، سازگار با موبایل و آماده برای رشد، معرفی خدمات و جذب مشتری از فضای آنلاین.</p>
        <div className="wd-actions">
          <Contact className="primary" id="hero-contact" location="web-design-gorgan-hero" service="طراحی سایت در گرگان">درخواست مشاوره طراحی سایت</Contact>
          <a className="wd-text-link" href="/portfolio/">مشاهده نمونه‌کارها <Icon name="arrow" size={18}/></a>
        </div>
      </div>
      <WebDesignHeroArt/>
    </section>

    <section className="wd-trust" aria-labelledby="gorgan-intro-title" data-wd-reveal><div className="container wd-trust-inner"><div><h2 id="gorgan-intro-title">طراحی سایت برای کسب‌وکارهای گرگان</h2></div><p>یک سایت حرفه‌ای فقط یک ویترین آنلاین نیست؛ باید خدمات کسب‌وکار شما را به‌درستی معرفی کند، مسیر ارتباط با مشتری را ساده کند و زیرساخت مناسبی برای توسعه و بازاریابی آنلاین داشته باشد. ما سایت را متناسب با نوع فعالیت، مخاطبان و اهداف کسب‌وکار شما طراحی و توسعه می‌کنیم.</p></div></section>

    <section id="types" className="container wd-section wd-types" aria-labelledby="gorgan-types-title" data-wd-reveal><div className="wd-section-heading"><div><h2 id="gorgan-types-title">چه نوع سایت‌هایی طراحی می‌کنیم؟</h2></div></div><div className="wd-type-grid">{services.map(({title,icon},index)=><article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name={icon} size={21}/></span><span className="wd-index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span></div><h3>{title}</h3></article>)}</div></section>

    <section id="deliverables" className="wd-deliverables" aria-labelledby="gorgan-advantages-title"><div className="container wd-deliverables-layout" data-wd-reveal><div className="wd-deliverables-copy"><h2 id="gorgan-advantages-title">یک سایت حرفه‌ای چه ویژگی‌هایی دارد؟</h2></div><div className="wd-deliverables-list">{advantages.map(({title,icon},index)=><article className="wd-deliverable" key={title}><span className="wd-deliverable-icon"><Icon name={icon} size={20}/></span><span className="wd-deliverable-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><h3>{title}</h3></div></article>)}</div></div></section>

    <section id="process" className="container wd-section wd-process" aria-labelledby="gorgan-process-title" data-wd-reveal><div className="wd-process-heading"><h2 id="gorgan-process-title">مراحل طراحی سایت</h2></div><div className="wd-steps"><span className="wd-process-track" aria-hidden="true"><i className="wd-process-fill"/></span>{steps.map((title,index)=><article className="wd-step" key={title}><span className="wd-step-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><h3>{title}</h3></div></article>)}</div></section>

    <section className="container wd-section wd-reasons" aria-labelledby="gorgan-audience-title" data-wd-reveal><div className="wd-section-heading"><div><h2 id="gorgan-audience-title">طراحی سایت برای چه کسب‌وکارهایی مناسب است؟</h2></div><p>فرقی نمی‌کند یک کسب‌وکار خدماتی، فروشگاهی، شرکتی یا محلی داشته باشید؛ ساختار سایت باید بر اساس مدل کسب‌وکار و مسیر تصمیم‌گیری مشتری طراحی شود.</p></div><div className="wd-reason-grid">{audiences.map((title,index)=><article className="wd-reason" key={title}><span className="wd-reason-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><h3>{title}</h3></article>)}</div></section>

    <section className="wd-trust" aria-labelledby="gorgan-seo-title" data-wd-reveal><div className="container wd-trust-inner"><div><h2 id="gorgan-seo-title">طراحی سایت با زیرساخت مناسب برای SEO</h2></div><p>از ابتدا ساختار سایت را به شکلی پیاده می‌کنیم که زمینه مناسبی برای بهینه‌سازی موتورهای جستجو داشته باشد؛ از ساختار صفحات و محتوا گرفته تا عملکرد فنی و قابلیت اتصال به ابزارهای Google. دیده‌شدن در نتایج جستجو به عوامل مختلفی وابسته است و هیچ رتبه یا نتیجه مشخصی از قبل تضمین نمی‌شود.</p></div></section>

    <section className="container wd-section wd-types" aria-labelledby="gorgan-portfolio-title" data-wd-reveal><div className="wd-section-heading"><div><h2 id="gorgan-portfolio-title">نمونه طراحی سایت</h2></div><a className="wd-text-link" href="/portfolio/">مشاهده نمونه‌کارها <Icon name="arrow" size={18}/></a></div></section>

    <section id="faq" className="container wd-section wd-faq" aria-labelledby="gorgan-faq-title" data-wd-reveal><div className="wd-faq-heading"><h2 id="gorgan-faq-title">سوالات متداول</h2></div><div className="wd-faq-list">{faqs.map(([question,answer],index)=><details key={question}><summary><span className="wd-faq-index">{String(index+1).padStart(2,'0')}</span><span>{question}</span><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section id="contact" className="container contact-section wd-contact" data-wd-reveal aria-labelledby="gorgan-contact-title"><div className="closing-card"><div className="closing-orbit" aria-hidden="true"/><h2 id="gorgan-contact-title">برای کسب‌وکار شما چه نوع سایتی مناسب است؟</h2><p>اگر برای کسب‌وکارتان در گرگان به یک سایت حرفه‌ای نیاز دارید، اطلاعات کسب‌وکارتان را با ما در میان بگذارید تا بر اساس نیازها و اهداف پروژه، مسیر مناسب طراحی سایت را بررسی کنیم.</p><Contact className="primary" location="web-design-gorgan-final" service="طراحی سایت در گرگان">درخواست مشاوره</Contact></div></section>
  </div>;
}
