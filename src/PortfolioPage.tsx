import { Contact } from './Contact';
import { Icon } from './Icons';
import PortfolioCard from './PortfolioCard';
import { portfolioItems } from './portfolio.generated';

export default function PortfolioPage() {
  return <div className="portfolio-page">
    <section className="container portfolio-hero" aria-labelledby="portfolio-title">
      <div className="portfolio-intro">
        <span className="eyebrow"><span className="blue-dot"/> نمونه‌کارهای پیکسل</span>
        <h1 id="portfolio-title">ایده‌هایی که به <span>تجربه</span> تبدیل می‌شوند.</h1>
        <p>پروژه‌های منتشرشده و کانسپت‌های نمایشی پیکسل را اینجا ببین. هر کدام با تمرکز بر مسیر استفاده از سایت طراحی شده‌اند.</p>
        <div className="portfolio-actions">
          <Contact className="primary" location="portfolio-hero">درباره پروژه‌ام صحبت کنیم</Contact>
          <a className="text-link" href="/web-design/">خدمات طراحی سایت <Icon name="arrow" size={18}/></a>
        </div>
      </div>
      {portfolioItems.map((item, index) => <PortfolioCard key={item.id} item={item} index={index}/>)}
    </section>

    <section id="contact" className="container contact-section portfolio-contact" aria-labelledby="portfolio-contact-title">
      <div className="closing-card">
        <div className="closing-orbit" aria-hidden="true"/>
        <span className="eyebrow"><span className="blue-dot"/> یک ایده، یک شروع تازه</span>
        <h2 id="portfolio-contact-title">درباره پروژهٔ تو <span>صحبت کنیم.</span></h2>
        <p>اگر برای کسب‌وکارت به یک سایت حرفه‌ای نیاز داری، از ایده و نیازت برایمان بگو.</p>
        <Contact className="primary" location="portfolio-final">شروع گفتگو</Contact>
      </div>
    </section>
  </div>;
}
