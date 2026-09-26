import { Icon } from './Icons';

export default function WebDesignHeroArt() {
  return <div className="wd-hero-art" role="img" aria-label="نمونه نمایشی طراحی پیکسل در قاب مرورگر و موبایل">
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
  </div>;
}
