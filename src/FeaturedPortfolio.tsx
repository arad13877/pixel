import PortfolioCard from './PortfolioCard';
import { portfolioItems } from './portfolio.generated';
import { portfolioFixtures } from './portfolio-data';
import { Icon } from './Icons';

// These two local demos remain available even when the published archive changes.
const featuredItems = ['/portfolio/roma/', '/portfolio/gorgan-khaneh/'].map(link =>
  portfolioItems.find(item => item.payload.link === link) ?? portfolioFixtures.find(item => item.payload.link === link)!
);

export default function FeaturedPortfolio() {
  return <section id="featured-projects" className="container featured-portfolio" aria-labelledby="featured-projects-title">
    <div className="featured-portfolio-heading">
      <div><span className="eyebrow">نمونه طراحی‌های پیکسل</span><h2 id="featured-projects-title">طراحی را در عمل ببین.</h2><p>دو کانسپت نمایشی برای کافه و املاک؛ با امکان مشاهده و تجربهٔ کامل سایت.</p></div>
      <a className="text-link" href="/portfolio/">همه نمونه‌کارها <Icon name="arrow" size={18}/></a>
    </div>
    <div className="featured-portfolio-grid">{featuredItems.map((item, index) => <PortfolioCard key={item.id} item={item} index={index} headingLevel={3} lazy/>)}</div>
  </section>;
}
