import { Contact } from './Contact';
import { Icon } from './Icons';
import { featuredPricingPlans, formatPlanPrice, pricingPlans, type PricingPlan } from './pricing';

export function PricingCard({ plan, compact, location, index = pricingPlans.indexOf(plan) + 1, service = `پلن ${plan.title} طراحی سایت`, priceLabel }: { plan: PricingPlan; compact: boolean; location: string; index?: number; service?: string; priceLabel?: string }) {
  return <article className={`pricing-card${plan.id === 'corporate' ? ' pricing-card-featured' : ''}`}>
    <div className="pricing-card-top"><span className="pricing-card-index" aria-hidden="true">{String(index).padStart(2, '0')}</span><span className="pricing-card-audience">{plan.audience}</span></div>
    <h3>{plan.title}</h3>
    <p className="pricing-card-scope">{plan.scope}</p>
    <div className="pricing-card-price">{plan.priceMillions !== null && <small>شروع از</small>}<strong>{priceLabel || formatPlanPrice(plan)}</strong></div>
    <ul>{(compact ? plan.features.slice(0, 3) : plan.features).map(feature => <li key={feature}><Icon name="check" size={16}/><span>{feature}</span></li>)}</ul>
    {!compact && <p className="pricing-card-limit">{plan.limit}</p>}
    <Contact className={plan.id === 'corporate' ? 'primary' : ''} location={`${location}-${plan.id}`} service={service}>مشاوره درباره این پلن</Contact>
  </article>;
}

export function PricingCards({ compact = false, location }: { compact?: boolean; location: string }) {
  const plans = compact ? featuredPricingPlans : pricingPlans;
  return <div className="pricing-grid">{plans.map(plan => <PricingCard key={plan.id} plan={plan} compact={compact} location={location}/>)}</div>;
}

export function PricingPreview({ location, headingId }: { location: string; headingId: string }) {
  return <section className="pricing-preview container" aria-labelledby={headingId}>
    <div className="pricing-preview-heading"><div><span className="wd-section-index">تعرفه‌های طراحی سایت</span><h2 id={headingId}>یک شروع روشن،<br/><span>متناسب با نیاز تو.</span></h2></div><p>این قیمت‌ها نقطهٔ شروع‌اند. هزینهٔ نهایی پس از بررسی صفحات، امکانات و محتوای پروژه مشخص می‌شود.</p></div>
    <PricingCards compact location={location}/>
    <div className="pricing-preview-bottom"><a href="/pricing/" className="button pricing-all-link">مشاهده همه تعرفه‌ها <Icon name="arrow" size={18}/></a></div>
  </section>;
}
