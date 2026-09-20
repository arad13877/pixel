import { Contact } from './Contact';
import { Icon } from './Icons';

export default function PortfolioPage() {
  return <div className="portfolio-page">
    <section className="container portfolio-hero" aria-labelledby="portfolio-title">
      <div className="portfolio-intro">
        <span className="eyebrow"><span className="blue-dot"/> نمونه‌کارهای پیکسل</span>
        <h1 id="portfolio-title">جایی برای تجربه‌های <span>واقعی.</span></h1>
        <p>فعلاً نمونه‌کاری برای نمایش عمومی نداریم. وقتی پروژه‌ای منتشر شود، داستان طراحی و جزئیات آن را همین‌جا می‌بینی.</p>
        <div className="portfolio-actions">
          <Contact className="primary" location="portfolio-hero">درباره پروژه‌ام صحبت کنیم</Contact>
          <a className="text-link" href="/web-design/">خدمات طراحی سایت <Icon name="arrow" size={18}/></a>
        </div>
      </div>
      <div className="portfolio-stage" aria-labelledby="portfolio-empty-title">
        <span className="portfolio-stage-kicker" lang="en" dir="ltr">PIXEL / SELECTED WORK</span>
        <svg className="portfolio-stage-lines" viewBox="0 0 1100 430" preserveAspectRatio="none" aria-hidden="true" fill="none">
          <path d="M-80 335C195 360 307 120 570 129S915 346 1180 93"/>
          <path d="M-80 365C210 394 339 158 581 167S932 370 1180 135"/>
          <path d="M-80 395C228 425 365 199 592 207S947 395 1180 177"/>
        </svg>
        <div className="portfolio-stage-center">
          <span className="portfolio-stage-symbol" aria-hidden="true"><i/><i/><i/><i/></span>
          <h2 id="portfolio-empty-title">هنوز پروژه‌ای منتشر نشده است.</h2>
          <p>این فضا برای نمایش کارهای واقعی پیکسل است.</p>
        </div>
        <span className="portfolio-stage-foot" aria-hidden="true">۰۱ / —</span>
      </div>
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
