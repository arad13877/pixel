import { Contact } from './Contact';
import { Icon, type IconName } from './Icons';

const websiteTypes: { title: string; description: string; icon: IconName }[] = [
  { title: 'وب‌سایت شرکتی', description: 'برند، خدمات و راه‌های ارتباطی را حرفه‌ای معرفی کن تا مشتری با اطمینان بیشتری تو را انتخاب کند.', icon: 'globe' },
  { title: 'وب‌سایت خدماتی', description: 'خدماتت را روشن و منظم نمایش بده و مسیر بازدیدکننده را از آشنایی تا تماس کوتاه‌تر کن.', icon: 'layers' },
  { title: 'لندینگ تبلیغاتی', description: 'یک صفحه متمرکز برای کمپین، با پیام واضح و مسیر اقدام ساده برای تبدیل بهتر ورودی تبلیغات.', icon: 'sales' },
  { title: 'وب‌سایت محصول و SaaS', description: 'محصول، قابلیت‌ها و ارزش پیشنهادی را در تجربه‌ای مدرن، سریع و قابل توسعه ارائه کن.', icon: 'code' },
];

const deliverables: { title: string; description: string; icon: IconName }[] = [
  { title: 'طراحی اختصاصی UI/UX', description: 'ظاهر و ساختاری که بر اساس هویت، مخاطب و هدف کسب‌وکار تو شکل می‌گیرد.', icon: 'layers' },
  { title: 'نسخه کامل همه دستگاه‌ها', description: 'تجربه‌ای روان و خوانا در موبایل، تبلت و دسکتاپ.', icon: 'globe' },
  { title: 'توسعه سریع و قابل گسترش', description: 'ساختاری سبک و منظم که برای تغییرات و قدم‌های بعدی آماده است.', icon: 'code' },
  { title: 'ساختار فنی مناسب SEO', description: 'پایه‌های فنی و محتوایی منظم برای درک بهتر صفحات توسط موتورهای جستجو.', icon: 'search' },
  { title: 'مسیرهای واضح تماس', description: 'دکمه‌ها و مسیرهایی که بازدیدکننده را بدون سردرگمی به اقدام بعدی می‌رسانند.', icon: 'chat' },
  { title: 'کمک به ساختاربندی محتوا', description: 'اطلاعات کسب‌وکارت را می‌گیریم و برای نمایش روشن‌تر، منظمشان می‌کنیم.', icon: 'spark' },
  { title: 'نسخه آماده انتشار', description: 'سایتی بررسی‌شده که پس از تست نهایی برای راه‌اندازی واقعی آماده است.', icon: 'check' },
];

const reasons = [
  { number: '01', title: 'متناسب با هویت برند', description: 'از قالب تکراری شروع نمی‌کنیم؛ ساختار و ظاهر سایت بر اساس نیاز واقعی کسب‌وکار تو شکل می‌گیرد.' },
  { number: '02', title: 'یک مسیر روشن و قابل پیگیری', description: 'از شناخت تا انتشار، می‌دانی در هر مرحله چه تصمیمی می‌گیریم و خروجی بعدی چیست.' },
  { number: '03', title: 'موبایل و سرعت از ابتدا', description: 'نسخه موبایل و عملکرد فنی، بخشی از طراحی‌اند و به انتهای پروژه موکول نمی‌شوند.' },
  { number: '04', title: 'طراحی برای اقدام واقعی', description: 'هر بخش کمک می‌کند مخاطب خدماتت را بفهمد، اعتماد کند و راحت‌تر با تو ارتباط بگیرد.' },
];

const steps = [
  { number: '01', title: 'شناخت', description: 'درباره کسب‌وکار، مخاطب، خدمات و هدف سایت صحبت می‌کنیم.' },
  { number: '02', title: 'ساختار و محتوا', description: 'صفحات، اولویت پیام‌ها و مسیر حرکت کاربر را مشخص می‌کنیم.' },
  { number: '03', title: 'طراحی', description: 'تجربه کاربری و ظاهر سایت را متناسب با هویت برند شکل می‌دهیم.' },
  { number: '04', title: 'توسعه و تست', description: 'طرح را به سایت تبدیل می‌کنیم و نمایش، سرعت و جزئیات آن را می‌سنجیم.' },
  { number: '05', title: 'انتشار', description: 'پس از بررسی نهایی، سایت برای استفاده واقعی راه‌اندازی می‌شود.' },
];

const faqs = [
  ['هزینه طراحی سایت چطور مشخص می‌شود؟', 'هزینه به تعداد صفحات، امکانات، حجم محتوا و پیچیدگی طراحی بستگی دارد. در مشاوره اولیه رایگان نیاز پروژه را بررسی می‌کنیم و بعد پیشنهاد دقیق ارائه می‌دهیم.'],
  ['طراحی و انتشار سایت چقدر زمان می‌برد؟', 'زمان هر پروژه به دامنه کار، آماده‌بودن محتوا و بازخوردهای مراحل طراحی وابسته است. پس از شناخت پروژه، مسیر و زمان‌بندی پیشنهادی مشخص می‌شود.'],
  ['اگر متن و تصاویر آماده نداشته باشم چه می‌شود؟', 'اطلاعات اولیه کسب‌وکارت را از تو می‌گیریم و برای ساختاربندی بهتر محتوا راهنمایی‌ات می‌کنیم. محتوای نهایی قبل از انتشار با تو هماهنگ می‌شود.'],
  ['برای دامنه و هاست هم راهنمایی می‌کنید؟', 'بله. نیاز سایت را بررسی می‌کنیم و برای انتخاب و راه‌اندازی دامنه و هاست مناسب همراهت هستیم. هزینه سرویس‌های زیرساختی جداگانه و شفاف اعلام می‌شود.'],
  ['آیا سایت برای SEO آماده است؟', 'ساختار فنی، تیترها، سرعت و نمایش موبایل با اصول پایه SEO آماده می‌شوند. رتبه گرفتن به محتوا، رقابت بازار و فعالیت مستمر بعد از انتشار هم وابسته است و تضمین ساختگی ارائه نمی‌کنیم.'],
  ['اگر تجربه فنی نداشته باشم می‌توانم شروع کنم؟', 'بله. لازم نیست اصطلاحات طراحی و توسعه را بدانی؛ کافی است کسب‌وکارت و هدفت را توضیح بدهی تا مسیر مناسب را مرحله‌به‌مرحله با هم مشخص کنیم.'],
];

export default function WebDesignPage() {
  return <div className="web-design-page">
    <section className="container wd-hero" aria-labelledby="wd-title">
      <span className="wd-studio-mark" aria-hidden="true">PIXEL / 02</span>
      <div className="wd-hero-copy">
        <span className="wd-eyebrow"><span/> طراحی سایت از ایده تا انتشار</span>
        <h1 id="wd-title">طراحی سایت حرفه‌ای برای کسب‌وکاری که می‌خواهد <span>جدی‌تر دیده شود.</span></h1>
        <p>از شناخت کسب‌وکار و طراحی اختصاصی تا توسعه، نسخه موبایل و انتشار؛ سایتت را طوری می‌سازیم که اعتماد ایجاد کند و مسیر تماس مشتری با تو را ساده‌تر کند.</p>
        <div className="wd-actions">
          <Contact className="primary" id="hero-contact" location="web-design-hero" service="طراحی سایت و مشاوره اولیه رایگان">مشاوره رایگان طراحی سایت</Contact>
          <a className="wd-text-link" href="#deliverables">ببین چه تحویل می‌گیری <Icon name="arrow" size={18}/></a>
        </div>
        <span className="wd-channel"><Icon name="chat" size={15}/> گفتگو مستقیم با پیکسل در واتساپ</span>
      </div>
      <div className="wd-hero-art" role="img" aria-label="نمونه نمایشی طراحی پیکسل در قاب مرورگر و موبایل">
        <span className="wd-cobalt-shape" aria-hidden="true"/>
        <div className="wd-halo" aria-hidden="true"/>
        <div className="wd-art-browser" aria-hidden="true">
          <div className="wd-art-toolbar"><span className="wd-art-dots"><i/><i/><i/></span><span className="wd-art-address"><Icon name="globe" size={9}/> pixel-demo.example</span></div>
          <div className="wd-art-canvas">
            <div className="wd-art-nav"><strong>آرا<small>استودیو معماری</small></strong><span>پروژه‌ها&nbsp;&nbsp; خدمات&nbsp;&nbsp; تماس</span><Icon name="arrow" size={14}/></div>
            <div className="wd-art-heading"><small>معماری، به زبان زندگی</small><strong>فضایی برای زندگی،<br/><em>جایی برای آرامش.</em></strong></div>
            <div className="wd-art-image"><img src="/images/interior-900.webp" srcSet="/images/interior-600.webp 600w, /images/interior-900.webp 900w" sizes="(max-width: 760px) 88vw, 480px" alt="" width="900" height="600" fetchPriority="high"/></div>
          </div>
        </div>
        <div className="wd-art-phone" aria-hidden="true"><span className="wd-phone-notch"/><strong>آرا</strong><div className="wd-phone-copy"><i/><i/></div><div className="wd-phone-image"><img src="/images/interior-600.webp" alt="" width="600" height="400" loading="lazy"/></div><span className="wd-phone-button"/></div>
        <div className="wd-art-glass glass" aria-hidden="true"><span className="wd-glass-icon"><Icon name="check" size={17}/></span><span>آماده برای<br/><strong>هر اندازه.</strong></span></div>
        <span className="wd-demo-label">نمونه نمایشی طراحی پیکسل <Icon name="arrow" size={14}/></span>
      </div>
    </section>

    <section className="wd-trust" aria-labelledby="wd-trust-title" data-wd-reveal><div className="container wd-trust-inner"><div><span className="wd-section-index">01 / نقطه شروع</span><h2 id="wd-trust-title">سایت فقط ویترین نیست؛<br/><span>شروع اعتماد مشتری است.</span></h2></div><p>وقتی مشتری نام کسب‌وکارت را جستجو می‌کند، سایت باید سریع به سه سؤال جواب بدهد: چه کاری انجام می‌دهی، چرا می‌تواند به تو اعتماد کند و چطور باید با تو تماس بگیرد.</p><div className="wd-trust-points"><span><Icon name="check" size={16}/> معرفی روشن خدمات</span><span><Icon name="check" size={16}/> تصویر حرفه‌ای از برند</span><span><Icon name="check" size={16}/> دسترسی سریع به تماس</span></div></div></section>

    <section id="types" className="container wd-section wd-types" aria-labelledby="wd-types-title" data-wd-reveal><div className="wd-section-heading"><div><span className="wd-section-index">02 / متناسب با نیاز تو</span><h2 id="wd-types-title">چه نوع وب‌سایتی<br/><span>برای کسب‌وکارت مناسب است؟</span></h2></div><p>نوع سایت را از روی مد روز انتخاب نمی‌کنیم؛ هدف، مخاطب و مسیر واقعی مشتری مشخص می‌کند چه چیزی باید ساخته شود.</p></div><div className="wd-type-grid">{websiteTypes.map(({title,description,icon},index)=><article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name={icon} size={21}/></span><span className="wd-index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section id="deliverables" className="wd-deliverables" aria-labelledby="wd-deliverables-title"><div className="container wd-deliverables-layout" data-wd-reveal><div className="wd-deliverables-copy"><span className="wd-section-index">03 / خروجی روشن</span><h2 id="wd-deliverables-title">در پایان چه<br/><span>تحویل می‌گیری؟</span></h2><p>خروجی پروژه فقط چند صفحه زیبا نیست؛ یک ابزار کامل و آماده استفاده برای حضور حرفه‌ای کسب‌وکارت است.</p><Contact glass className="wd-deliverables-contact" location="web-design-deliverables" service="طراحی سایت و مشاوره اولیه رایگان">درباره پروژه‌ام صحبت کنیم</Contact></div><div className="wd-deliverables-list">{deliverables.map(({title,description,icon},index)=><article className="wd-deliverable" key={title}><span className="wd-deliverable-icon"><Icon name={icon} size={20}/></span><span className="wd-deliverable-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></div></section>

    <section className="container wd-section wd-reasons" aria-labelledby="wd-reasons-title" data-wd-reveal><div className="wd-section-heading"><div><span className="wd-section-index">04 / چرا پیکسل؟</span><h2 id="wd-reasons-title">تصمیم‌های دقیق،<br/><span>پیش از جزئیات زیبا.</span></h2></div><p>ظاهر حرفه‌ای زمانی ارزش دارد که بر پایه شناخت کسب‌وکار، تجربه روان و یک هدف روشن ساخته شده باشد.</p></div><div className="wd-reason-grid">{reasons.map(({title,description,number})=><article className="wd-reason" key={number}><span className="wd-reason-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section id="process" className="container wd-section wd-process" aria-labelledby="wd-process-title" data-wd-reveal><div className="wd-process-heading"><span className="wd-section-index">05 / مسیر همکاری</span><h2 id="wd-process-title">از «سایت ندارم»<br/><span>تا «این سایت کسب‌وکار من است».</span></h2><p>هر مرحله خروجی مشخص دارد؛ مسیر را شفاف پیش می‌بریم تا تصمیم‌ها قابل فهم و قابل پیگیری باشند.</p></div><div className="wd-steps"><span className="wd-process-track" aria-hidden="true"><i className="wd-process-fill"/></span>{steps.map(({number,title,description})=><article className="wd-step" key={number}><span className="wd-step-number" aria-hidden="true">{number}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>

    <section id="faq" className="container wd-section wd-faq" aria-labelledby="wd-faq-title" data-wd-reveal><div className="wd-faq-heading"><span className="wd-section-index">قبل از شروع</span><h2 id="wd-faq-title">سؤال‌هایی که مسیر<br/><span>شروع را روشن می‌کنند.</span></h2><p>اگر پاسخ سؤال تو اینجا نیست، در مشاوره اولیه رایگان مستقیم از ما بپرس.</p><Contact glass className="wd-faq-contact" location="web-design-faq" service="طراحی سایت و مشاوره اولیه رایگان">سؤالم را بپرسم</Contact></div><div className="wd-faq-list">{faqs.map(([question,answer],index)=><details key={question}><summary><span className="wd-faq-index">{String(index+1).padStart(2,'0')}</span><span>{question}</span><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section id="contact" className="container contact-section wd-contact" data-wd-reveal aria-labelledby="wd-contact-title"><div className="closing-card"><div className="closing-orbit" aria-hidden="true"/><span className="wd-closing-kicker"><span/> یک گفتگو، شروع یک حضور حرفه‌ای</span><h2 id="wd-contact-title">برای شروع سایت<br/><span>کسب‌وکارت آماده‌ای؟</span></h2><p>در یک مشاوره اولیه رایگان، نیاز پروژه را بررسی می‌کنیم و مسیر مناسب طراحی تا انتشار را به تو پیشنهاد می‌دهیم.</p><Contact className="primary" location="web-design-final" service="طراحی سایت و مشاوره اولیه رایگان">شروع مشاوره رایگان</Contact><span className="wd-closing-channel"><Icon name="chat" size={14}/> گفتگو در واتساپ پیکسل</span></div></section>
  </div>;
}
