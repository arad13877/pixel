import { useEffect, useRef, useState, type FormEvent } from 'react';

type MenuCategory = 'all' | 'coffee' | 'sweet' | 'food';
const menuItems = [
  { name: 'اسپرسو', english: 'ESPRESSO', description: 'دبل‌شات قهوه؛ کوتاه، گرم و پرعطر.', price: '۹۵٬۰۰۰', image: 'espresso', category: 'coffee' },
  { name: 'کافه لاته', english: 'CAFFÈ LATTE', description: 'اسپرسو و شیر بخاردیده، با بافتی نرم و لطیف.', price: '۱۴۵٬۰۰۰', image: 'coffee-story', category: 'coffee' },
  { name: 'آیس لاته', english: 'ICED LATTE', description: 'همان ترکیب آشنا، این بار خنک و روی یخ.', price: '۱۵۵٬۰۰۰', image: 'iced-latte', category: 'coffee' },
  { name: 'چیزکیک وانیلی', english: 'VANILLA CHEESECAKE', description: 'بافت خامه‌ای، پایهٔ بیسکویتی و سس میوه‌های قرمز.', price: '۱۹۵٬۰۰۰', image: 'cheesecake', category: 'sweet' },
  { name: 'کروسان کره‌ای', english: 'BUTTER CROISSANT', description: 'لایه‌های ترد و طلایی؛ همراه سادهٔ یک قهوهٔ خوب.', price: '۱۲۵٬۰۰۰', image: 'croissant', category: 'sweet' },
  { name: 'پاستا قارچ', english: 'MUSHROOM PASTA', description: 'تالیاتله، قارچ تفت‌داده و سس خامه با پارمزان.', price: '۳۸۵٬۰۰۰', image: 'pasta', category: 'food' },
] as const;
const categories: { value: MenuCategory; label: string }[] = [
  { value: 'all', label: 'همهٔ منو' }, { value: 'coffee', label: 'قهوه' }, { value: 'sweet', label: 'شیرینی و دسر' }, { value: 'food', label: 'غذای سبک' },
];
const navItems = [{ href: '#story', label: 'داستان روما' }, { href: '#menu', label: 'منوی کافه' }, { href: '#gallery', label: 'قاب‌های روما' }, { href: '#contact', label: 'پیدایمان کن' }];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={diagonal ? 'M18 6 6 18M6 7v11h11' : 'M19 12H5m7-7-7 7 7 7'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function RomaMark() {
  return <span className="rm-mark">
    <span lang="en" dir="ltr">ROMA<span className="rm-mark-dot">.</span>
    </span>
    <small>کافه روما</small>
  </span>;
}

function CafePhoto({ name, alt, className = '', priority = false }: { name: string; alt: string; className?: string; priority?: boolean }) {
  const portrait = name === 'coffee-story' || name === 'window-corner';
  return <img className={className} src={`/images/roma/${name}.jpg`} alt={alt} width={name === 'interior' ? 1536 : portrait ? 1000 : 760} height={name === 'interior' ? 1024 : portrait ? 1250 : 760} loading={priority ? undefined : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />;
}

function Navigation() {
  const mobileNav = useRef<HTMLDetailsElement>(null);
  return <header className="rm-header rm-container" id="top">
    <a className="rm-brand" href="#top" aria-label="کافه روما، ابتدای صفحه">
      <RomaMark />
    </a>
    <nav className="rm-desktop-nav" aria-label="ناوبری اصلی">{navItems.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
    <a className="rm-header-reserve" href="#reserve">رزرو میز <Arrow diagonal />
    </a>
    <details className="rm-mobile-nav" ref={mobileNav} onKeyDown={event => { if (event.key === 'Escape' && mobileNav.current) { mobileNav.current.open = false; mobileNav.current.querySelector('summary')?.focus(); } }}>
      <summary aria-label="فهرست بخش‌های صفحه">
        <span /> <span /> <span className="rm-sr-only">فهرست</span>
      </summary>
      <nav aria-label="ناوبری موبایل">{navItems.map(item => <a key={item.href} href={item.href} onClick={() => { if (mobileNav.current) mobileNav.current.open = false; }}>{item.label}<Arrow />
      </a>)}</nav>
    </details>
  </header>;
}

function MenuSection() {
  const [category, setCategory] = useState<MenuCategory>('all');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const visibleItems = menuItems.filter(item => category === 'all' || item.category === category);
  return <section className="rm-menu rm-container rm-section" id="menu" aria-labelledby="rm-menu-title">
    <div className="rm-section-heading">
      <div>
        <span className="rm-eyebrow">۰۲ / طعم‌های آشنا، حالِ تازه</span>
        <h2 id="rm-menu-title">از منوی <em>روما.</em>
        </h2>
      </div>
      <div>
        <p>از اولین فنجان صبح تا یک عصرانهٔ آرام.<br />برای هر مکث، یک انتخاب خوش‌طعم.</p>
        <span className="rm-demo-note">اقلام و قیمت‌های این منو نمایشی‌اند.</span>
      </div>
    </div>
    <div className="rm-menu-bar">
      <div className="rm-filters" role="group" aria-label="دسته‌بندی منو">{categories.map(item => <button type="button" key={item.value} aria-pressed={category === item.value} disabled={!ready} onClick={() => setCategory(item.value)}>{item.label}</button>)}</div>
      <span lang="en" dir="ltr">THE ROMA SELECTION</span>
    </div>
    <p className="rm-sr-only" role="status">{visibleItems.length.toLocaleString('fa-IR')} آیتم در منو</p>
    <div className="rm-menu-grid">{visibleItems.map(item => <article className="rm-menu-item" key={item.english}>
      <div className="rm-menu-image">
        <CafePhoto name={item.image} alt={item.name + '؛ تصویر نمایشی منوی کافه روما'} />
        <span lang="en" dir="ltr">{item.english}</span>
      </div>
      <div className="rm-menu-item-heading">
        <h3>{item.name}</h3>
        <p className="rm-price">{item.price}<span>تومان</span>
        </p>
      </div>
      <p className="rm-menu-description">{item.description}</p>
    </article>)}</div>
    <div className="rm-menu-bottom">
      <p>ساده انتخاب کن. با حوصله لذت ببر.</p>
      <a className="rm-text-link" href="#menu" onClick={() => setCategory('all')}>مشاهده منوی کامل <Arrow />
      </a>
    </div>
  </section>;
}

function ExperienceSection() {
  const features = [
    ['قهوهٔ تخصصی', 'عطر قهوه، در مرکز تجربهٔ روما.'], ['مواد اولیهٔ تازه', 'منویی کوتاه با ترکیب‌های ساده.'], ['فضای آرام', 'نور نرم و گوشه‌هایی برای مکث.'], ['برای کنار هم بودن', 'از گپ دوستانه تا یک قرار کاری.'], ['وای‌فای رایگان', 'برای وقت‌هایی که کار هم همراه توست.'],
  ];
  return <section className="rm-experience" id="experience" aria-labelledby="rm-experience-title">
    <div className="rm-container">
      <div className="rm-experience-grid">
        <div className="rm-experience-copy">
          <span className="rm-eyebrow">۰۳ / فراتر از یک فنجان</span>
          <h2 id="rm-experience-title">بعضی جاها،<br />حال آدم را<br />
            <em>آرام‌تر می‌کنند.</em>
          </h2>
          <p>صدای آرام فنجان‌ها، نور روی میز چوبی و گفت‌وگویی که عجله‌ای برای تمام‌شدن ندارد. روما را برای همین لحظه‌های کوچک تصور کرده‌ایم.</p>
          <a className="rm-text-link" href="#gallery">قدم‌زدن در قاب‌های روما <Arrow />
          </a>
          <span className="rm-experience-word" lang="en" dir="ltr" aria-hidden="true">Stay a little.</span>
        </div>
        <figure className="rm-experience-photo">
          <CafePhoto name="window-corner" alt="گوشهٔ روشن کافهٔ خیالی با صندلی‌های زیتونی، میز چوبی و پنجرهٔ رو به درختان" />
          <figcaption>
            <span>یک صندلی کنار پنجره، برای تو.</span>
            <span lang="en" dir="ltr">A QUIET CORNER / 01</span>
          </figcaption>
        </figure>
      </div>
      <div className="rm-features" aria-label="ویژگی‌های پیشنهادی کافه">{features.map(([title, description], index) => <div key={title}>
        <span className="rm-feature-number" aria-hidden="true">0{index + 1}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>)}</div>
      <p className="rm-experience-note">فضا، تصاویر و امکانات، بخشی از هویت پیشنهادی این کافهٔ فرضی هستند.</p>
    </div>
  </section>;
}

function GallerySection() {
  return <section className="rm-gallery rm-container rm-section" id="gallery" aria-labelledby="rm-gallery-title">
    <div className="rm-section-heading">
      <div>
        <span className="rm-eyebrow">۰۴ / آلبوم روما</span>
        <h2 id="rm-gallery-title">قاب‌هایی برای <em>ماندن.</em>
        </h2>
      </div>
      <p>نور، بافت، عطر قهوه.<br />تصویرهایی از یک حالِ خوبِ ساده.</p>
    </div>
    <div className="rm-gallery-layout">
      <figure className="rm-gallery-wide">
        <CafePhoto name="interior" alt="چیدمان پیشنهادی کافه با دیوارهای گردویی، میزهای گرد و چراغ‌های برنجی" />
        <figcaption>
          <span>نور صبح، روی میزهای چوبی</span>
          <span lang="en" dir="ltr">01 / THE SPACE</span>
        </figcaption>
      </figure>
      <figure className="rm-gallery-tall">
        <CafePhoto name="coffee-story" alt="لاته با طرح برگ و کروسان روی میز چوبی در نور طبیعی" />
        <figcaption>
          <span>آیین کوچکِ هر روز</span>
          <span lang="en" dir="ltr">02 / THE RITUAL</span>
        </figcaption>
      </figure>
      <figure className="rm-gallery-small">
        <CafePhoto name="cheesecake" alt="چیزکیک وانیلی با سس میوهٔ قرمز در بشقاب سرامیکی" />
        <figcaption>
          <span>یک پایان شیرین</span>
          <span lang="en" dir="ltr">03 / THE TASTE</span>
        </figcaption>
      </figure>
      <div className="rm-gallery-quote">
        <span aria-hidden="true">✳</span>
        <p>زندگی،<br />همین مکث‌های<br />
          <em>خوش‌طعم است.</em>
        </p>
        <small>تصاویر اختصاصیِ تولیدشده برای این کانسپت</small>
      </div>
    </div>
  </section>;
}

function GuestNotes() {
  const notes = [
    { name: 'سارا م.', text: 'میز کنار پنجره را دوست داشتم. از آن جاهایی که می‌شود با یک قهوه، کمی بیشتر نشست.', order: 'یک لاته و یک عصر آرام' },
    { name: 'آرمان ر.', text: 'برای یک گپ دونفره انتخابش می‌کردم؛ نور ملایم و فاصلهٔ میزها حس خوبی دارد.', order: 'یک قرار دوستانه' },
    { name: 'نرگس ک.', text: 'ترکیب قهوه و کروسان همیشه برای من جواب می‌دهد. اینجا هم همین را انتخاب می‌کردم.', order: 'یک شروع ساده برای روز' },
  ];
  return <section className="rm-notes" aria-labelledby="rm-notes-title">
    <div className="rm-container">
      <div className="rm-notes-heading">
        <span className="rm-eyebrow">چند خط، از آن سوی میز</span>
        <h2 id="rm-notes-title">اگر روما یک خاطره بود.</h2>
        <p>نظرهای فرضی برای نمایش طراحی؛ این متن‌ها از مشتری واقعی نقل نشده‌اند.</p>
      </div>
      <div className="rm-notes-grid">{notes.map(note => <figure key={note.name}>
        <span className="rm-quote-mark" aria-hidden="true">“</span>
        <blockquote>{note.text}</blockquote>
        <figcaption>
          <b>{note.name} <small>مهمان فرضی</small>
          </b>
          <span>{note.order}</span>
        </figcaption>
      </figure>)}</div>
    </div>
  </section>;
}

function ContactSection() {
  const [notice, setNotice] = useState('');
  return <section className="rm-contact rm-container rm-section" id="contact" aria-labelledby="rm-contact-title">
    <div className="rm-contact-copy">
      <span className="rm-eyebrow">۰۵ / جایی در خیالِ گرگان</span>
      <h2 id="rm-contact-title">سرِ راهِ یک<br />
        <em>روز خوب.</em>
      </h2>
      <p>روما را در شهری سبز تصور کرده‌ایم؛ یک توقف گرم، میان رفت‌وآمدهای روزمره.</p>
      <p className="rm-demo-note">نشانی، شماره و ساعت‌ها فرضی‌اند؛ این کافه محل واقعی ندارد.</p>
      <dl className="rm-contact-details">
        <div>
          <dt>نشانی پیشنهادی</dt>
          <dd>گرگان، محلهٔ فرضی باغ‌روما، کوچهٔ نارون، پلاک نمایشی ۱۲</dd>
        </div>
        <div>
          <dt>ساعت کاری پیشنهادی</dt>
          <dd>هر روز، از ۸ صبح تا ۱۱ شب</dd>
        </div>
        <div>
          <dt>شمارهٔ نمایشی</dt>
          <dd>
            <bdi>۰۱۷–۰۰۰۰۰۰۰۰</bdi>
            <small>غیرقابل تماس</small>
          </dd>
        </div>
      </dl>
      <div className="rm-contact-actions">
        <button className="rm-text-link" type="button" onClick={() => setNotice('این نقشه نمایشی است؛ کافه روما نشانی واقعی برای مسیریابی ندارد.')}>مسیریابی نمایشی <Arrow diagonal />
        </button>
        <a className="rm-text-link" href="#rm-contact-status" onClick={event => { event.preventDefault(); setNotice('حساب شبکهٔ اجتماعی واقعی برای این کانسپت وجود ندارد.'); }}>اینستاگرام روما <span className="rm-inline-demo">نمایشی</span>
          <Arrow diagonal />
        </a>
      </div>
      <p className="rm-contact-status" id="rm-contact-status" role="status">{notice}</p>
    </div>
    <div className="rm-map" role="img" aria-label="نقشهٔ تصویری و فرضی کافه روما؛ بدون موقعیت جغرافیایی واقعی">
      <svg viewBox="0 0 600 620" fill="none" aria-hidden="true">
        <rect width="600" height="620" fill="#e6e4d7" />
        <path d="M0 60h140v142H0zM365 0h235v133H365zM392 365h208v255H392zM0 443h160v177H0z" fill="#d3dcc7" />
        <path d="M-40 320 640 160M243-40l25 700M-40 430l680-26M474-40 440 660M-40 105l680 15" stroke="#faf7ef" strokeWidth="27" />
        <path d="M-40 320 640 160M243-40l25 700M-40 430l680-26M474-40 440 660M-40 105l680 15" stroke="#d6d2c3" strokeWidth="1" strokeDasharray="5 7" />
        <path d="M0 543c72-90 170 111 250 30S490 499 610 574" stroke="#becdc8" strokeWidth="15" />
        <circle cx="128" cy="102" r="26" fill="#bac8ad" />
        <circle cx="525" cy="515" r="39" fill="#bac8ad" />
        <circle cx="535" cy="61" r="32" fill="#bac8ad" />
      </svg>
      <div className="rm-map-pin">
        <RomaMark />
        <span>همین حوالی، در خیال.</span>
        <i aria-hidden="true" />
      </div>
      <span className="rm-map-label">نقشهٔ نمایشی · بدون موقعیت واقعی</span>
      <span className="rm-map-compass" aria-hidden="true">N<br />↑</span>
    </div>
  </section>;
}

function ReservationSection() {
  const [ready, setReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => setReady(true), []);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }
  return <section className="rm-reserve" id="reserve" aria-labelledby="rm-reserve-title">
    <div className="rm-container rm-reserve-grid">
      <div className="rm-reserve-copy">
        <span className="rm-eyebrow">برای یک مکثِ دل‌چسب</span>
        <h2 id="rm-reserve-title">امروز، قهوه‌ات را<br />در <em>روما</em> بنوش.</h2>
        <p>یک میز، یک فنجان، یک گفت‌وگوی خوب.<br />باقی روز می‌تواند کمی صبر کند.</p>
        <span className="rm-reserve-sign" lang="en" dir="ltr" aria-hidden="true">Coffee. Company. Calm.</span>
        <a href="#menu" className="rm-text-link">اول، نگاهی به منو <Arrow />
        </a>
      </div>
      <form className="rm-reserve-form" onSubmit={handleSubmit} aria-labelledby="rm-form-title" aria-describedby="rm-form-disclosure">
        <span className="rm-form-kicker">یک قرار کوچک</span>
        <h3 id="rm-form-title">میزت را انتخاب کن.</h3>
        <p id="rm-form-disclosure">این فرم نمایشی است. اطلاعات ارسال یا ذخیره نمی‌شود و رزرو واقعی انجام نمی‌گیرد؛ برای امتحان‌کردن فرم، اطلاعات نمونه وارد کن.</p>
        <fieldset disabled={!ready}>
          <legend className="rm-sr-only">اطلاعات رزرو نمایشی</legend>
          <div className="rm-form-field">
            <label htmlFor="rm-name">نام</label>
            <input id="rm-name" type="text" autoComplete="off" placeholder="مثلاً سارا" required minLength={2} maxLength={60} />
          </div>
          <div className="rm-form-field">
            <label htmlFor="rm-phone">شمارهٔ موبایل</label>
            <input id="rm-phone" type="tel" inputMode="tel" dir="ltr" autoComplete="off" placeholder="09123456789" required pattern="(?:09[0-9]{9}|۰۹[۰-۹]{9}|٠٩[٠-٩]{9})" title="شمارهٔ ۱۱ رقمی با ۰۹؛ ارقام فارسی یا انگلیسی" />
          </div>
          <div className="rm-form-row">
            <div className="rm-form-field">
              <label htmlFor="rm-guests">تعداد نفرات</label>
              <select id="rm-guests" defaultValue="2" required>{['۱', '۲', '۳', '۴', '۵', '۶'].map((number, index) => <option value={index + 1} key={number}>{number} نفر</option>)}</select>
            </div>
            <div className="rm-form-field">
              <label htmlFor="rm-time">زمان پیشنهادی</label>
              <select id="rm-time" defaultValue="" required>
                <option value="" disabled>انتخاب زمان</option>
                <option value="morning">صبح · ۸ تا ۱۲</option>
                <option value="afternoon">عصر · ۱۲ تا ۱۸</option>
                <option value="evening">شب · ۱۸ تا ۲۳</option>
              </select>
            </div>
          </div>
          <button type="submit" className="rm-button">امتحان رزرو میز <Arrow diagonal />
          </button>
        </fieldset>
        <noscript>
          <p>برای امتحان فرم، جاوااسکریپت را فعال کنید. هیچ رزروی انجام نمی‌شود.</p>
        </noscript>
        <p className="rm-reserve-status" role="status">{submitted ? 'این نسخه نمایشی است؛ میزی رزرو نشد.' : ''}</p>
      </form>
    </div>
  </section>;
}

export default function RomaPage() {
  return <div className="roma-page" dir="rtl">
    <a className="rm-skip" href="#roma-main">رفتن به محتوای اصلی</a>
    <div className="rm-demo-banner">
      <span>کانسپت نمایشی پیکسل؛ کافهٔ واقعی نیست</span>
      <a href="/portfolio/">بازگشت به نمونه‌کارها <Arrow />
      </a>
    </div>
    <Navigation />
    <main id="roma-main">
      <section className="rm-hero rm-container" aria-labelledby="rm-hero-title">
        <div className="rm-hero-top">
          <div>
            <span className="rm-eyebrow">
              <i /> یک کافهٔ خیالی، در حال‌وهوای گرگان</span>
            <h1 id="rm-hero-title">کمی مکث،<br />
              <span>کمی <em>روما.</em>
              </span>
            </h1>
          </div>
          <div className="rm-hero-intro">
            <span className="rm-hero-flower" aria-hidden="true">✳</span>
            <p>جایی برای قهوهٔ خوب،<br />{' '}گفت‌وگوهای طولانی<br />و لحظه‌هایی که مالِ خودت هستند.</p>
            <div className="rm-hero-actions">
              <a className="rm-button" href="#menu">مشاهده منو <Arrow />
              </a>
              <a className="rm-text-link" href="#reserve">رزرو میز <Arrow diagonal />
              </a>
            </div>
          </div>
        </div>
        <div className="rm-hero-visual">
          <CafePhoto name="interior" alt="فضای پیشنهادی کافه روما؛ چوب گردویی، صندلی‌های زیتونی و نور طبیعی پنجره‌ها" priority />
          <div className="rm-hero-caption">
            <span>
              <i /> گرگان، در خیالِ یک قرار</span>
            <span>ساعت پیشنهادی: هر روز ۸ تا ۲۳</span>
          </div>
          <span className="rm-image-index" lang="en" dir="ltr">ROMA CAFÉ / A SLOWER KIND OF DAY</span>
        </div>
        <div className="rm-hero-foot">
          <span>قهوه. گفت‌وگو. کمی آرامش.</span>
          <span lang="en" dir="ltr">GOOD THINGS TAKE A LITTLE TIME.</span>
          <a href="#story" aria-label="رفتن به داستان روما">↓</a>
        </div>
      </section>
      <section className="rm-story rm-container rm-section" id="story" aria-labelledby="rm-story-title">
        <div className="rm-story-copy">
          <span className="rm-eyebrow">۰۱ / داستان یک مکث</span>
          <h2 id="rm-story-title">برای وقت‌هایی که<br />دلت می‌خواهد<br />
            <em>کمی آهسته‌تر باشی.</em>
          </h2>
          <p>روما از یک تصویر ساده شروع شد: میز چوبی، نور کنار پنجره و قهوه‌ای که تا آخرین جرعه‌اش وقت داری. یک کافهٔ کوچک در خیالِ گرگان، برای قرارهای بی‌تکلف و روزهای معمولیِ دوست‌داشتنی.</p>
          <p>در این تصویر، تجمل یعنی توجه به جزئیات؛ از انتخاب فنجان تا فاصلهٔ میان میزها. همه‌چیز برای این است که چند دقیقه، بیشتر بمانی.</p>
          <a className="rm-text-link" href="#experience">حال‌وهوای روما <Arrow />
          </a>
        </div>
        <div className="rm-story-visual">
          <figure>
            <CafePhoto name="coffee-story" alt="لاته و کروسان روی میز گردویی کنار صندلی زیتونی" />
            <figcaption>
              <span>یک صبح آرام، به روایت روما</span>
              <span lang="en" dir="ltr">THE EVERYDAY RITUAL</span>
            </figcaption>
          </figure>
          <span className="rm-story-seal" lang="en" dir="ltr" aria-hidden="true">SLOW<br />
            <i>mornings</i>
            <br />GOOD COFFEE</span>
        </div>
      </section>
      <MenuSection />
      <ExperienceSection />
      <GallerySection />
      <GuestNotes />
      <ContactSection />
      <ReservationSection />
    </main>
    <footer className="rm-footer">
      <div className="rm-container">
        <div className="rm-footer-top">
          <a href="#top" className="rm-brand" aria-label="بازگشت به ابتدای کافه روما">
            <RomaMark />
          </a>
          <p>یک فنجان خوب،<br />بهانهٔ خوبی برای با هم بودن است.</p>
          <nav aria-label="ناوبری پایین صفحه">{navItems.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
          <div className="rm-footer-contact">
            <span>گرگان · نشانی و تماس نمایشی</span>
            <bdi>۰۱۷–۰۰۰۰۰۰۰۰</bdi>
            <a href="#contact">اینستاگرام روما · نمایشی <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="rm-footer-bottom">
          <p>© کافه روما · کانسپت طراحی پیکسل؛ کسب‌وکار واقعی نیست.</p>
          <a href="/portfolio/">بازگشت به نمونه‌کارهای پیکسل <Arrow />
          </a>
          <span lang="en" dir="ltr">DESIGNED TO FEEL GOOD.</span>
        </div>
      </div>
    </footer>
  </div>;
}
