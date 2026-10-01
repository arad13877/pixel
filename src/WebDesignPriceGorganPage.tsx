import { Contact } from './Contact';
import { Icon } from './Icons';
import { PricingCards } from './PricingCards';
import { formatPlanPrice, pricingPlans } from './pricing';

const factors = [
  ['نوع سایت', 'از یک لندینگ متمرکز تا وب‌سایت خدماتی و فروشگاه، پلنی را ببین که به نیاز امروز کسب‌وکارت نزدیک‌تر است.'],
  ['تعداد صفحات', 'صفحه‌های اختصاصی بیشتر، طراحی و محتوای بیشتری نیاز دارند.'],
  ['امکانات سایت', 'فرم‌ها، فروشگاه، ابزارهای بیرونی و فرایندهای اختصاصی محدودهٔ توسعه را تغییر می‌دهند.'],
  ['نوع طراحی', 'طراحی متناسب با هویت برند'],
  ['سئو و ساختار فنی', 'ساختار فنی پایهٔ مناسب SEO در طراحی سایت لحاظ می‌شود.'],
  ['پشتیبانی و توسعه', 'پشتیبانی و نگهداری پس از راه‌اندازی بر اساس نیاز پروژه قابل ارائه است و محدوده و هزینهٔ آن جداگانه مشخص می‌شود.'],
];

const projectTypes = [
  { title: 'سایت شرکتی', description: pricingPlans[1].audience, features: pricingPlans[1].features.slice(0, 2), service: 'سایت شرکتی در گرگان', href: '/web-design-company-gorgan/' },
  { title: 'سایت خدماتی', description: pricingPlans[2].audience, features: pricingPlans[2].features.slice(0, 2), service: 'سایت خدماتی در گرگان' },
  { title: 'سایت پزشکی', description: 'ساختار سایت می‌تواند متناسب با تخصص و نوع فعالیت شما طراحی شود و بخش‌هایی مانند این موارد را شامل شود:', features: ['معرفی پزشک', 'نوبت‌دهی'], service: 'سایت پزشکی در گرگان', href: '/web-design-doctors-gorgan/' },
  { title: 'سایت فروشگاهی', description: pricingPlans[4].audience, features: pricingPlans[4].features.slice(0, 2), service: 'سایت فروشگاهی در گرگان' },
];

const quality = ['کیفیت اجرا', 'سرعت', 'تجربه کاربری', 'قابلیت توسعه', 'ساختار فنی', 'سئو', 'پشتیبانی'];
const budget = ['شروع با صفحات ضروری', 'حذف امکانات غیرضروری در فاز اول', 'اولویت‌بندی امکانات', 'طراحی معماری قابل توسعه'];
const quoteSteps = ['نوع کسب‌وکار', 'هدف سایت', 'تعداد صفحات', 'امکانات', 'نوع طراحی', 'نیازهای سئو', 'پشتیبانی و توسعه'];

const faqs = [
  ['قیمت طراحی سایت در گرگان چقدر است؟', 'هر عدد، قیمت شروع برای محدودهٔ پایهٔ همان پلن است. پس از بررسی تعداد صفحات، امکانات و محتوا، پیشنهاد دقیق ارائه می‌کنیم.'],
  ['آیا قبل از شروع پروژه قیمت مشخص می‌شود؟', 'پس از بررسی تعداد صفحات، امکانات و محتوا، پیشنهاد دقیق ارائه می‌کنیم.'],
  ['آیا امکان طراحی سایت متناسب با بودجه وجود دارد؟', 'در مشاوره اولیه، پلن مناسب و جزئیات پروژه را با هم مشخص می‌کنیم.'],
  ['هزینه سئو جدا از طراحی سایت است؟', 'ساختار فنی پایهٔ مناسب SEO در طراحی سایت لحاظ می‌شود. سئوی مستمر و تولید محتوا خدمات جداگانه‌اند و رتبه یا نتیجهٔ مشخصی تضمین نمی‌شود.'],
  ['هزینه پشتیبانی سایت جداگانه محاسبه می‌شود؟', 'پشتیبانی و نگهداری پس از راه‌اندازی بر اساس نیاز پروژه قابل ارائه است و محدوده و هزینهٔ آن جداگانه مشخص می‌شود.'],
  ['برای اعلام قیمت چه اطلاعاتی باید ارائه کنم؟', 'پس از بررسی تعداد صفحات، امکانات و محتوا، پیشنهاد دقیق ارائه می‌کنیم.'],
];

export default function WebDesignPriceGorganPage() {
  return <div className="pricing-page web-design-page pricing-gorgan-page">
    <section className="pricing-hero container" aria-labelledby="price-gorgan-title">
      <div><span className="pricing-eyebrow"><span className="blue-dot"/> طراحی سایت، با محدودهٔ روشن</span><h1 id="price-gorgan-title">قیمت طراحی سایت<br/><span>در گرگان</span></h1><p>قیمت طراحی سایت یک عدد ثابت نیست و بر اساس نیاز پروژه تعیین می‌شود. قیمت نهایی بعد از شناخت پروژه مشخص می‌شود.</p><div className="wd-actions pricing-gorgan-actions"><Contact className="primary" id="hero-contact" location="price-gorgan-hero" service="برآورد قیمت طراحی سایت در گرگان">دریافت برآورد قیمت طراحی سایت</Contact><a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a></div></div>
      <aside className="pricing-hero-note"><span>قیمت پایه</span><strong>شروع از <bdi>{formatPlanPrice(pricingPlans[0])}</bdi></strong><p>دامنهٔ هر پلن مشخص است؛ امکانات خارج از آن پیش از شروع پروژه برآورد می‌شوند.</p></aside>
    </section>

    <section className="pricing-factors" aria-labelledby="price-gorgan-factors-title"><div className="container pricing-factors-inner"><div><h2 id="price-gorgan-factors-title">چه عواملی روی قیمت طراحی سایت تأثیر می‌گذارند؟</h2><p>دو کسب‌وکار ممکن است یک نوع سایت بخواهند، اما تعداد صفحات، محتوا و امکانات موردنیازشان یکسان نباشد.</p></div><ol>{factors.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></div></section>

    <section id="types" className="container wd-section wd-types" aria-labelledby="price-gorgan-types-title"><div className="wd-section-heading"><div><h2 id="price-gorgan-types-title">قیمت طراحی سایت بر اساس نوع پروژه</h2></div><p>تمام قیمت‌ها به تومان و برای محدودهٔ پایه هستند. در مشاوره اولیه، پلن مناسب و جزئیات پروژه را با هم مشخص می‌کنیم.<br/><a className="wd-text-link" href="/web-design-gorgan/">طراحی سایت در گرگان <Icon name="arrow" size={18}/></a></p></div><div className="wd-type-grid">{projectTypes.map(({ title, description, features, service, href }, index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name="layers" size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3><p>{description}</p><ul>{features.map(feature => <li key={feature}>{feature}</li>)}</ul><Contact location={`price-gorgan-type-${index + 1}`} service={service}>دریافت قیمت</Contact>{href && <a className="wd-text-link" href={href}>{title} <Icon name="arrow" size={18}/></a>}</article>)}</div></section>

    <section id="plans" className="pricing-plans container" aria-labelledby="price-gorgan-plans-title"><div className="pricing-section-heading"><div><span className="pricing-kicker">پلن‌های طراحی سایت</span><h2 id="price-gorgan-plans-title">تعرفه طراحی سایت گرگان</h2></div><p>تمام قیمت‌ها به تومان و برای محدودهٔ پایه هستند. در مشاوره اولیه، پلن مناسب و جزئیات پروژه را با هم مشخص می‌کنیم.</p></div><PricingCards location="price-gorgan-plans"/><div className="pricing-terms"><h3>در قیمت پایه چه چیزهایی جداست؟</h3><p>هزینهٔ دامنه، هاست و سرویس‌های پولی، تولید محتوای کامل، سئوی مستمر و نگهداری پس از راه‌اندازی در قیمت‌های بالا نیستند. اگر به آن‌ها نیاز داشته باشی، محدوده و هزینه‌شان جداگانه اعلام می‌شود. ساختار فنی پایهٔ مناسب SEO در طراحی سایت لحاظ می‌شود؛ رتبه یا نتیجهٔ جستجو تضمین نمی‌شود.</p></div></section>

    <section className="container wd-section wd-types" aria-labelledby="price-gorgan-quality-title"><div className="wd-section-heading"><div><h2 id="price-gorgan-quality-title">آیا طراحی سایت ارزان‌تر همیشه انتخاب مناسبی است؟</h2></div></div><div className="wd-type-grid">{quality.map((title, index) => <article className="wd-type" key={title}><div className="wd-type-head"><span className="wd-icon"><Icon name="check" size={21}/></span><span className="wd-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div><h3>{title}</h3></article>)}</div></section>

    <section className="container wd-section wd-reasons" aria-labelledby="price-gorgan-budget-title"><div className="wd-section-heading"><div><h2 id="price-gorgan-budget-title">برای کاهش هزینه طراحی سایت چه کارهایی می‌توان انجام داد؟</h2></div></div><div className="wd-reason-grid">{budget.map((title, index) => <article className="wd-reason" key={title}><span className="wd-reason-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3></article>)}</div></section>

    <section id="process" className="container wd-section wd-process" aria-labelledby="price-gorgan-process-title"><div className="wd-process-heading"><h2 id="price-gorgan-process-title">قبل از اعلام قیمت چه چیزهایی بررسی می‌شود؟</h2></div><div className="wd-steps"><span className="wd-process-track" aria-hidden="true"><i className="wd-process-fill"/></span>{quoteSteps.map((title, index) => <article className="wd-step" key={title}><span className="wd-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3></div></article>)}</div></section>

    <section id="faq" className="pricing-faq container" aria-labelledby="price-gorgan-faq-title"><div><h2 id="price-gorgan-faq-title">سوالات متداول</h2></div><div className="pricing-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section id="contact" className="pricing-contact container" aria-labelledby="price-gorgan-contact-title"><div><h2 id="price-gorgan-contact-title">قیمت دقیق پروژه خود را دریافت کنید</h2><p>نیاز پروژه‌ات را بگو تا محدودهٔ کار و هزینهٔ دقیق را با هم بررسی کنیم.</p><div className="wd-actions"><Contact className="primary" location="price-gorgan-final" service="برآورد قیمت طراحی سایت در گرگان">دریافت برآورد قیمت طراحی سایت</Contact><a className="wd-text-link" href="tel:+989937825753">تماس با ما <Icon name="arrow" size={18}/></a></div></div></section>
  </div>;
}
