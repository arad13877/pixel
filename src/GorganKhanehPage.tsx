import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from './Icons';
import ResponsiveImage from './ResponsiveImage';
import { demoProperties, districts, formatDemoPrice, parseBudget, propertyTypeLabels, type DemoProperty } from './gorgan-khaneh-data';

interface Filters {
  transaction: string;
  type: string;
  district: string;
  minimum: string;
  maximum: string;
}
const emptyFilters: Filters = { transaction: '', type: '', district: '', minimum: '', maximum: '' };
const navigation = [
  { href: '#properties', label: 'فایل‌های ملکی' },
  { href: '#districts', label: 'محله‌های گرگان' },
  { href: '#approach', label: 'مسیر همراهی' },
  { href: '#about', label: 'دربارهٔ ما' },
];

function BrandMark() {
  return <span className="gk-brand">
    <svg width="44" height="48" viewBox="0 0 44 48" fill="none" aria-hidden="true">
      <path d="M5 42V17L22 5l17 12v25H5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 42V23l9-6 9 6v19M22 17v25M5 30h8M31 30h8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
    <span>گرگان‌خانه<small lang="en" dir="ltr">GORGAN KHANEH / REAL ESTATE</small>
    </span>
  </span>;
}

function PropertyPhoto({ name, alt, className = '', hero = false, sizes }: { name: string; alt: string; className?: string; hero?: boolean; sizes?: string }) {
  return <ResponsiveImage src={`/images/gorgan-khaneh/${name}.jpg`} alt={alt} className={className}
    width={name === 'villa' ? 1536 : 1000} height={name === 'villa' ? 1024 : 667}
    sizes={sizes || '(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 45vw, 400px'}
    loading={hero ? undefined : 'lazy'} fetchPriority={hero ? 'high' : undefined} decoding="async" />;
}

function Header() {
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => { if (mobileMenu.current) mobileMenu.current.open = false; };
  return <>
    <div className="gk-demo-bar">
      <span>کانسپت نمایشی پیکسل؛ دفتر املاک واقعی نیست</span>
      <a href="/portfolio/">بازگشت به نمونه‌کارها <Icon name="arrow" size={14} />
      </a>
    </div>
    <header className="gk-header gk-container" id="top">
      <a href="#top" aria-label="گرگان‌خانه، ابتدای صفحه">
        <BrandMark />
      </a>
      <nav className="gk-desktop-nav" aria-label="ناوبری اصلی">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
      <a className="gk-header-cta" href="#consultation">مشاوره رایگان <Icon name="chat" size={18} />
      </a>
      <details className="gk-mobile-menu" ref={mobileMenu} onKeyDown={event => {
        if (event.key === 'Escape') { closeMenu(); mobileMenu.current?.querySelector('summary')?.focus(); }
      }}>
        <summary aria-label="فهرست بخش‌های صفحه">
          <Icon name="menu" />
          <span className="gk-sr-only">فهرست</span>
        </summary>
        <nav aria-label="ناوبری موبایل">{navigation.map(item => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}<Icon name="arrow" size={16} />
        </a>)}<a href="#consultation" onClick={closeMenu}>مشاوره رایگان <Icon name="chat" size={16} />
          </a>
        </nav>
      </details>
    </header>
  </>;
}

function Hero({ onSelectVilla }: { onSelectVilla: () => void }) {
  return <section className="gk-hero" aria-labelledby="gk-title">
    <div className="gk-hero-copy">
      <span className="gk-eyebrow">
        <i /> خرید، فروش و اجاره ملک در گرگان</span>
      <h1 id="gk-title">خانه‌ای که<br />دنبالش هستید،<br />
        <em>همین‌جاست.</em>
      </h1>
      <p>آپارتمان، ویلا، زمین یا جایی برای شروع کسب‌وکارتان؛ از میان گزینه‌ها، به انتخابی نزدیک‌تر شوید که با زندگی شما جور است.</p>
      <div className="gk-hero-actions">
        <a className="gk-button gk-button-brass" href="#properties">مشاهده فایل‌های ملکی <Icon name="arrow" />
        </a>
        <a className="gk-hero-secondary" href="#consultation">مشاوره رایگان <Icon name="chat" size={18} />
        </a>
      </div>
      <div className="gk-hero-assurance">
        <span>
          <Icon name="check" size={16} /> مشخصات روشن</span>
        <span>
          <Icon name="check" size={16} /> مقایسهٔ آسان</span>
        <span>
          <Icon name="check" size={16} /> انتخاب آگاهانه</span>
      </div>
    </div>
    <div className="gk-hero-visual">
      <PropertyPhoto name="villa" alt="کانسپت یک ویلای مدرن سنگی میان تپه‌های سبز؛ ملک و موقعیت واقعی نیست" hero sizes="(max-width: 700px) 100vw, 58vw" />
      <span className="gk-image-note">تصویر اختصاصی کانسپت · ملک واقعی نیست</span>
      <a className="gk-hero-property" href="#properties" onClick={onSelectVilla}>
        <div>
          <span>یک انتخاب، یک سبک زندگی</span>
          <strong>ویلای مدرن · زیارت</strong>
          <small>۲۴۰ متر زیربنا · ۳ اتاق خواب · فایل فرضی</small>
        </div>
        <Icon name="arrow" />
      </a>
      <span className="gk-hero-caption" lang="en" dir="ltr">A PLACE TO CALL HOME.</span>
    </div>
  </section>;
}

function SearchBox({ filters, setFilters, onSearch, onReset }: { filters: Filters; setFilters: (next: Filters) => void; onSearch: (filters: Filters) => void; onReset: () => void }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setReady(true), []);
  const update = (key: keyof Filters, value: string) => { setError(''); setFilters({ ...filters, [key]: value }); };
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minimum = parseBudget(filters.minimum);
    const maximum = parseBudget(filters.maximum);
    if ((minimum !== null && !Number.isFinite(minimum)) || (maximum !== null && !Number.isFinite(maximum))) {
      setError('بودجه را با عدد فارسی یا انگلیسی وارد کنید؛ مثلاً ۵۰۰۰ میلیون تومان.');
      return;
    }
    if (minimum !== null && maximum !== null && maximum < minimum) {
      setError('حداکثر قیمت باید بیشتر از یا برابر با حداقل قیمت باشد.');
      return;
    }
    setError('');
    onSearch(filters);
    document.getElementById('properties')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }
  return <section className="gk-search-wrap gk-container" id="search" aria-labelledby="gk-search-title">
    <form className="gk-search" onSubmit={handleSearch} aria-describedby="gk-search-note">
      <div className="gk-search-heading">
        <h2 id="gk-search-title">از نیاز شما شروع کنیم.</h2>
        <span>
          <Icon name="search" size={16} /> جستجو در ۶ فایل نمایشی</span>
      </div>
      <fieldset disabled={!ready} className="gk-search-fields">
        <legend className="gk-sr-only">فیلترهای جستجوی ملک</legend>
        <div className="gk-field">
          <label htmlFor="gk-transaction">نوع معامله</label>
          <select id="gk-transaction" value={filters.transaction} onChange={event => update('transaction', event.target.value)}>
            <option value="">خرید و اجاره</option>
            <option value="sale">خرید</option>
            <option value="rent">اجاره</option>
          </select>
        </div>
        <div className="gk-field">
          <label htmlFor="gk-type">نوع ملک</label>
          <select id="gk-type" value={filters.type} onChange={event => update('type', event.target.value)}>
            <option value="">همهٔ ملک‌ها</option>{Object.entries(propertyTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </div>
        <div className="gk-field">
          <label htmlFor="gk-district">محدوده یا محله</label>
          <select id="gk-district" value={filters.district} onChange={event => update('district', event.target.value)}>
            <option value="">همهٔ گرگان</option>{districts.map(item => <option key={item.name}>{item.name}</option>)}</select>
        </div>
        <div className="gk-field">
          <label htmlFor="gk-minimum">حداقل قیمت</label>
          <input id="gk-minimum" type="text" inputMode="decimal" placeholder="از چند میلیون؟" value={filters.minimum} maxLength={15} onChange={event => update('minimum', event.target.value)} aria-invalid={error ? true : undefined} />
        </div>
        <div className="gk-field">
          <label htmlFor="gk-maximum">حداکثر قیمت</label>
          <input id="gk-maximum" type="text" inputMode="decimal" placeholder="تا چند میلیون؟" value={filters.maximum} maxLength={15} onChange={event => update('maximum', event.target.value)} aria-invalid={error ? true : undefined} />
        </div>
        <button className="gk-button" type="submit">جستجوی ملک <Icon name="search" size={18} />
        </button>
      </fieldset>
      <div className="gk-search-foot">
        <p id="gk-search-note">مبنای قیمت: مبلغ خرید یا ودیعه، به میلیون تومان. همهٔ فایل‌ها و قیمت‌ها فرضی‌اند و نرخ بازار نیستند.</p>
        <button type="button" className="gk-reset" disabled={!ready} onClick={() => { setError(''); onReset(); }}>پاک‌کردن فیلترها <Icon name="close" size={13} />
        </button>
      </div>
      {error && <p className="gk-search-error" role="alert">{error}</p>}
      <noscript>
        <p className="gk-nojs">برای فیلترکردن، جاوااسکریپت را فعال کنید. شش فایل نمونه و جزئیات آن‌ها در پایین صفحه قابل مشاهده‌اند.</p>
      </noscript>
    </form>
  </section>;
}

function PropertyCard({ property, onInquiry }: { property: DemoProperty; onInquiry: (title: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  return <article className="gk-property" id={`property-${property.id}`} aria-labelledby={`title-${property.id}`}>
    <div className="gk-property-image">
      <PropertyPhoto name={property.image} alt={property.imageAlt} />
      <span className={`gk-transaction-badge${property.transaction === 'rent' ? ' gk-rent-badge' : ''}`}>{property.transaction === 'sale' ? 'فروش' : 'اجاره'}</span>
      <span className="gk-property-id" lang="en" dir="ltr">{property.id}</span>
    </div>
    <div className="gk-property-copy">
      <div className="gk-property-location">
        <span>{propertyTypeLabels[property.type]} · {property.district}</span>
        <small>فایل نمایشی</small>
      </div>
      <h3 id={`title-${property.id}`}>{property.title}</h3>
      <dl className="gk-property-facts">
        <div>
          <dt>متراژ</dt>
          <dd>{property.area.toLocaleString('fa-IR')} <small>مترمربع</small>
          </dd>
        </div>
        <div>
          <dt>{property.rooms === null ? 'کاربری' : 'اتاق خواب'}</dt>
          <dd>{property.rooms === null ? property.type === 'land' ? 'زمین' : 'تجاری' : `${property.rooms.toLocaleString('fa-IR')} خواب`}</dd>
        </div>
      </dl>
      <div className="gk-property-price">
        <span>{property.transaction === 'sale' ? 'مبلغ خریدِ فرضی' : 'ودیعهٔ فرضی'}</span>
        <strong>{formatDemoPrice(property.price)}</strong>{property.monthlyRent && <p>اجارهٔ ماهانه: {formatDemoPrice(property.monthlyRent)}</p>}</div>
      <details className="gk-property-details" onToggle={event => setExpanded(event.currentTarget.open)}>
        <summary>{expanded ? 'بستن جزئیات' : 'مشاهده جزئیات'}<Icon name="plus" size={18} />
        </summary>
        <div className="gk-detail-content">
          <p>{property.description}</p>
          <ul>{property.features.map(feature => <li key={feature}>
            <Icon name="check" size={13} />{feature}</li>)}</ul>
          <p className="gk-detail-disclosure">این ملک، تصویر و مشخصات آن فرضی‌اند؛ امکان معامله یا بازدید واقعی وجود ندارد.</p>
          <a href="#consultation" onClick={() => onInquiry(property.title)}>پرس‌وجو دربارهٔ این فایل <Icon name="arrow" size={16} />
          </a>
        </div>
      </details>
    </div>
  </article>;
}

function PropertiesSection({ properties, filtered, onReset, onInquiry }: { properties: DemoProperty[]; filtered: boolean; onReset: () => void; onInquiry: (title: string) => void }) {
  return <section className="gk-properties gk-container gk-section" id="properties" aria-labelledby="gk-properties-title">
    <div className="gk-section-heading">
      <div>
        <span className="gk-eyebrow">۰۱ / از یک خانه تا یک انتخاب</span>
        <h2 id="gk-properties-title">گزینه‌هایی برای<br />
          <em>فصل بعدی زندگی.</em>
        </h2>
      </div>
      <div>
        <p>شش فایل فرضی، برای تجربهٔ یک انتخاب روشن.<br />جزئیات را همین‌جا ببینید و گزینه‌ها را مقایسه کنید.</p>
        <span className="gk-result-count" role="status">{properties.length.toLocaleString('fa-IR')} فایل نمایشی{filtered ? ' مطابق جستجوی شما' : ' برای بررسی'}</span>
      </div>
    </div>
    {properties.length > 0 ? <div className="gk-property-grid">{properties.map(property => <PropertyCard key={property.id} property={property} onInquiry={onInquiry} />)}</div> : <div className="gk-empty">
      <Icon name="search" size={35} />
      <h3>در این مجموعهٔ نمونه، گزینه‌ای پیدا نشد.</h3>
      <p>محدوده یا بودجه را تغییر دهید، یا همهٔ فایل‌ها را دوباره ببینید.</p>
      <button type="button" className="gk-button" onClick={onReset}>نمایش همهٔ فایل‌ها <Icon name="arrow" />
      </button>
    </div>}
    <div className="gk-properties-foot">
      <p>خانهٔ مناسب، از شناختِ نیاز شما شروع می‌شود.</p>
      <a href="#consultation" className="gk-text-link">برای انتخاب کمک می‌خواهید؟ <Icon name="arrow" size={18} />
      </a>
    </div>
  </section>;
}

function DistrictsSection({ onDistrict }: { onDistrict: (district: string) => void }) {
  return <section className="gk-districts" id="districts" aria-labelledby="gk-districts-title">
    <div className="gk-container">
      <div className="gk-section-heading">
        <div>
          <span className="gk-eyebrow">۰۲ / از محله شروع کنید</span>
          <h2 id="gk-districts-title">گرگان، با نگاهِ <em>شما.</em>
          </h2>
        </div>
        <p>از میان این شش محدوده، گزینهٔ خود را پیدا کنید.<br />تصاویر کانسپت‌اند؛ عکس واقعی محله‌ها نیستند.</p>
      </div>
      <div className="gk-district-layout">{districts.map((district, index) => <article key={district.name} className={`gk-district gk-district-${index + 1}`}>
        <div className="gk-district-visual">
          <PropertyPhoto name={district.image} alt={`تصویر مفهومی برای معرفی فایل‌های ${district.name}؛ عکس واقعی محله نیست`} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 45vw, 620px" />
          <span className="gk-district-number" aria-hidden="true">0{index + 1}</span>
          <span className="gk-district-image-label">تصویر کانسپت</span>
        </div>
        <div className="gk-district-copy">
          <span>{district.caption}</span>
          <h3>{district.name}</h3>
          <p>{district.description}</p>
          <a href="#properties" onClick={() => onDistrict(district.name)} aria-label={`مشاهده فایل‌های نمونهٔ ${district.name}`}>فایل‌های این محدوده <Icon name="arrow" size={18} />
          </a>
        </div>
      </article>)}</div>
    </div>
  </section>;
}

function ApproachSection() {
  const advantages = [
    { title: 'فایل‌های ملکی به‌روز', description: 'در مدل خدماتی پیشنهادی، مشخصات و وضعیت هر فایل پیش از معرفی مرور می‌شود.' },
    { title: 'مشاوره تخصصی', description: 'اول دربارهٔ بودجه، محله و سبک زندگی صحبت می‌کنیم؛ بعد به سراغ گزینه‌ها می‌رویم.' },
    { title: 'بررسی دقیق ملک', description: 'متراژ، امکانات و پرسش‌های بازدید، کنار هم قرار می‌گیرند تا چیزی از نگاه دور نماند.' },
    { title: 'همراهی تا پایان معامله', description: 'مسیر پیشنهادی، از اولین گفت‌وگو تا تصمیم نهایی، قدم‌های روشن دارد.' },
  ];
  return <section className="gk-approach gk-container gk-section" id="approach" aria-labelledby="gk-approach-title">
    <div className="gk-approach-intro">
      <span className="gk-eyebrow">۰۳ / چرا گرگان‌خانه؟</span>
      <h2 id="gk-approach-title">تصمیم بزرگ.<br />
        <em>قدم‌های روشن.</em>
      </h2>
      <p>ما فقط به مترمربع فکر نمی‌کنیم؛ به روزهایی فکر می‌کنیم که قرار است در آن خانه بگذرانید.</p>
      <span className="gk-approach-note">مدل پیشنهادی خدمات برای این برند فرضی</span>
      <svg className="gk-plan" viewBox="0 0 260 190" fill="none" aria-hidden="true">
        <path d="M20 20h220v150H20zM20 85h135v85M155 20v65h85M90 20v65M155 120h85M65 85v85" stroke="currentColor" />
        <path d="M90 50h32v35M155 85h35v35M65 140h25v30" stroke="currentColor" strokeDasharray="4 4" />
        <circle cx="208" cy="50" r="13" stroke="currentColor" />
        <path d="M13 8h234M13 3v10M247 3v10M252 20v150M247 20h10M247 170h10" stroke="currentColor" opacity=".4" />
      </svg>
    </div>
    <ol className="gk-advantage-list">{advantages.map((advantage, index) => <li key={advantage.title}>
      <span className="gk-step-number" aria-hidden="true">0{index + 1}</span>
      <div>
        <h3>{advantage.title}</h3>
        <p>{advantage.description}</p>
      </div>
      <Icon name="arrow" size={22} />
    </li>)}</ol>
  </section>;
}

function AboutSection() {
  return <section className="gk-about" id="about" aria-labelledby="gk-about-title">
    <div className="gk-container gk-about-grid">
      <figure>
        <PropertyPhoto name="office" alt="دفتر پیشنهادی گرگان‌خانه با میز چوبی، ماکت خانه و نور طبیعی؛ دفتر واقعی نیست" sizes="(max-width: 700px) calc(100vw - 40px), 50vw" />
        <figcaption>
          <span>فضایی برای شنیدن و گفت‌وگو</span>
          <span lang="en" dir="ltr">THE NEXT CHAPTER STARTS HERE.</span>
        </figcaption>
      </figure>
      <div className="gk-about-copy">
        <span className="gk-eyebrow">۰۴ / مجموعهٔ گرگان‌خانه</span>
        <h2 id="gk-about-title">پیش از پیدا کردن خانه،<br />
          <em>شما را می‌شناسیم.</em>
        </h2>
        <p>در گرگان‌خانه، هدف ما ساده‌کردن مسیر خرید، فروش و اجاره ملک در گرگان است؛ با معرفی روشن گزینه‌ها، گفت‌وگویی بی‌عجله و توجه به جزئیاتی که برای شما مهم‌اند.</p>
        <p>این برند برای نمایش یک تجربهٔ حرفه‌ای طراحی شده است؛ مجموعه، دفتر و خدمات آن واقعی نیستند.</p>
        <a href="#consultation" className="gk-text-link">از نیازتان برای ما بگویید <Icon name="arrow" />
        </a>
        <div className="gk-about-signature">
          <BrandMark />
          <span>برای جایی که<br />نامش را خانه می‌گذارید.</span>
        </div>
      </div>
    </div>
  </section>;
}

function ConsultationSection({ interest }: { interest: string }) {
  const [ready, setReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => setReady(true), []);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }
  return <section className="gk-consultation" id="consultation" aria-labelledby="gk-consultation-title">
    <div className="gk-container gk-consultation-grid">
      <div className="gk-consultation-copy">
        <span className="gk-eyebrow">۰۵ / انتخاب بعدی، از اینجا</span>
        <h2 id="gk-consultation-title">برای پیدا کردن<br />ملک مناسب<br />
          <em>آماده‌اید؟</em>
        </h2>
        <p>از محله، بودجه و خانه‌ای که در ذهن دارید بگویید؛ یک گفت‌وگوی خوب، قدم اولِ پیدا کردن گزینهٔ مناسب است.</p>
        <a className="gk-button gk-button-brass" href="#gk-consultation-form">دریافت مشاوره رایگان <Icon name="arrow" />
        </a>
        <span className="gk-consultation-label">فرم زیر، تجربهٔ درخواست مشاوره را نمایش می‌دهد.</span>
      </div>
      <form id="gk-consultation-form" className="gk-consultation-form" onSubmit={handleSubmit} aria-labelledby="gk-form-title" aria-describedby="gk-form-note">
        <span className="gk-form-eyebrow">یک قدم نزدیک‌تر</span>
        <h3 id="gk-form-title">خانهٔ دلخواهتان چه شکلی است؟</h3>
        <p id="gk-form-note">این فرم نمایشی است؛ اطلاعات ارسال یا ذخیره نمی‌شود و مشاوره یا تماس واقعی انجام نمی‌گیرد. برای امتحان‌کردن، اطلاعات نمونه وارد کنید.</p>
        {interest && <p className="gk-interest">فایل موردنظر: {interest}</p>}
        <fieldset disabled={!ready}>
          <legend className="gk-sr-only">اطلاعات درخواست نمایشی</legend>
          <div className="gk-form-row">
            <div className="gk-field">
              <label htmlFor="gk-name">نام شما</label>
              <input id="gk-name" type="text" autoComplete="off" placeholder="مثلاً سارا" required minLength={2} maxLength={60} />
            </div>
            <div className="gk-field">
              <label htmlFor="gk-phone">شمارهٔ موبایل</label>
              <input id="gk-phone" type="tel" inputMode="tel" dir="ltr" autoComplete="off" placeholder="09123456789" required pattern="(?:09[0-9]{9}|۰۹[۰-۹]{9}|٠٩[٠-٩]{9})" title="شمارهٔ ۱۱ رقمی با ۰۹؛ با ارقام فارسی یا انگلیسی" />
            </div>
          </div>
          <div className="gk-field">
            <label htmlFor="gk-need">چه ملکی در نظر دارید؟</label>
            <textarea id="gk-need" rows={3} placeholder="مثلاً آپارتمان دوخوابه برای اجاره، محدودهٔ عدالت…" required minLength={8} maxLength={500} />
          </div>
          <button className="gk-button" type="submit">امتحان درخواست مشاوره <Icon name="arrow" />
          </button>
        </fieldset>
        <noscript>
          <p className="gk-nojs">برای امتحان فرم، جاوااسکریپت را فعال کنید. درخواستی ارسال نمی‌شود.</p>
        </noscript>
        <p className="gk-form-status" role="status">{submitted ? 'این نسخه نمایشی است؛ درخواستی ثبت نشد.' : ''}</p>
      </form>
    </div>
  </section>;
}

function Footer() {
  const [notice, setNotice] = useState('');
  return <footer className="gk-footer">
    <div className="gk-container">
      <div className="gk-footer-top">
        <div>
          <a href="#top" aria-label="بازگشت به ابتدای گرگان‌خانه">
            <BrandMark />
          </a>
          <p>یک انتخاب روشن،<br />برای فصل بعدی زندگی.</p>
        </div>
        <nav aria-label="ناوبری پایین صفحه">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}<a href="#consultation">مشاوره رایگان</a>
        </nav>
        <div className="gk-footer-contact">
          <span>اطلاعات تماس فرضی</span>
          <bdi>۰۱۷–۰۰۰۰۰۰۰۰</bdi>
          <p>گرگان، محلهٔ فرضی خانه‌سبز،<br />کوچهٔ سرو، پلاک نمایشی ۸</p>
          <small>نشانی واقعی یا شمارهٔ قابل تماس نیست.</small>
        </div>
        <div className="gk-footer-social">
          <span>همراهِ گفت‌وگو باشیم</span>
          <button type="button" onClick={() => setNotice('حساب اینستاگرام واقعی برای این برند فرضی وجود ندارد.')}>اینستاگرام · نمایشی <Icon name="arrow" size={16} />
          </button>
          <button type="button" onClick={() => setNotice('این شماره و حساب پیام‌رسان نمایشی‌اند؛ پیامی ارسال نمی‌شود.')}>واتساپ · نمایشی <Icon name="chat" size={16} />
          </button>
          <p role="status">{notice}</p>
        </div>
      </div>
      <div className="gk-footer-bottom">
        <p>© گرگان‌خانه · کانسپت نمایشی پیکسل؛ دفتر املاک واقعی نیست.</p>
        <a href="/portfolio/">بازگشت به نمونه‌کارهای پیکسل <Icon name="arrow" size={16} />
        </a>
        <span lang="en" dir="ltr">A CLEARER WAY HOME.</span>
      </div>
    </div>
  </footer>;
}

export default function GorganKhanehPage() {
  const [draftFilters, setDraftFilters] = useState<Filters>(emptyFilters);
  const [activeFilters, setActiveFilters] = useState<Filters>(emptyFilters);
  const [interest, setInterest] = useState('');
  const minimum = parseBudget(activeFilters.minimum);
  const maximum = parseBudget(activeFilters.maximum);
  const properties = demoProperties.filter(property =>
    (!activeFilters.transaction || property.transaction === activeFilters.transaction)
    && (!activeFilters.type || property.type === activeFilters.type)
    && (!activeFilters.district || property.district === activeFilters.district)
    && (minimum === null || property.price >= minimum)
    && (maximum === null || property.price <= maximum));
  function resetFilters() { setDraftFilters(emptyFilters); setActiveFilters(emptyFilters); }
  function selectDistrict(district: string) {
    const next = { ...emptyFilters, district };
    setDraftFilters(next);
    setActiveFilters(next);
  }
  return <div className="gorgan-khaneh-page" dir="rtl">
    <a className="gk-skip" href="#gk-main">رفتن به محتوای اصلی</a>
    <Header />
    <main id="gk-main">
      <Hero onSelectVilla={() => selectDistrict('زیارت')} />
      <SearchBox filters={draftFilters} setFilters={setDraftFilters} onSearch={setActiveFilters} onReset={resetFilters} />
      <PropertiesSection properties={properties} filtered={Object.values(activeFilters).some(Boolean)} onReset={resetFilters} onInquiry={setInterest} />
      <DistrictsSection onDistrict={selectDistrict} />
      <ApproachSection />
      <AboutSection />
      <ConsultationSection interest={interest} />
    </main>
    <Footer />
  </div>;
}
