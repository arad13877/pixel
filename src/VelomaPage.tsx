const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M8 5h11v11' : 'M19 12H5m7-7-7 7 7 7'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const looks = [
  { number: '01', title: 'خطوط آزاد', category: 'فرم و حرکت', image: '/images/veloma/hero.jpg', alt: 'مدل نمایشی با کت تیره و شلوار گشاد در استودیوی روشن' },
  { number: '02', title: 'کنتراست آرام', category: 'بافت و رنگ', image: '/images/veloma/red-look.jpg', alt: 'مدل نمایشی با بارانی کرم در فضای استودیویی قرمز' },
  { number: '03', title: 'سادگی جسور', category: 'لایه‌های روزمره', image: '/images/veloma/studio-look.jpg', alt: 'مدل نمایشی با پالتوی تیره و پلیور روشن در استودیو' },
];

export default function VelomaPage() {
  return <div className="veloma-page" dir="rtl">
    <a className="vl-skip" href="#main">رفتن به محتوای اصلی</a>
    <div className="vl-demo"><span>کانسپت نمایشی پیکسل؛ برند واقعی نیست</span><a href="/portfolio/">بازگشت به نمونه‌کارها <Arrow diagonal /></a></div>
    <header className="vl-header vl-shell">
      <a className="vl-logo" href="#top" aria-label="ولومای نمایشی، ابتدای صفحه" lang="en" dir="ltr">VELOMA</a>
      <nav className="vl-nav" aria-label="ناوبری صفحه"><a href="#collection">کالکشن</a><a href="#story">درباره کانسپت</a><a href="#editorial">ادیتوریال</a></nav>
      <a className="vl-header-link" href="#collection">کاوش استایل‌ها <Arrow diagonal /></a>
    </header>

    <main id="main">
      <section className="vl-hero" id="top" aria-labelledby="veloma-title">
        <div className="vl-hero-copy"><span className="vl-overline">یک نگاه تازه به پوشیدن / کانسپت فشن</span><h1 id="veloma-title">برای آن‌هایی که<br /><em>شبیه خودشان</em><br />لباس می‌پوشند.</h1><p>وِلوما، تمرینی در طراحی یک تجربهٔ دیجیتال برای فشن معاصر است؛ جایی که فرم، بافت و جسارت در کنار هم دیده می‌شوند.</p><a className="vl-button vl-button-light" href="#collection">کشف کالکشن نمایشی <Arrow diagonal /></a><span className="vl-hero-foot">فشن کانسپت / طراحی و اجرا توسط پیکسل</span></div>
        <div className="vl-hero-photo"><img src="/images/veloma/hero.jpg" alt="مدل نمایشی با کت تیره، پیراهن روشن و شلوار گشاد در استودیوی مینیمال" width="1122" height="1402" fetchPriority="high" /><span className="vl-photo-index" lang="en" dir="ltr">THE NEW FORM / 01</span><span className="vl-photo-stamp" aria-hidden="true">V.</span></div>
        <div className="vl-hero-bottom" aria-hidden="true"><span lang="en" dir="ltr">VOL. 01 — A STUDY IN STYLE</span><span>به پایین بروید ↓</span></div>
      </section>

      <div className="vl-ticker" aria-hidden="true"><div lang="en" dir="ltr">FORM &nbsp;—&nbsp; FREEDOM &nbsp;—&nbsp; FEELING &nbsp;—&nbsp; VELOMA &nbsp;—&nbsp; FORM &nbsp;—&nbsp; FREEDOM &nbsp;—&nbsp; FEELING &nbsp;—&nbsp; VELOMA</div></div>

      <section className="vl-collection vl-shell" id="collection" aria-labelledby="vl-collection-title"><div className="vl-section-heading"><div><span className="vl-overline">01 / مجموعهٔ پیشنهادی</span><h2 id="vl-collection-title">یک کالکشن،<br /><em>چند جور نگاه.</em></h2></div><p>این تصاویر و استایل‌ها بخشی از کانسپت نمایشی‌اند. انتخاب‌های تصویری، مسیر مرور یک مجموعهٔ فشن را نشان می‌دهند و محصولی برای فروش در این صفحه وجود ندارد.</p></div><div className="vl-look-grid">{looks.map((look, index) => <article className={`vl-look vl-look-${index + 1}`} key={look.number}><div className="vl-look-image"><img src={look.image} alt={look.alt} width="1122" height="1402" loading="lazy" /><span className="vl-look-image-number" lang="en" dir="ltr">{look.number} / 03</span></div><div className="vl-look-caption"><div><span>{look.category}</span><h3>{look.title}</h3></div><span className="vl-look-star" aria-hidden="true">✳</span></div></article>)}</div></section>

      <section className="vl-statement" id="story" aria-labelledby="vl-statement-title"><div className="vl-shell vl-statement-inner"><div className="vl-statement-mark" aria-hidden="true">“</div><span className="vl-overline">02 / دربارهٔ ایده</span><h2 id="vl-statement-title">استایل، از جایی شروع می‌شود که <em>قانون‌ها تمام می‌شوند.</em></h2><div className="vl-statement-footer"><p>ایدهٔ وِلوما بر نمایش لباس به‌عنوان بیان فردی بنا شده است. ریتم صفحه، کنتراست تصویرها و فضای خالی کمک می‌کند هر استایل شخصیت خودش را داشته باشد.</p><span lang="en" dir="ltr">VELOMA / A FICTIONAL FASHION CONCEPT</span></div></div></section>

      <section className="vl-editorial vl-shell" id="editorial" aria-labelledby="vl-editorial-title"><div className="vl-editorial-photo"><img src="/images/veloma/red-look.jpg" alt="مدل نمایشی با بارانی روشن روی زمینه قرمز تیره" width="1122" height="1402" loading="lazy" /><span lang="en" dir="ltr">EDITORIAL / 02</span></div><div className="vl-editorial-copy"><span className="vl-overline">03 / ادیتوریال</span><h2 id="vl-editorial-title">کمتر توضیح بده.<br /><em>بیشتر نشان بده.</em></h2><p>در طراحی این لندینگ، عکس‌ها فقط تزئین نیستند. هر قاب یک مکث در روایت صفحه است؛ از نگاه اول تا کشف جزئیات.</p><div className="vl-editorial-rule"><span>01</span><span>ترکیب‌بندی با فضای تنفس</span></div><div className="vl-editorial-rule"><span>02</span><span>تایپوگرافی با شخصیت</span></div><div className="vl-editorial-rule"><span>03</span><span>مسیر ساده برای کاوش</span></div><a className="vl-text-link" href="#collection">بازگشت به کالکشن <Arrow /></a></div></section>

      <section className="vl-final" aria-labelledby="vl-final-title"><div className="vl-shell vl-final-inner"><span className="vl-overline">انتهای روایت، آغاز ایدهٔ بعدی</span><h2 id="vl-final-title">جرئت کن<br /><em>متفاوت دیده شوی.</em></h2><p>وِلوما یک برند یا فروشگاه واقعی نیست؛ این صفحه نمونه‌ای نمایشی از طراحی لندینگ فشن توسط پیکسل است.</p><a className="vl-button vl-button-dark" href="/portfolio/">دیدن نمونه‌کارهای پیکسل <Arrow diagonal /></a><span className="vl-final-decoration" aria-hidden="true" /></div></section>
    </main>

    <footer className="vl-footer vl-shell"><span className="vl-logo" lang="en" dir="ltr">VELOMA</span><p>کانسپت نمایشی پیکسل؛ برند واقعی نیست.</p><a href="/portfolio/">بازگشت به نمونه‌کارها <Arrow diagonal /></a></footer>
  </div>;
}
