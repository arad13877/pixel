import FeaturedPortfolio from './FeaturedPortfolio';
import { Contact } from './Contact';
import { Icon } from './Icons';
import { PricingCards } from './PricingCards';

const factors = [
  ['تعداد و نوع صفحات', 'صفحه‌های اختصاصی بیشتر، طراحی و محتوای بیشتری نیاز دارند.'],
  ['امکانات و اتصال‌ها', 'فرم‌ها، فروشگاه، ابزارهای بیرونی و فرایندهای اختصاصی محدودهٔ توسعه را تغییر می‌دهند.'],
  ['آماده‌بودن محتوا', 'متن، تصویر و اطلاعاتی که برای شروع آماده‌اند، بر حجم کار پروژه اثر می‌گذارند.'],
  ['زیرساخت و نگهداری', 'دامنه، هاست، سرویس‌های پولی و پشتیبانی پس از انتشار جداگانه بررسی می‌شوند.'],
];

const questions = [
  ['آیا عددهای پلن‌ها قیمت نهایی هستند؟', 'خیر. هر عدد، قیمت شروع برای محدودهٔ پایهٔ همان پلن است. پس از بررسی تعداد صفحات، امکانات و محتوا، پیشنهاد دقیق ارائه می‌کنیم.'],
  ['اگر متن و تصاویر آماده نباشند چه می‌شود؟', 'برای ساختاربندی محتوا راهنمایی‌ات می‌کنیم. تولید محتوای کامل یا آماده‌سازی گستردهٔ تصاویر، در صورت نیاز جداگانه برآورد می‌شود.'],
  ['دامنه و هاست در قیمت‌ها هستند؟', 'خیر. برای انتخاب و راه‌اندازی زیرساخت مناسب راهنمایی می‌کنیم، اما هزینهٔ دامنه، هاست و سرویس‌های پولی جداگانه اعلام می‌شود.'],
  ['پس از انتشار پشتیبانی هم ارائه می‌شود؟', 'پشتیبانی و نگهداری پس از راه‌اندازی بر اساس نیاز پروژه قابل ارائه است و محدوده و هزینهٔ آن جداگانه مشخص می‌شود.'],
  ['آیا این پلن‌ها شامل SEO می‌شوند؟', 'ساختار فنی پایهٔ مناسب SEO در طراحی سایت لحاظ می‌شود. سئوی مستمر و تولید محتوا خدمات جداگانه‌اند و رتبه یا نتیجهٔ مشخصی تضمین نمی‌شود.'],
];

export default function PricingPage() {
  return <div className="pricing-page">
    <section className="pricing-hero container" aria-labelledby="pricing-title">
      <div><span className="pricing-eyebrow"><span className="blue-dot"/> طراحی سایت، با محدودهٔ روشن</span><h1 id="pricing-title">تعرفه طراحی سایت<br/><span>پیکسل</span></h1><p>از یک لندینگ متمرکز تا وب‌سایت خدماتی و فروشگاه، پلنی را ببین که به نیاز امروز کسب‌وکارت نزدیک‌تر است. قیمت نهایی بعد از شناخت پروژه مشخص می‌شود.</p><a className="pricing-hero-link" href="#plans">پلن‌ها را ببین <Icon name="arrow" size={18}/></a></div>
      <aside className="pricing-hero-note"><span>قیمت پایه</span><strong>شروع از <bdi>۱۰ میلیون تومان</bdi></strong><p>دامنهٔ هر پلن مشخص است؛ امکانات خارج از آن پیش از شروع پروژه برآورد می‌شوند.</p></aside>
    </section>

    <section id="plans" className="pricing-plans container" aria-labelledby="pricing-plans-title"><div className="pricing-section-heading"><div><span className="pricing-kicker">پلن‌های طراحی سایت</span><h2 id="pricing-plans-title">برای هر مرحله،<br/><span>یک نقطهٔ شروع.</span></h2></div><p>تمام قیمت‌ها به تومان و برای محدودهٔ پایه هستند. در مشاوره اولیه، پلن مناسب و جزئیات پروژه را با هم مشخص می‌کنیم.</p></div><PricingCards location="pricing-page"/><div className="pricing-terms"><h3>در قیمت پایه چه چیزهایی جداست؟</h3><p>هزینهٔ دامنه، هاست و سرویس‌های پولی، تولید محتوای کامل، سئوی مستمر و نگهداری پس از راه‌اندازی در قیمت‌های بالا نیستند. اگر به آن‌ها نیاز داشته باشی، محدوده و هزینه‌شان جداگانه اعلام می‌شود. ساختار فنی پایهٔ مناسب SEO در طراحی سایت لحاظ می‌شود؛ رتبه یا نتیجهٔ جستجو تضمین نمی‌شود.</p><a className="pricing-hero-link" href="/seo/">خدمات و تعرفه‌های سئو <Icon name="arrow" size={16}/></a></div></section>

    <section className="pricing-factors" aria-labelledby="pricing-factors-title"><div className="container pricing-factors-inner"><div><span className="pricing-kicker">پیش از برآورد نهایی</span><h2 id="pricing-factors-title">چه چیزی قیمت را<br/><span>تغییر می‌دهد؟</span></h2><p>دو کسب‌وکار ممکن است یک نوع سایت بخواهند، اما تعداد صفحات، محتوا و امکانات موردنیازشان یکسان نباشد.</p></div><ol>{factors.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></div></section>

    <section className="pricing-plans container" aria-labelledby="pricing-guides-title"><div className="pricing-terms"><h2 id="pricing-guides-title">برای انتخاب پلن، محدوده پروژه را روشن کنید</h2><p>اگر تعداد صفحات یا امکانات موردنیاز هنوز مشخص نیست، <a href="/articles/website-design-cost-guide/">راهنمای هزینه طراحی سایت</a> را بخوانید. برای کسب‌وکاری با مشتریان محلی، <a href="/web-design-price-gorgan/">راهنمای برآورد قیمت طراحی سایت در گرگان</a> اطلاعات لازم و تفاوت سناریوهای خدماتی، پزشکی و فروشگاهی را توضیح می‌دهد.</p></div></section>

    <FeaturedPortfolio/>
    <section className="pricing-faq container" aria-labelledby="pricing-faq-title"><div><span className="pricing-kicker">قبل از شروع</span><h2 id="pricing-faq-title">سؤال‌های رایج<br/><span>درباره تعرفه‌ها</span></h2></div><div className="pricing-faq-list">{questions.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section id="contact" className="pricing-contact container" aria-labelledby="pricing-contact-title"><div><span className="pricing-kicker">قدم بعدی</span><h2 id="pricing-contact-title">کدام پلن برای<br/><span>کسب‌وکار تو مناسب است؟</span></h2><p>نیاز پروژه‌ات را بگو تا محدودهٔ کار و هزینهٔ دقیق را با هم بررسی کنیم.</p><Contact className="primary" location="pricing-final" service="تعرفه طراحی سایت">درباره پروژه‌ام صحبت کنیم</Contact></div></section>
  </div>;
}
