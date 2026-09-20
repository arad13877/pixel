import { useRef, useState, type KeyboardEvent } from 'react';
import { agents } from './content';
import { Icon } from './Icons';
import { Contact } from './Contact';

export default function AgentSection() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function onKeyDown(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === 'ArrowLeft') next = (index + 1) % agents.length;
    else if (event.key === 'ArrowRight') next = (index + agents.length - 1) % agents.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = agents.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
  }
  return <section id="agents" className="agents-section section" data-home-reveal>
    <div className="container"><div className="agent-intro"><span className="eyebrow"><Icon name="spark" size={16}/> قدم بعدی، هوشمندتر کار کردن</span><h2>سایتت ساخته شد.<br/><span className="muted">حالا وقتِ سبک‌تر کردن کارهاست.</span></h2><p className="section-description">ایجنت‌هایی که واقعاً برای کسب‌وکارت کار می‌کنند؛ به ابزارهایت متصل می‌شوند، داده‌ها را تحلیل می‌کنند و کارهای مشخصی را انجام می‌دهند.</p><span className="english-signature" lang="en" dir="ltr">AI Agents that actually work for your business.</span></div>
    <div className="agent-workspace">
      <div className="agent-tabs" role="tablist" aria-label="انتخاب نوع ایجنت">{agents.map((item,index)=><button key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={selected===index} aria-controls={`panel-${item.id}`} tabIndex={selected===index?0:-1} ref={node=>{tabs.current[index]=node;}} onClick={()=>setSelected(index)} onKeyDown={event=>onKeyDown(event,index)}><Icon name={item.icon} size={19}/><span>{item.title}</span></button>)}</div>
      {agents.map((agent,index)=><div id={`panel-${agent.id}`} role="tabpanel" aria-labelledby={`tab-${agent.id}`} tabIndex={0} className="agent-panel" key={agent.id} hidden={selected !== index}>
        <div className="agent-panel-copy"><span className="agent-type" dir="ltr" lang="en">{agent.english}<span className="blue-dot"/></span><h3>{agent.headline}</h3><p>{agent.description}</p><Contact glass className="agent-contact" location={`agent-${agent.id}`} service={agent.title}>درباره این ایجنت صحبت کنیم</Contact></div>
        <div className="workflow"><div className="workflow-top"><span><span className="workflow-dot"/> مسیر یک کار، از ابتدا تا نتیجه</span><span className="sample-badge">نمونه نمایشی</span></div><div className="flow-step"><span className="flow-icon"><Icon name="layers"/></span><span><small>ورودی</small><strong>{agent.input}</strong></span><span className="flow-number">01</span></div><div className="flow-connector"><span/></div><div className="flow-step active"><span className="flow-icon"><Icon name={agent.icon}/></span><span><small>پردازش توسط ایجنت</small><strong>{agent.action}</strong></span><span className="flow-number">02</span></div><div className="flow-connector"><span/></div><div className="flow-step"><span className="flow-icon result"><Icon name="check"/></span><span><small>خروجی</small><strong>{agent.output}</strong></span><span className="flow-number">03</span></div><p className="workflow-note">{agent.note}</p></div>
      </div>)}
    </div><p className="agent-footnote"><Icon name="plus" size={14}/> از سایت، CRM یا ابزارهای تیم تو؛ نقطه شروع هر ایجنت، نیاز کسب‌وکار توست.</p>
    <noscript><div className="noscript-agents">{agents.slice(1).map(item=><article key={item.id}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></noscript>
    </div>
  </section>;
}
