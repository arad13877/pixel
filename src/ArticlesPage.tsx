import { Contact } from './Contact';
import { Icon } from './Icons';
import { articles, getArticle, type ArticleRecord } from './articles.generated';

export function ArticleCover({ article, compact = false }: { article: ArticleRecord; compact?: boolean }) {
  if (article.coverData?.kind === 'image') return <figure className={`article-cover article-cover-image${compact ? ' is-compact' : ''}`}>
    <img src={article.coverData.url} alt={article.coverData.alt} loading={compact ? 'lazy' : 'eager'}/>
  </figure>;
  return <div className={`article-cover article-cover-${article.cover}${compact ? ' is-compact' : ''}`} aria-hidden="true">
    <span className="article-cover-grid"/>
    <span className="article-cover-ring orbit-a"/><span className="article-cover-ring orbit-b"/>
    <span className="article-cover-code" data-code={article.cover === 'signal' ? 'WEB / 01' : article.cover === 'layers' ? 'VALUE / 02' : 'AGENT / 03'}/>
    <span className="article-cover-mark"><i/><i/><i/><i/></span>
    <span className="article-cover-node node-a"/><span className="article-cover-node node-b"/><span className="article-cover-node node-c"/>
  </div>;
}

function ArticleMeta({ article }: { article: ArticleRecord }) {
  return <div className="article-meta"><span>{article.category}</span><time dateTime={article.publishedAt}>{article.publishedLabel}</time><span>{article.readingMinutes}</span></div>;
}

function ArticleCard({ article, compact = false }: { article: ArticleRecord; compact?: boolean }) {
  return <article className={`article-card${compact ? ' article-card-compact' : ''}`} data-article-reveal>
    <a href={`/articles/${article.slug}/`} aria-label={`مطالعه مقاله: ${article.title}`}><ArticleCover article={article} compact={compact}/></a>
    <div className="article-card-copy"><ArticleMeta article={article}/><h2><a href={`/articles/${article.slug}/`}>{article.title}</a></h2><p>{article.excerpt}</p><a className="article-read-link" href={`/articles/${article.slug}/`}>مطالعه مقاله <Icon name="arrow" size={17}/></a></div>
  </article>;
}

export function ArticlesIndexPage() {
  const [featured, ...rest] = articles;
  return <div className="articles-page">
    <section className="container articles-hero" aria-labelledby="articles-title">
      <span className="articles-studio-mark" aria-hidden="true">PIXEL / JOURNAL</span>
      <div><span className="articles-eyebrow"><span/> مجله پیکسل</span><h1 id="articles-title">ایده‌هایی برای ساختن کسب‌وکاری که <span>بهتر دیده می‌شود.</span></h1></div>
      <p>راهنماهای روشن و کاربردی درباره طراحی سایت، رشد آنلاین و ایجنت‌های هوش مصنوعی؛ برای تصمیم‌هایی که باید پیش از انتخاب ابزار و اجرا بگیری.</p>
    </section>
    <main className="container articles-list" aria-label="فهرست مقالات">
      <ArticleCard article={featured}/>
      <div className="articles-secondary">{rest.map(article=><ArticleCard key={article.slug} article={article} compact/>)}</div>
    </main>
    <section id="contact" className="container contact-section articles-contact" data-article-reveal aria-labelledby="articles-contact-title"><div className="closing-card"><div className="closing-orbit" aria-hidden="true"/><span className="articles-eyebrow"><span/> از دانستن تا ساختن</span><h2 id="articles-contact-title">ایده‌ات را به یک<br/><span>قدم واقعی تبدیل کنیم.</span></h2><p>اگر برای سایت یا یک ایجنت اختصاصی سؤال داری، مستقیم با پیکسل گفتگو کن.</p><Contact className="primary" location="articles-final" service="خدمات پیکسل">شروع گفتگو</Contact></div></section>
  </div>;
}

export function ArticleDetailPage({ slug }: { slug?: string }) {
  const article = getArticle(slug);
  const related = articles.filter(item => item.slug !== article.slug);
  return <ArticleDetailContent article={article} related={related}/>;
}

export function ArticleDetailContent({ article, related = [] }: { article: ArticleRecord; related?: ArticleRecord[] }) {
  return <div className="article-detail-page">
    <header className="container article-detail-hero">
      <nav className="article-breadcrumb" aria-label="مسیر صفحه"><a href="/">پیکسل</a><Icon name="chevron" size={14}/><a href="/articles/">مقالات</a><Icon name="chevron" size={14}/><span aria-current="page">{article.category}</span></nav>
      <div className="article-detail-heading"><div><ArticleMeta article={article}/><h1>{article.title}</h1><p>{article.excerpt}</p><div className="article-author"><span className="article-author-mark" aria-hidden="true"><i/><i/><i/><i/></span><span><strong>{article.authorName || 'تحریریه پیکسل'}</strong><small>{article.authorSubtitle || 'راهنمای عملی برای تصمیم بهتر'}</small></span></div></div><ArticleCover article={article}/></div>
    </header>

    <main className="container article-layout">
      <aside className="article-toc" aria-label="فهرست مطالب"><span>در این مقاله</span><ol>{article.sections.map(section=><li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></aside>
      <article className="article-body">
        {article.sections.map((section,index)=><section id={section.id} key={section.id} data-article-reveal><span className="article-section-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><h2>{section.title}</h2>{section.paragraphs.map((paragraph,paragraphIndex)=><p key={paragraphIndex}>{paragraph}</p>)}{section.bullets&&<ul>{section.bullets.map(item=><li key={item}><Icon name="check" size={16}/><span>{item}</span></li>)}</ul>}{section.callout&&<blockquote><Icon name="spark" size={18}/><p>{section.callout}</p></blockquote>}</section>)}
        <section className="article-sources" aria-labelledby="article-sources-title"><span className="article-section-number" aria-hidden="true">—</span><h2 id="article-sources-title">منابع و مطالعه بیشتر</h2><p>برای دقت بیشتر، مفاهیم فنی این راهنما با منابع اصلی زیر بررسی شده‌اند.</p><ul>{article.sources.map(source=><li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}<Icon name="arrow" size={15}/></a></li>)}</ul></section>
        <section className="article-inline-cta" aria-labelledby="article-cta-title"><span className="article-inline-kicker">قدم بعدی</span><h2 id="article-cta-title">{article.ctaTitle}</h2><p>{article.ctaText}</p><Contact className="primary" location={article.ctaLocation} service={article.ctaService}>{article.ctaLabel}</Contact></section>
      </article>
    </main>

    {related.length > 0 && <section className="container related-articles" aria-labelledby="related-title"><div className="related-heading"><span>ادامه مسیر</span><h2 id="related-title">مقاله‌های مرتبط</h2></div><div>{related.map(item=><ArticleCard key={item.slug} article={item} compact/>)}</div></section>}
  </div>;
}
