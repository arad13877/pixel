import FeaturedPortfolio from './FeaturedPortfolio';
import { Contact } from './Contact';
import { Icon } from './Icons';
import { formatPlanPrice, pricingPlans } from './pricing';

const factors = [
  ['هدف و مسیر مشتری', 'معرفی خدمات و دریافت تماس با فروش آنلاین، پرداخت و مدیریت سفارش محدوده یکسانی ندارد. ابتدا اقدام اصلی مشتری را مشخص کنید.'],
  ['تعداد صفحه‌های اختصاصی', 'یک صفحه معرفی با صفحه جدا برای هر خدمت یا شعبه متفاوت است. فهرست صفحه‌ها و محتوای موردنیاز، پایه مقایسه پیشنهادهاست.'],
  ['اتصال به ابزارهای موجود', 'لینک به سامانه نوبت‌دهی یا سفارش موجود با ساخت سامانه اختصاصی فرق دارد. نام ابزار و امکانات اتصال آن باید پیش از برآورد بررسی شود.'],
  ['آمادگی متن و تصویر', 'لوگو، متن خدمات، تصاویر مجاز و اطلاعات تماس آماده، محدوده تولید محتوا را روشن می‌کنند. عکاسی یا نگارش جدید باید جداگانه مشخص شود.'],
  ['جستجوی محلی', 'صفحه خدمات، اطلاعات واقعی محل فعالیت و مسیر تماس می‌توانند در نسخه اول باشند؛ برنامه مستمر سئو و تولید محتوا برآورد جدا دارد.'],
  ['نگهداری پس از انتشار', 'تعداد تغییرات محتوا، توسعه قابلیت‌ها و مسئولیت سرویس‌های بیرونی را مشخص کنید تا هزینه اولیه با هزینه ادامه کار اشتباه نشود.'],
];

const projectTypes = [
  { title: 'سایت شرکتی', description: 'برای شرکتی در گرگان که از مشتریان درخواست همکاری می‌گیرد، تعداد خدمات و پروژه‌های قابل انتشار را روشن کنید.', features: ['معرفی شرکت و خدمات اصلی در فاز اول', 'کاتالوگ محصولات یا بخش پروژه‌ها با محدوده جدا'], service: 'سایت شرکتی در گرگان', href: '/web-design-company-gorgan/' },
  { title: 'سایت خدماتی', description: 'اگر هدف تماس مشتریان محلی است، اطلاعات محدوده خدمت‌رسانی و مسیر دریافت درخواست از امکانات کم‌کاربرد مهم‌تر است.', features: ['صفحه خدمات و راه‌های تماس', 'فرم اختصاصی یا اتصال به ابزار مدیریت با بررسی جدا'], service: 'سایت خدماتی در گرگان' },
  { title: 'سایت پزشکی', description: 'معرفی مطب و نمایش راه دریافت نوبت، با مدیریت پرونده یا ساخت سامانه نوبت‌دهی یک پروژه واحد نیست.', features: ['تخصص، ساعات کار و اطلاعات تأییدشده مطب', 'بررسی اتصال به سامانه نوبت‌دهی موجود'], service: 'سایت پزشکی در گرگان', href: '/web-design-doctors-gorgan/' },
  { title: 'سایت فروشگاهی', description: 'تعداد محصولات، شیوه ارسال در گرگان و سایر شهرها و مدیریت سفارش روی محدوده فروشگاه اثر می‌گذارند.', features: ['تعیین تعداد و تنوع محصولات اولیه', 'مشخص کردن پرداخت، ارسال و مسئول ورود اطلاعات'], service: 'سایت فروشگاهی در گرگان' },
];

const quality = [['محدوده یکسان', 'تعداد صفحات، نوع فرم و امکانات مدیریت در هر دو پیشنهاد یکسان باشد.'], ['مالکیت و دسترسی', 'مسئول نگهداری دامنه، هاست و دسترسی‌های پروژه روشن باشد.'], ['هزینه‌های ادامه کار', 'تمدید سرویس‌ها، تغییر محتوا و توسعه بعدی در مقایسه لحاظ شود.'], ['تحویل قابل بررسی', 'نمایش موبایل، کارکرد فرم‌ها و مسیر تماس پیش از انتشار بررسی شود.']];
const budget = [['نسخه اول کاربردی', 'معرفی کسب‌وکار، خدمات اصلی و تماس را ابتدا کامل کنید.'], ['امکانات بر اساس نیاز', 'قابلیتی را اضافه کنید که مشتری یا تیم شما واقعاً استفاده می‌کند.'], ['آماده‌سازی محتوا', 'متن و تصاویر تأییدشده را یکجا فراهم کنید تا محدوده تولید محتوا مشخص باشد.'], ['توسعه مرحله‌ای', 'امکانات آینده را از فاز اول جدا و وابستگی‌های آن‌ها را از ابتدا بررسی کنید.']];
const quoteSteps = [['نوع کسب‌وکار', 'حوزه فعالیت و مشتری هدف در گرگان یا سایر شهرها.'], ['هدف سایت', 'تماس، درخواست همکاری، نوبت یا فروش محصول.'], ['تعداد صفحات', 'فهرست صفحات ضروری و خدمات یا شعب مستقل.'], ['امکانات', 'فرم‌ها، پرداخت، سفارش و نام ابزارهای بیرونی.'], ['محتوای آماده', 'لوگو، متن، تصویر و مسئول تأیید اطلاعات.'], ['نیازهای سئو', 'زیرساخت اولیه یا برنامه جدا برای رشد جستجو.'], ['پشتیبانی و توسعه', 'نوع تغییرات بعد از تحویل و امکانات فاز بعد.']];

const faqs = [
  ['قیمت طراحی سایت در گرگان چقدر است؟', 'هر عدد، قیمت شروع برای محدودهٔ پایهٔ همان پلن است. پس از بررسی تعداد صفحات، امکانات و محتوا، پیشنهاد دقیق ارائه می‌کنیم.'],
  ['آیا قبل از شروع پروژه قیمت مشخص می‌شود؟', 'برآورد باید به فهرست صفحات و امکانات مشخص وابسته باشد. اگر پس از آن درخواست جدیدی اضافه شود، تأثیرش بر هزینه و زمان جداگانه بررسی می‌شود.'],
  ['آیا امکان طراحی سایت متناسب با بودجه وجود دارد؟', 'در مشاوره اولیه، پلن مناسب و جزئیات پروژه را با هم مشخص می‌کنیم.'],
  ['هزینه سئو جدا از طراحی سایت است؟', 'ساختار فنی پایهٔ مناسب SEO در طراحی سایت لحاظ می‌شود. سئوی مستمر و تولید محتوا خدمات جداگانه‌اند و رتبه یا نتیجهٔ مشخصی تضمین نمی‌شود.'],
  ['هزینه پشتیبانی سایت جداگانه محاسبه می‌شود؟', 'پشتیبانی و نگهداری پس از راه‌اندازی بر اساس نیاز پروژه قابل ارائه است و محدوده و هزینهٔ آن جداگانه مشخص می‌شود.'],
  ['برای اعلام قیمت چه اطلاعاتی باید ارائه کنم؟', 'حوزه فعالیت، هدف سایت، صفحات لازم، محتوای آماده، ابزارهای مورد استفاده و بودجه تقریبی را آماده کنید. اگر سایت دارید، آدرس آن و مشکلات فعلی را هم بفرستید؛ نیازی به ارسال رمز در درخواست اولیه نیست.'],
];

export default function WebDesignPriceGorganPage() {
  return <div className="pricing-page web-design-page pricing-gorgan-page">
    <section className="pricing-hero container" aria-labelledby="price-gorgan-title">
      <div><span className="pricing-eyebrow"><span className="blue-dot"/> طراحی سایت، با محدودهٔ روشن</span><h1 id="price-gorgan-title">قیمت طراحی سایت<br/><span>در گرگان</span></h1><p>برای کسب‌وکارتان در گرگان، هزینه را بر اساس مسیر مشتری، صفحات ضروری و امکانات واقعی برآورد کنید. این راهنما کمک می‌کند اطلاعات لازم برای دریافت پیشنهاد را آماده و هزینه راه‌اندازی را از نگهداری و توسعه جدا کنید.</p><div className="wd-actions pricing-gorgan-actions"><Contact className="primary" id="hero-contact" location="price-gorgan-hero" service="برآورد قیمت طراحی سایت در گرگان">دریافت برآورد قیمت طراحی سایت</Contact><a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a></div></div>
      <aside className="pricing-hero-note"><span>قیمت پایه</span><strong>شروع از <bdi>{formatPlanPrice(pricingPlans[0])}</bdi></strong><p>دامنهٔ هر پلن مشخص است؛ امکانات خارج از آن پیش از شروع پروژه برآورد می‌شوند.</p></aside>
    </section>

    <section className="pricing-factors" aria-labelledby="price-gorgan-factors-title"><div className="container pricing-factors-inner"><div><h2 id="price-gorgan-factors-title">چه عواملی روی قیمت طراحی سایت تأثیر می‌گذارند؟</h2><p>دو کسب‌وکار ممکن است یک نوع سایت بخواهند، اما تعداد صفحات، محتوا و امکانات موردنیازشان یکسان نباشد.</p></div><ol>{factors.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></div></section>

    <section id="types" className="container wd-section wd-types" aria-labelledby="price-gorgan-types-title"><div className="wd-section-heading"><div><h2 id="price-gorgan-types-title">قیمت طراحی سایت بر اساس نوع پروژه</h2></div><p>این سناریوها نمونه نیاز هستند، نه قیمت یا پروژه انجام‌شده. برای هر نوع کسب‌وکار، محدوده نسخه اول و امکانات جدا را مشخص کنید.<br/><a className="wd-text-link" href="/web-design-gorgan/">طراحی سایت در گرگان <Icon name="arrow" size={18}/></a></p></div><div className="wd-type-grid">{projectTypes.map(({ title, description, features, service, href }, index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name="layers" size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3><p>{description}</p><ul>{features.map(feature => <li key={feature}>{feature}</li>)}</ul><Contact location={`price-gorgan-type-${index + 1}`} service={service}>دریافت قیمت</Contact>{href && <a className="wd-text-link" href={href}>{title} <Icon name="arrow" size={18}/></a>}</article>)}</div></section>

    <section id="plans" className="pricing-plans container" aria-labelledby="price-gorgan-plans-title"><div className="pricing-section-heading"><div><span className="pricing-kicker">مبنای مقایسه</span><h2 id="price-gorgan-plans-title">از قیمت پایه تا برآورد پروژه</h2></div><p>قیمت شروع لندینگ پیکسل {formatPlanPrice(pricingPlans[0])} است؛ این عدد قیمت ثابت هر سایت در گرگان نیست. امکانات، محتوا و اتصال‌های پروژه باید جدا بررسی شوند.</p></div><div className="pricing-terms"><h3>پیشنهادها را با یک فهرست نیاز مقایسه کنید</h3><p>در صفحه تعرفه‌ها می‌توانید محدوده و قیمت پایه هر پلن را ببینید. این صفحه برای آماده کردن اطلاعات پروژه و شناخت تفاوت هزینه‌هاست. دامنه، هاست، سرویس‌های پولی، تولید محتوای کامل، سئوی مستمر و نگهداری پس از انتشار باید در برآورد جدا مشخص شوند.</p><a className="wd-text-link" href="/pricing/">مقایسه پلن‌ها و تعرفه‌های پایه <Icon name="arrow" size={18}/></a><br/><a className="wd-text-link" href="/articles/website-design-cost-guide/">راهنمای عوامل هزینه طراحی سایت <Icon name="arrow" size={18}/></a></div></section>

    <section className="container wd-section wd-types" aria-labelledby="price-gorgan-quality-title"><div className="wd-section-heading"><div><h2 id="price-gorgan-quality-title">آیا طراحی سایت ارزان‌تر همیشه انتخاب مناسبی است؟</h2></div></div><div className="wd-type-grid">{quality.map(([title, description], index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name="check" size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section className="container wd-section wd-reasons" aria-labelledby="price-gorgan-budget-title"><div className="wd-section-heading"><div><h2 id="price-gorgan-budget-title">برای کاهش هزینه طراحی سایت چه کارهایی می‌توان انجام داد؟</h2></div></div><div className="wd-reason-grid">{budget.map(([title, description], index) => <article className="wd-reason" key={title}><span className="wd-reason-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section id="process" className="container wd-section wd-process" aria-labelledby="price-gorgan-process-title"><div className="wd-process-heading"><h2 id="price-gorgan-process-title">قبل از اعلام قیمت چه چیزهایی بررسی می‌شود؟</h2></div><div className="wd-steps"><span className="wd-process-track" aria-hidden="true"><i className="wd-process-fill"/></span>{quoteSteps.map(([title, description], index) => <article className="wd-step" key={title}><span className="wd-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>

    <FeaturedPortfolio/>
    <section id="faq" className="pricing-faq container" aria-labelledby="price-gorgan-faq-title"><div><h2 id="price-gorgan-faq-title">سوالات متداول</h2></div><div className="pricing-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section id="contact" className="pricing-contact container" aria-labelledby="price-gorgan-contact-title"><div><h2 id="price-gorgan-contact-title">قیمت دقیق پروژه خود را دریافت کنید</h2><p>نیاز پروژه‌ات را بگو تا محدودهٔ کار و هزینهٔ دقیق را با هم بررسی کنیم.</p><div className="wd-actions"><Contact className="primary" location="price-gorgan-final" service="برآورد قیمت طراحی سایت در گرگان">دریافت برآورد قیمت طراحی سایت</Contact><a className="wd-text-link seo-request-link" href="/request/">ثبت درخواست پروژه <Icon name="arrow" size={16}/></a><a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a></div></div></section>
  </div>;
}
