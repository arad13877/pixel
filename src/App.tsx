import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './Icons';
import { Contact } from './Contact';
import AgentSection from './AgentSection';
import { faqs } from './content';
import WebDesignPage from './WebDesignPage';
import PortfolioPage from './PortfolioPage';
import LiquidGlassMaterial from './LiquidGlassMaterial';
import { ArticleDetailPage, ArticlesIndexPage } from './ArticlesPage';
import RequestPage from './RequestPage';

function Brand({ href = '#' }: { href?: string }) { return <a className="brand" href={href} aria-label="پیکسل PIXEL STUDIO، ابتدای صفحه"><span className="brand-symbol" aria-hidden="true"><i/><i/><i/><i/></span><span>پیکسل<span className="brand-latin">PIXEL STUDIO</span></span></a>; }

function MockSite({ phone = false, showcase = false }: { phone?: boolean; showcase?: boolean }) {
  return <div role="img" className={phone ? 'mock-phone' : 'mock-browser'} aria-label={phone ? 'نسخه موبایل نمونه نمایشی آرا' : 'نمونه نمایشی سایت استودیو معماری آرا'}>
    {phone ? <div className="phone-island"/> : <div className="browser-toolbar"><span className="browser-dots"><i/><i/><i/></span><span className="browser-address"><Icon name="globe" size={10}/> ara-studio.example</span><Icon name="plus" size={12}/></div>}
    <div className="mock-content" aria-hidden="true"><div className="mock-nav"><strong>آرا<span>استودیو معماری</span></strong>{!phone && <span className="mock-links">پروژه‌ها&nbsp;&nbsp;&nbsp; درباره آرا&nbsp;&nbsp;&nbsp; ارتباط با ما</span>}<Icon name={phone ? 'menu' : 'arrow'} size={15}/></div>
      <div className="mock-copy"><span className="mock-eyebrow">معماری، به زبان زندگی</span><h3>فضایی برای زندگی،<br/><span>جایی برای آرامش.</span></h3>{!phone && <p>طراحی فضاهایی که داستان شما را روایت می‌کنند.</p>}<span className="mock-cta">کشف پروژه‌ها <Icon name="arrow" size={13}/></span></div>
      <div className="architecture-photo"><img src="/images/interior-600.webp" srcSet="/images/interior-600.webp 600w, /images/interior-900.webp 900w, /images/interior.webp 1200w" sizes={phone ? '110px' : '(max-width: 760px) 85vw, 500px'} alt="فضای روشن معماری داخلی با مبلمان مینیمال و پنجره‌های بزرگ" width="1200" height="800" fetchPriority={phone || showcase ? 'auto' : 'high'} loading={showcase ? 'lazy' : 'eager'} /></div>
      {!phone && <div className="mock-bottom"><span>خانه‌ای به اندازه زندگی شما</span><span>طراحی داخلی <span className="tiny-dot"/> معماری</span></div>}
    </div>
  </div>;
}

function HeroContours() {
  return <div className="hero-contours" aria-hidden="true">
    <svg className="hero-contours-desktop" viewBox="0 0 1440 660" preserveAspectRatio="none" fill="none">
      <path d="M1550 50C1220 30 1070 130 780 122C420 105 310 220-80 360" opacity=".12"/>
      <path d="M1540 82C1190 65 1070 170 780 155C420 140 290 255-80 430" opacity=".09"/>
      <path d="M1520 113C1150 102 1020 198 775 194C395 180 260 305-80 500" opacity=".06"/>
    </svg>
    <svg className="hero-contours-mobile" viewBox="0 0 390 270" preserveAspectRatio="none" fill="none">
      <path d="M450 25C310 25 260 72 120 65C15 60-15 140-85 175" opacity=".12"/>
      <path d="M450 55C300 60 252 104 123 102C15 105-20 175-90 224" opacity=".08"/>
    </svg>
  </div>;
}

const projectDeliverables = [
  { icon: 'layers' as const, number: '01', title: 'طراحی اختصاصی رابط', description: 'ظاهر و ساختاری متناسب با هویت و هدف کسب‌وکار تو.' },
  { icon: 'globe' as const, number: '02', title: 'نسخه کامل موبایل', description: 'تجربه‌ای روان و خوانا برای صفحه‌نمایش‌های مختلف.' },
  { icon: 'search' as const, number: '03', title: 'ساختار فنی مناسب SEO', description: 'پایه‌ای منظم برای دیده‌شدن بهتر محتوا در موتورهای جستجو.' },
  { icon: 'chat' as const, number: '04', title: 'مسیرهای روشن تماس', description: 'دسترسی ساده‌تر بازدیدکننده به گفتگو و اقدام بعدی.' },
  { icon: 'spark' as const, number: '05', title: 'نسخه آماده انتشار', description: 'سایتی بررسی‌شده و آماده برای راه‌اندازی واقعی.' },
];

const homePrinciples: { number: string; icon: IconName; label: string }[] = [
  { number: '01', icon: 'globe', label: 'طراحی برای دنیای واقعی' },
  { number: '02', icon: 'layers', label: 'تجربه یکپارچه در موبایل' },
  { number: '03', icon: 'code', label: 'توسعه دقیق و فکرشده' },
  { number: '04', icon: 'spark', label: 'آماده برای قدم بعدی' },
];

export default function App({ page = 'home', articleSlug }: { page?: 'home' | 'web-design' | 'portfolio' | 'articles' | 'article' | 'request'; articleSlug?: string }) {
  const home = page === 'home';
  const webDesign = page === 'web-design';
  const portfolio = page === 'portfolio';
  const articlesIndex = page === 'articles';
  const articleDetail = page === 'article';
  const request = page === 'request';
  const articlesPage = articlesIndex || articleDetail;
  const navItems = [
    { href: webDesign ? '#types' : '/web-design/', label: 'طراحی سایت', current: webDesign },
    { href: '/portfolio/', label: 'نمونه‌کارها', current: portfolio },
    { href: home ? '#agents' : '/#agents', label: 'ایجنت‌های هوش مصنوعی', badge: true },
    { href: '/articles/', label: 'مقالات', current: articlesPage },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const header = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const section = heroRef.current;
    if (!home || !section) return;

    const query = '(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
    const capability = window.matchMedia(query);
    let disposed = false;
    let started = false;
    let cleanup = () => {};
    const start = () => {
      if (started || !capability.matches) return;
      started = true;
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const motion = gsap.matchMedia();
      motion.add(query, () => {
        const targets = section.querySelectorAll('.hero-copy h1, .hero-description, .hero-actions, .hero-art');
        gsap.fromTo(targets, { y: 9, opacity: .9 }, {
          y: 0, opacity: 1, duration: .65, stagger: .07, ease: 'power2.out',
          clearProps: 'transform,opacity',
        });
        document.querySelectorAll<HTMLElement>('.home-page [data-home-reveal]').forEach(element => {
          gsap.fromTo(element, { y: 18, opacity: .82 }, {
            y: 0,
            opacity: 1,
            duration: .72,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: element, start: 'top 86%', once: true },
          });
        });
        const processSteps = document.querySelector<HTMLElement>('.home-page .process-steps');
        const processFill = document.querySelector<HTMLElement>('.home-page .process-track-fill');
        if (processSteps && processFill) {
          gsap.fromTo(processFill, { scaleY: 0 }, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: processSteps,
              start: 'top 76%',
              end: 'bottom 60%',
              scrub: .5,
            },
          });
        }
        const art = section.querySelector<HTMLElement>('.hero-art');
        const browser = section.querySelector<HTMLElement>('.hero-art > .mock-browser');
        const phone = section.querySelector<HTMLElement>('.hero-art > .mock-phone');
        const topTag = section.querySelector<HTMLElement>('.floating-tag');
        const bottomTag = section.querySelector<HTMLElement>('.responsive-tag');
        if (!art || !browser || !phone || !topTag || !bottomTag) return;

        const browserX = gsap.quickTo(browser, 'x', { duration: .55, ease: 'power2.out' });
        const browserY = gsap.quickTo(browser, 'y', { duration: .55, ease: 'power2.out' });
        const phoneX = gsap.quickTo(phone, 'x', { duration: .55, ease: 'power2.out' });
        const phoneY = gsap.quickTo(phone, 'y', { duration: .55, ease: 'power2.out' });
        const topX = gsap.quickTo(topTag, 'x', { duration: .7, ease: 'power2.out' });
        const topY = gsap.quickTo(topTag, 'y', { duration: .7, ease: 'power2.out' });
        const bottomX = gsap.quickTo(bottomTag, 'x', { duration: .7, ease: 'power2.out' });
        const bottomY = gsap.quickTo(bottomTag, 'y', { duration: .7, ease: 'power2.out' });
        const reset = () => { browserX(0); browserY(0); phoneX(0); phoneY(0); topX(0); topY(0); bottomX(0); bottomY(0); };
        const move = (event: PointerEvent) => {
          const bounds = art.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
          const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
          browserX(x * 5); browserY(y * 5);
          phoneX(x * 7); phoneY(y * 7);
          topX(x * -3); topY(y * -3);
          bottomX(x * 4); bottomY(y * 4);
        };
        art.addEventListener('pointermove', move);
        art.addEventListener('pointerleave', reset);
        return () => {
          art.removeEventListener('pointermove', move);
          art.removeEventListener('pointerleave', reset);
          [browserX, browserY, phoneX, phoneY, topX, topY, bottomX, bottomY].forEach(tween => tween.tween.kill());
          gsap.set([browser, phone, topTag, bottomTag], { clearProps: 'x,y' });
        };
      }, section);
      cleanup = () => motion.revert();
      });
    };
    capability.addEventListener('change', start);
    start();
    return () => { disposed = true; capability.removeEventListener('change', start); cleanup(); };
  }, [home]);
  useEffect(() => {
    if (!webDesign) return;
    const section = document.querySelector<HTMLElement>('.wd-hero');
    if (!section) return;

    const query = '(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
    const capability = window.matchMedia(query);
    let disposed = false;
    let started = false;
    let cleanup = () => {};
    const start = () => {
      if (started || !capability.matches) return;
      started = true;
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const motion = gsap.matchMedia();
        motion.add(query, () => {
          const heroTargets = section.querySelectorAll('.wd-eyebrow, .wd-hero-copy h1, .wd-hero-copy > p, .wd-actions, .wd-channel, .wd-hero-art');
          gsap.fromTo(heroTargets, { y: 10, opacity: .88 }, {
            y: 0,
            opacity: 1,
            duration: .68,
            stagger: .065,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          });
          document.querySelectorAll<HTMLElement>('.web-design-page [data-wd-reveal]').forEach(element => {
            gsap.fromTo(element, { y: 18, opacity: .82 }, {
              y: 0,
              opacity: 1,
              duration: .72,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: element, start: 'top 86%', once: true },
            });
          });
          const process = document.querySelector<HTMLElement>('.web-design-page .wd-steps');
          const fill = document.querySelector<HTMLElement>('.web-design-page .wd-process-fill');
          if (process && fill) {
            gsap.fromTo(fill, { scaleY: 0 }, {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: process, start: 'top 78%', end: 'bottom 61%', scrub: .5 },
            });
          }
          const art = section.querySelector<HTMLElement>('.wd-hero-art');
          const browser = section.querySelector<HTMLElement>('.wd-art-browser');
          const phone = section.querySelector<HTMLElement>('.wd-art-phone');
          const glass = section.querySelector<HTMLElement>('.wd-art-glass');
          if (!art || !browser || !phone || !glass) return;
          const browserX = gsap.quickTo(browser, 'x', { duration: .55, ease: 'power2.out' });
          const browserY = gsap.quickTo(browser, 'y', { duration: .55, ease: 'power2.out' });
          const phoneX = gsap.quickTo(phone, 'x', { duration: .6, ease: 'power2.out' });
          const phoneY = gsap.quickTo(phone, 'y', { duration: .6, ease: 'power2.out' });
          const glassX = gsap.quickTo(glass, 'x', { duration: .7, ease: 'power2.out' });
          const glassY = gsap.quickTo(glass, 'y', { duration: .7, ease: 'power2.out' });
          const reset = () => { browserX(0); browserY(0); phoneX(0); phoneY(0); glassX(0); glassY(0); };
          const move = (event: PointerEvent) => {
            const bounds = art.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
            browserX(x * 4); browserY(y * 4);
            phoneX(x * 7); phoneY(y * 7);
            glassX(x * -4); glassY(y * -4);
          };
          art.addEventListener('pointermove', move);
          art.addEventListener('pointerleave', reset);
          return () => {
            art.removeEventListener('pointermove', move);
            art.removeEventListener('pointerleave', reset);
            [browserX, browserY, phoneX, phoneY, glassX, glassY].forEach(tween => tween.tween.kill());
            gsap.set([browser, phone, glass], { clearProps: 'x,y' });
          };
        }, section);
        cleanup = () => motion.revert();
      });
    };
    capability.addEventListener('change', start);
    start();
    return () => { disposed = true; capability.removeEventListener('change', start); cleanup(); };
  }, [webDesign]);
  useEffect(() => {
    if (!articlesPage) return;
    const scope = document.querySelector<HTMLElement>(articlesIndex ? '.articles-page' : '.article-detail-page');
    if (!scope) return;
    const query = '(min-width: 761px) and (prefers-reduced-motion: no-preference)';
    const capability = window.matchMedia(query);
    let disposed = false;
    let started = false;
    let cleanup = () => {};
    const start = () => {
      if (started || !capability.matches) return;
      started = true;
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const motion = gsap.matchMedia();
        motion.add(query, () => {
          const heroTargets = scope.querySelectorAll(articlesIndex ? '.articles-hero > div, .articles-hero > p' : '.article-breadcrumb, .article-detail-heading > div, .article-detail-heading > .article-cover');
          gsap.fromTo(heroTargets, { y: 10, opacity: .88 }, { y: 0, opacity: 1, duration: .68, stagger: .07, ease: 'power2.out', clearProps: 'transform,opacity' });
          scope.querySelectorAll<HTMLElement>('[data-article-reveal]').forEach(element => {
            gsap.fromTo(element, { y: 16, opacity: .84 }, {
              y: 0,
              opacity: 1,
              duration: .7,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: element, start: 'top 88%', once: true },
            });
          });
        }, scope);
        cleanup = () => motion.revert();
      });
    };
    capability.addEventListener('change', start);
    start();
    return () => { disposed = true; capability.removeEventListener('change', start); cleanup(); };
  }, [articlesIndex, articlesPage]);
  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: KeyboardEvent) { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } }
    function closeOutside(event: PointerEvent) { if (!header.current?.contains(event.target as Node)) setMenuOpen(false); }
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    return () => { document.removeEventListener('keydown', closeOnEscape); document.removeEventListener('pointerdown', closeOutside); };
  }, [menuOpen]);
  useEffect(() => {
    let lastY = Math.max(window.scrollY, 0);
    let lastDirection = 0;
    let distance = 0;

    function onScroll() {
      const y = Math.max(window.scrollY, 0);
      const change = y - lastY;
      lastY = y;

      if (y <= 120 || menuOpen || header.current?.querySelector(':focus-visible')) {
        setHeaderHidden(false);
        distance = 0;
        return;
      }

      if (Math.abs(change) < 1) return;
      const direction = Math.sign(change);
      distance = direction === lastDirection ? distance + Math.abs(change) : Math.abs(change);
      lastDirection = direction;
      if (distance >= 16) {
        setHeaderHidden(direction > 0);
        distance = 0;
      }
    }

    function onFocusIn(event: FocusEvent) {
      if (header.current?.contains(event.target as Node)) setHeaderHidden(false);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [menuOpen]);
  useEffect(() => {
    const hero = document.getElementById('hero-contact');
    const footer = document.getElementById('contact');
    if (!hero || !footer || !('IntersectionObserver' in window)) return;
    let heroPassed = false;
    let footerVisible = false;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) heroPassed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        if (entry.target === footer) footerVisible = entry.isIntersecting;
      }
      setStickyVisible(heroPassed && !footerVisible);
    });
    observer.observe(hero); observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  return <>
    <a className="skip-link" href="#main">رفتن به محتوای اصلی</a>
    {(home || webDesign || articlesPage) && <HeroContours/>}
    <header ref={header} className="header" data-hidden={headerHidden}>
      <nav className="nav glass liquid-glass" aria-label="ناوبری اصلی">
        <LiquidGlassMaterial/>
        <Brand href={home ? '#' : '/'}/>
        <div className="desktop-links">{navItems.map(({href,label,current,badge})=><a key={label} href={href} aria-current={current ? 'page' : undefined}>{label}{badge && <> <span className="nav-new">AI</span></>}</a>)}</div>
        <div className="nav-action"><Contact glass/><button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'}/></button></div>
      </nav>
      <nav id="mobile-menu" hidden={!menuOpen} className="mobile-menu glass" aria-label="منوی موبایل">{navItems.map(({href,label,current})=><a key={label} href={href} aria-current={current ? 'page' : undefined} onClick={()=>setMenuOpen(false)}>{label}<Icon name="arrow" size={16}/></a>)}</nav>
    </header>
    <main id="main">
      {request ? <RequestPage/> : articleDetail ? <ArticleDetailPage slug={articleSlug}/> : articlesIndex ? <ArticlesIndexPage/> : portfolio ? <PortfolioPage/> : webDesign ? <WebDesignPage /> : <div className="home-page">
      <section ref={heroRef} className="hero container" aria-labelledby="hero-title"><span className="hero-studio-mark" lang="en" dir="ltr" aria-hidden="true">PIXEL / 01</span><div className="hero-copy"><span className="eyebrow"><span className="blue-dot"/> یک شروع تازه برای کسب‌وکارت</span><h1 id="hero-title">کسب‌وکارت،<br/>یک <span className="blue-word">سایت حرفه‌ای<svg viewBox="0 0 340 16" preserveAspectRatio="none" aria-hidden="true"><path d="M3 12Q150-5 335 8"/></svg></span><br/>کم دارد.</h1><p className="hero-description">ایده و تخصص از تو؛ یک حضور حرفه‌ای در دنیای آنلاین از ما. سایتی می‌سازیم که کسب‌وکارت را درست معرفی کند و راه ارتباط با مشتری‌هایت باشد.</p><div className="hero-actions"><Contact className="primary" location="hero" id="hero-contact">درباره سایتم صحبت کنیم</Contact><a href="/request/" className="text-link">ثبت درخواست پروژه <Icon name="arrow" size={18}/></a></div><div className="hero-footnotes"><span><Icon name="check" size={16}/>طراحی متناسب با برند تو</span><span><Icon name="check" size={16}/>از اولین ایده تا انتشار</span></div></div>
      <div className="hero-art"><span className="hero-cobalt-shape" aria-hidden="true"/><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><span className="hero-path-node" aria-hidden="true"/><div className="floating-tag glass"><span className="tag-icon"><Icon name="layers" size={18}/></span><span>طراحی فکرشده.<br/><strong>برای کسب‌وکار تو.</strong></span><span className="tag-spark">✦</span></div><MockSite/><MockSite phone/><div className="responsive-tag glass"><span className="mini-devices" aria-hidden="true">▣</span><span>یک تجربه خوب،<br/><strong>در هر اندازه.</strong></span><span className="green-check"><Icon name="check" size={13}/></span></div><span className="demo-label">نمونه نمایشی طراحی پیکسل <span>↗</span></span></div>
      </section>
      <div className="principles container" data-home-reveal><span className="principles-title">جزئیاتی که تفاوت می‌سازند</span>{homePrinciples.map(({number,icon,label})=><span className="principle-item" key={number}><small>{number}</small><Icon name={icon}/>{label}</span>)}</div>
      <section id="websites" className="container section websites-section" data-home-reveal><div className="section-heading"><div><span className="eyebrow">۰۱ / طراحی و توسعه سایت</span><h2>فقط یک آدرس اینترنتی نیست.<br/><span className="muted">تصویر کسب‌وکار توست.</span></h2></div><p className="section-description">از اولین نگاه تا اولین تماس؛ هر بخش از سایت باید به مشتری کمک کند تو را بهتر بشناسد و قدم بعدی را راحت‌تر بردارد.</p></div>
        <div className="showcase"><div className="showcase-copy"><span className="showcase-pill"><span className="blue-dot"/> طراحی اختصاصی، برای داستان تو</span><h3>اولین برخورد.<br/>یک تأثیر ماندگار.</h3><p>یک سایت خوب، فقط زیبا نیست. خدماتت را واضح معرفی می‌کند، در موبایل راحت استفاده می‌شود و مشتری را به تو می‌رساند.</p><ul className="feature-list"><li><Icon name="check"/> معرفی روشن خدمات و هویت برند</li><li><Icon name="check"/> تجربه روان روی موبایل و دسکتاپ</li><li><Icon name="check"/> مسیر کوتاه از آشنایی تا تماس</li></ul><Contact glass className="showcase-contact" location="showcase">از سایت من شروع کنیم</Contact></div><div className="showcase-visual"><MockSite showcase/><div className="project-caption"><span><strong>آرا / استودیو معماری</strong><small>کانسپت نمایشی پیکسل · پروژه مشتری نیست</small></span><span className="project-arrow"><Icon name="arrow" size={21}/></span></div></div></div>
      </section>
      <section className="container deliverables-section" aria-labelledby="deliverables-title" data-home-reveal><div className="deliverables-head"><span className="eyebrow">خروجی روشن، از ابتدا</span><h2 id="deliverables-title">در پایان چه چیزی<br/><span>تحویل می‌گیری؟</span></h2><p>چیزهایی که برای یک شروع حرفه‌ای لازم داری؛ مشخص، قابل استفاده و آماده برای انتشار.</p></div><div className="deliverables-list">{projectDeliverables.map(item=><article className="deliverable-item" key={item.number}><span className="deliverable-icon"><Icon name={item.icon} size={20}/></span><span className="deliverable-number" aria-hidden="true">{item.number}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></section>
      <section id="process" className="container section process-section" data-home-reveal><div className="process-heading"><span className="eyebrow">۰۲ / مسیر همکاری</span><h2>از «یک ایده دارم»<br/>تا «این سایتِ منه».</h2><p className="section-description">قدم‌به‌قدم، با یک مسیر روشن.</p></div><div className="process-steps"><span className="process-track" aria-hidden="true"><i className="process-track-fill"/></span>{[
        ['۰۱','اول، کسب‌وکارت را می‌شناسیم.','درباره مخاطب، خدمات و انتظارت از سایت صحبت می‌کنیم تا مسئله درست را حل کنیم.'],
        ['۰۲','بعد، ایده را به تجربه تبدیل می‌کنیم.','ساختار، ظاهر و امکانات سایت را طراحی و توسعه می‌دهیم؛ متناسب با نیاز و هویت برندت.'],
        ['۰۳','و برای دیده‌شدن آماده می‌شویم.','نمایش در موبایل، محتوا و مسیرهای ارتباطی را بررسی می‌کنیم تا سایت برای انتشار آماده باشد.']
      ].map(([number,title,description])=><article className="process-step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
      <AgentSection/>
      <section id="faq" className="container section faq-section" data-home-reveal><div className="faq-heading"><span className="eyebrow">قبل از شروع</span><h2>شاید سؤال تو<br/><span className="muted">هم همین باشد.</span></h2><p className="section-description">اگر سؤال دیگری داری،<br/>در واتساپ درباره‌اش صحبت کنیم.</p><Contact glass className="faq-contact" location="faq" service="خدمات پیکسل">از ما بپرس</Contact></div><div className="faq-list">{faqs.map(([question,answer],index)=><details key={question}><summary><span className="faq-index">{String(index+1).padStart(2,'0')}</span><span>{question}</span><Icon name="plus" size={18}/></summary><p>{answer}</p></details>)}</div></section>
      <section id="contact" className="container contact-section" data-home-reveal><div className="closing-card"><div className="closing-orbit" aria-hidden="true"/><span className="eyebrow"><span className="blue-dot"/> یک گفتگو، شروع یک اتفاق خوب</span><h2>از سایت کسب‌وکارت<br/><span>شروع کنیم.</span></h2><p>بگو چه کاری می‌کنی و چه چیزی در ذهن داری.<br/>قدم بعدی را با هم پیدا می‌کنیم.</p><Contact className="primary" location="closing">بیا درباره‌اش حرف بزنیم</Contact><span className="closing-channel"><Icon name="chat" size={14}/> گفتگو در واتساپ پیکسل</span></div></section>
      </div>}
    </main>
    <footer className="container footer"><div className="footer-top"><Brand href={home ? '#' : '/'}/><p>طراحی برای امروز. هوشمند برای فردا.</p><a className="back-top" href="#">بازگشت به بالا <Icon name="arrow" size={15}/></a></div><div className="footer-bottom"><span>پیکسل؛ طراحی سایت و ایجنت‌های هوش مصنوعی</span><a href="https://wa.me/989937825753" target="_blank" rel="noopener noreferrer" data-contact-location="footer" data-contact-service="عمومی"><span>واتساپ</span> <bdi>+98 993 782 5753</bdi></a><span lang="en" dir="ltr">Made with purpose. Built by Pixel.</span></div></footer>
    {stickyVisible && <aside className="sticky-contact glass" aria-label="گفتگو درباره طراحی سایت"><span>{webDesign ? 'مشاوره رایگان طراحی سایت' : 'یک شروع حرفه‌ای'}{!webDesign && <><br/><small>برای کسب‌وکار تو</small></>}</span><Contact className="primary" location={webDesign ? 'web-design-mobile-sticky' : 'sticky'} service={webDesign ? 'طراحی سایت و مشاوره اولیه رایگان' : 'طراحی سایت'}>{webDesign ? 'شروع گفتگو' : 'گفتگو در واتساپ'}</Contact></aside>}
  </>;
}




