import type { ReactNode } from 'react';
import { Icon } from './Icons';
import LiquidGlassMaterial from './LiquidGlassMaterial';
import { site, whatsappUrl, contactMessage } from './site';

export function Contact({ children = 'شروع گفتگو', className = '', location = 'header', service = 'طراحی سایت', id, glass = false }: { children?: ReactNode; className?: string; location?: string; service?: string; id?: string; glass?: boolean }) {
  const href = whatsappUrl(site.whatsappNumber, contactMessage(service));
  const buttonClass = `button ${className}${glass ? ' liquid-glass' : ''}`;
  const content = <>{glass && <LiquidGlassMaterial/>}<span>{children}</span><Icon name="arrow" size={18}/></>;
  function trackClick() {
    window.dispatchEvent(new CustomEvent('pixel:contact-click', { detail: { location, service, channel: 'whatsapp' } }));
  }
  return href ? <a id={id} className={buttonClass} href={href} target="_blank" rel="noopener noreferrer" data-contact-location={location} data-contact-service={service} onClick={trackClick}>{content}</a> : <span className="contact-wrap"><button id={id} className={buttonClass} disabled aria-describedby={`${location}-unavailable`}>{content}</button><span id={`${location}-unavailable`} className="contact-note">واتساپ به‌زودی فعال می‌شود</span></span>;
}
