import { Contact } from './Contact';
import { Icon } from './Icons';
import { site } from './site';

function trackChannel(channel: 'telegram' | 'bale') {
  window.dispatchEvent(new CustomEvent('pixel:contact-click', { detail: { location: `contact-${channel}`, service: 'گفتگو با پیکسل', channel } }));
}

export default function ContactPage() {
  return <div className="contact-page">
    <section className="container contact-page-intro" aria-labelledby="contact-page-title">
      <span className="eyebrow"><span className="blue-dot"/> گفتگو با پیکسل</span>
      <h1 id="contact-page-title">ارتباط با ما</h1>
      <p>برای گفتگو درباره طراحی سایت، سئو یا ایجنت‌های هوش مصنوعی، از پیام‌رسانی که راحت‌تری با پیکسل ارتباط بگیر.</p>
    </section>
    <section className="container contact-channels" aria-label="راه‌های ارتباط با پیکسل">
      <article className="contact-channel" aria-labelledby="contact-whatsapp-title">
        <span className="contact-channel-icon"><Icon name="chat" size={26}/></span>
        <h2 id="contact-whatsapp-title">واتساپ</h2>
        <bdi className="contact-channel-address" dir="ltr">۰۹۹۳۷۸۲۵۷۵۳</bdi>
        <Contact className="primary" location="contact-whatsapp" service="گفتگو با پیکسل">گفتگو در واتساپ</Contact>
      </article>
      <article className="contact-channel" aria-labelledby="contact-telegram-title">
        <span className="contact-channel-icon"><Icon name="chat" size={26}/></span>
        <h2 id="contact-telegram-title">تلگرام</h2>
        <bdi className="contact-channel-address" dir="ltr">۰۹۹۳۷۸۲۵۷۵۳</bdi>
        <a className="button contact-channel-link" href={site.telegramUrl} target="_blank" rel="noopener noreferrer" data-contact-location="contact-telegram" data-contact-service="گفتگو با پیکسل" onClick={() => trackChannel('telegram')}><span>گفتگو در تلگرام</span><Icon name="arrow" size={18}/></a>
      </article>
      <article className="contact-channel" aria-labelledby="contact-bale-title">
        <span className="contact-channel-icon"><Icon name="chat" size={26}/></span>
        <h2 id="contact-bale-title">بله</h2>
        <bdi className="contact-channel-address" dir="ltr">@aradlll</bdi>
        <a className="button contact-channel-link" href={site.baleUrl} target="_blank" rel="noopener noreferrer" data-contact-location="contact-bale" data-contact-service="گفتگو با پیکسل" onClick={() => trackChannel('bale')}><span>گفتگو در بله</span><Icon name="arrow" size={18}/></a>
      </article>
    </section>
  </div>;
}
