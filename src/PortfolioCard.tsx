import ResponsiveImage from './ResponsiveImage';
import { Icon } from './Icons';
import type { PublishedPortfolioItem } from './portfolio-data';

export default function PortfolioCard({ item, index, headingLevel = 2, lazy = index > 0 }: { item: PublishedPortfolioItem; index: number; headingLevel?: 2 | 3; lazy?: boolean }) {
  const { payload } = item;
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const relatedService = payload.link === '/portfolio/nilora/' ? { href: '/web-design-doctors-gorgan/', label: 'طراحی سایت پزشکان در گرگان' } : payload.link === '/portfolio/roma/' ? { href: '/web-design-restaurant-gorgan/', label: 'طراحی سایت رستوران در گرگان' } : { href: '/web-design/', label: 'خدمات طراحی سایت' };
  const headingId = `portfolio-${item.id}-title`;
  return <article className={`portfolio-project${payload.theme === 'sand' ? ' portfolio-project-fashion' : ''}${payload.theme === 'carbon' ? ' portfolio-project-carbon' : ''}${payload.theme === 'coffee' ? ' portfolio-project-coffee' : ''}${payload.theme === 'estate' ? ' portfolio-project-estate' : ''}${item.kind === 'client' ? ' portfolio-project-client' : ''}`} aria-labelledby={headingId}>
    <a className="portfolio-project-visual" href={payload.link} aria-label={`مشاهده ${item.kind === 'concept' ? 'لندینگ نمایشی' : 'نمونه‌کار'} ${payload.title}`}>
      <ResponsiveImage src={payload.imagePath} alt={payload.imageAlt} width={payload.imageWidth} height={payload.imageHeight} loading={lazy ? 'lazy' : undefined}/>
      {payload.label && <span className="portfolio-project-visual-label" lang="en" dir="ltr">{payload.label}</span>}
    </a>
    <div className="portfolio-project-copy">
      <span className="portfolio-project-index">{new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 }).format(index + 1)} / {payload.service}</span>
      {item.kind === 'concept' && <span className="portfolio-demo-badge">{payload.conceptNote}</span>}
      <Heading id={headingId}>{payload.title}{payload.subtitle && <><br/><span>{payload.subtitle}</span></>}</Heading>
      {payload.description && <p>{payload.description}</p>}
      <a className="portfolio-project-link" href={payload.link}>{item.kind === 'concept' ? 'مشاهده لندینگ' : 'مشاهده نمونه‌کار'} <Icon name="arrow" size={18}/></a>
      <a className="portfolio-project-link" href={relatedService.href}>{relatedService.label} <Icon name="arrow" size={18}/></a>
    </div>
  </article>;
}
