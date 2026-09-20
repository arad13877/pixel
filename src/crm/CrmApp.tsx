import { createContext, FormEvent, lazy, ReactNode, Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import LiquidGlassMaterial from '../LiquidGlassMaterial';
import { Icon, type IconName } from '../Icons';
import { formatPersianDate, tehranDayBounds, tehranDueIso, toPersianNumber } from './format';
import { invokeFunction, isSupabaseConfigured, requireSupabase, supabase } from './supabase';
import type { Activity, CompanyRecord, ContactRecord, LeadSubmission, Membership, Opportunity, PipelineStage, Role, ServiceType, TimelineEvent } from './types';
import { serviceLabels } from './types';

type AuthState = { loading: boolean; session: Session | null; membership: Membership | null; preview: boolean; error: string };
type CrmContextValue = { membership: Membership; preview: boolean; refreshKey: number; refresh(): void };
const CrmContext = createContext<CrmContextValue | null>(null);
const PersianDatePicker = lazy(() => import('./date').then(module => ({ default: module.PersianDatePicker })));

const navigation: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'داشبورد', icon: 'layers', end: true },
  { to: '/inbox', label: 'ورودی‌ها', icon: 'chat' },
  { to: '/pipeline', label: 'فروش', icon: 'sales' },
  { to: '/contacts', label: 'مخاطبان', icon: 'support' },
  { to: '/companies', label: 'کسب‌وکارها', icon: 'globe' },
  { to: '/tasks', label: 'پیگیری‌ها', icon: 'check' },
];

function useCrm() {
  const value = useContext(CrmContext);
  if (!value) throw new Error('CRM context is unavailable');
  return value;
}

function useAuth(): AuthState {
  const preview = ['127.0.0.1','localhost'].includes(location.hostname) && new URLSearchParams(location.search).get('preview') === 'empty';
  const [state, setState] = useState<AuthState>(() => preview ? {
    loading: false, session: null, preview: true, error: '',
    membership: { workspace_id: '00000000-0000-0000-0000-000000000001', user_id: 'preview', role: 'admin', is_active: true, profile: { full_name: 'پیش‌نمایش خالی', email: 'preview@local' } },
  } : { loading: true, session: null, membership: null, preview: false, error: '' });

  useEffect(() => {
    if (preview) return;
    if (!supabase) { setState(current => ({ ...current, loading: false })); return; }
    let active = true;
    async function resolveMembership(session: Session | null) {
      if (!active) return;
      if (!session) { setState({ loading: false, session: null, membership: null, preview: false, error: '' }); return; }
      const { data, error } = await supabase!.from('workspace_members').select('workspace_id,user_id,role,is_active,profile:profiles(full_name,email)').eq('user_id', session.user.id).maybeSingle();
      if (!active) return;
      if (error) setState({ loading: false, session, membership: null, preview: false, error: 'دسترسی حساب قابل بررسی نیست.' });
      else setState({ loading: false, session, membership: data as unknown as Membership | null, preview: false, error: '' });
    }
    void supabase.auth.getSession().then(({ data }) => resolveMembership(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { void resolveMembership(session); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [preview]);
  return state;
}

export default function CrmApp() {
  const auth = useAuth();
  if (auth.loading) return <FullPageState title="در حال آماده‌سازی پنل…" loading/>;
  return <Routes>
    <Route path="/login" element={auth.session || auth.preview ? <Navigate to="/" replace/> : <LoginPage configured={isSupabaseConfigured}/>}/>
    <Route path="/auth/callback" element={<AuthCallback/>}/>
    <Route element={auth.membership?.is_active ? <ProtectedShell membership={auth.membership} preview={auth.preview}/> : <AccessGate auth={auth}/> }>
      <Route index element={<Dashboard/>}/>
      <Route path="inbox" element={<Inbox/>}/>
      <Route path="pipeline" element={<Pipeline/>}/>
      <Route path="contacts" element={<Directory kind="contacts"/>}/>
      <Route path="contacts/:id" element={<RecordDetail kind="contacts"/>}/>
      <Route path="companies" element={<Directory kind="companies"/>}/>
      <Route path="companies/:id" element={<RecordDetail kind="companies"/>}/>
      <Route path="tasks" element={<Tasks/>}/>
      <Route path="settings/team" element={<AdminOnly><TeamSettings/></AdminOnly>}/>
      <Route path="settings/pipeline" element={<AdminOnly><PipelineSettings/></AdminOnly>}/>
      <Route path="settings/archive" element={<AdminOnly><ArchiveSettings/></AdminOnly>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}

function LoginPage({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setStatus('sending');
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: `${location.origin}/auth/callback` } });
    if (error) { setStatus('error'); setMessage('ارسال لینک ورود انجام نشد. ایمیل یا تنظیمات ورود را بررسی کن.'); }
    else { setStatus('sent'); setMessage('لینک یک‌بارمصرف ورود به ایمیل شما ارسال شد.'); }
  }
  return <main className="login-page"><section className="login-card" aria-labelledby="login-title">
    <a className="crm-brand login-brand" href="https://pxlgrid.design/" aria-label="بازگشت به سایت پیکسل"><span className="crm-brand-mark"><i/><i/><i/><i/></span><span>پیکسل<small>PIXEL CRM</small></span></a>
    <span className="login-kicker">پنل داخلی تیم</span><h1 id="login-title">ورود به CRM پیکسل</h1><p>ایمیل دعوت‌شده را وارد کن. لینک امن و یک‌بارمصرف برایت ارسال می‌شود.</p>
    {!configured ? <div className="notice warning" role="status">اتصال Supabase هنوز تنظیم نشده است. متغیرهای محیطی پروژه CRM را اضافه کنید.</div> : <form onSubmit={submit}><label>ایمیل کاری<input className="crm-field" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required dir="ltr" placeholder="name@example.com"/></label><button className="crm-primary" disabled={status === 'sending'}>{status === 'sending' ? 'در حال ارسال…' : 'ارسال لینک ورود'}</button></form>}
    <p className={`login-status ${status}`} role="status" aria-live="polite">{message}</p><a className="login-back" href="https://pxlgrid.design/">بازگشت به سایت پیکسل</a>
  </section></main>;
}

function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => { const timer = window.setTimeout(() => navigate('/', { replace: true }), 900); return () => clearTimeout(timer); }, [navigate]);
  return <FullPageState title="در حال تکمیل ورود…" loading/>;
}

function AccessGate({ auth }: { auth: AuthState }) {
  if (!auth.session && !auth.preview) return <Navigate to="/login" replace/>;
  return <FullPageState title={auth.error || 'این حساب عضو فعال تیم پیکسل نیست.'} action={<button className="crm-secondary" onClick={() => supabase?.auth.signOut()}>خروج از حساب</button>}/>;
}

function FullPageState({ title, loading, action }: { title: string; loading?: boolean; action?: ReactNode }) {
  return <main className="full-state"><div>{loading && <span className="spinner" aria-hidden="true"/>}<h1>{title}</h1>{action}</div></main>;
}

function ProtectedShell({ membership, preview }: { membership: Membership; preview: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close);
  }, [mobileOpen]);
  const value = useMemo(() => ({ membership, preview, refreshKey, refresh: () => setRefreshKey(key => key + 1) }), [membership, preview, refreshKey]);
  return <CrmContext.Provider value={value}><div className="crm-shell">
    <aside className={`crm-sidebar ${mobileOpen ? 'open' : ''}`} aria-label="ناوبری پنل">
      <a className="crm-brand" href="/"><span className="crm-brand-mark"><i/><i/><i/><i/></span><span>پیکسل<small>PIXEL CRM</small></span></a>
      <nav>{navigation.map(item => <NavLink key={item.to} to={item.to} end={item.end}><Icon name={item.icon} size={19}/><span>{item.label}</span></NavLink>)}</nav>
      <div className="sidebar-settings"><span>مدیریت</span>{membership.role === 'admin' && <><NavLink to="/settings/team"><Icon name="support" size={18}/>تیم</NavLink><NavLink to="/settings/pipeline"><Icon name="layers" size={18}/>مراحل فروش</NavLink><NavLink to="/settings/archive"><Icon name="search" size={18}/>آرشیو</NavLink></>}</div>
      <div className="sidebar-user"><span className="avatar">{(membership.profile?.full_name || membership.profile?.email || 'پ').slice(0,1)}</span><span><strong>{membership.profile?.full_name || 'عضو تیم'}</strong><small>{membership.role === 'admin' ? 'مدیر' : 'عضو'}</small></span></div>
    </aside>
    {mobileOpen && <button className="sidebar-scrim" aria-label="بستن منو" onClick={() => setMobileOpen(false)}/>} 
    <div className="crm-workspace">
      <header className="crm-topbar liquid-glass"><LiquidGlassMaterial/><div><button className="mobile-nav-toggle" aria-label={mobileOpen ? 'بستن منو' : 'باز کردن منو'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(open => !open)}><Icon name={mobileOpen ? 'close' : 'menu'}/></button><span className="topbar-date">{formatPersianDate(new Date().toISOString())}</span></div><div className="topbar-actions"><NavLink to="/tasks" className="topbar-task"><Icon name="check" size={18}/>پیگیری‌ها</NavLink><button className="topbar-logout" onClick={() => supabase?.auth.signOut()} aria-label="خروج از حساب"><Icon name="arrow" size={18}/></button></div></header>
      {preview && <div className="preview-banner">پیش‌نمایش توسعه با داده خالی — این حالت در نسخه تولیدی فعال نیست.</div>}
      <main id="crm-main" className="crm-main"><Outlet/></main>
      <nav className="mobile-bottom-nav" aria-label="ناوبری موبایل">{navigation.slice(0,4).map(item => <NavLink key={item.to} to={item.to} end={item.end}><Icon name={item.icon} size={19}/><span>{item.label}</span></NavLink>)}<button onClick={() => setMobileOpen(true)}><Icon name="menu" size={19}/><span>بیشتر</span></button></nav>
    </div>
  </div></CrmContext.Provider>;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-header"><div><span>{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-action">{action}</div>}</div>;
}

function AdminOnly({ children }: { children: ReactNode }) {
  const { membership } = useCrm();
  return membership.role === 'admin' ? children : <EmptyState title="دسترسی محدود" text="این بخش فقط برای مدیر CRM در دسترس است."/>;
}

function useRows<T>(loader: () => Promise<T[]>, deps: unknown[] = []) {
  const { preview, refreshKey } = useCrm();
  const [rows, setRows] = useState<T[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    if (preview) { setRows([]); setLoading(false); return; }
    void loader().then(data => { if (active) setRows(data); }).catch(() => { if (active) setError('دریافت اطلاعات انجام نشد. دوباره تلاش کنید.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  // loader is intentionally supplied at call sites with primitive dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, refreshKey, ...deps]);
  return { rows, loading, error };
}

function DataState({ loading, error, children }: { loading: boolean; error: string; children: ReactNode }) {
  if (loading) return <div className="skeleton-list" aria-label="در حال بارگذاری"><i/><i/><i/></div>;
  if (error) return <div className="notice error" role="alert">{error}</div>;
  return children;
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <section className="empty-state"><span><Icon name="spark" size={22}/></span><h2>{title}</h2><p>{text}</p>{action}</section>;
}

function Dashboard() {
  const { membership, preview, refreshKey } = useCrm();
  const [stats, setStats] = useState({ leads: 0, opportunities: 0, value: 0, due: 0, overdue: 0, conversion: 0 });
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => {
    if (preview) { setLoading(false); return; }
    let active = true;
    async function load() {
      const db = requireSupabase(); const { start, end } = tehranDayBounds();
      const [leads, open, values, due, overdue, won, closed] = await Promise.all([
        db.from('lead_submissions').select('*',{count:'exact',head:true}).eq('workspace_id',membership.workspace_id).eq('status','new'),
        db.from('opportunities').select('*',{count:'exact',head:true}).eq('workspace_id',membership.workspace_id).eq('status','open').is('archived_at',null),
        db.from('opportunities').select('estimated_value').eq('workspace_id',membership.workspace_id).eq('status','open').is('archived_at',null),
        db.from('activities').select('*',{count:'exact',head:true}).eq('workspace_id',membership.workspace_id).eq('status','planned').gte('due_at',start.toISOString()).lt('due_at',end.toISOString()),
        db.from('activities').select('*',{count:'exact',head:true}).eq('workspace_id',membership.workspace_id).eq('status','planned').lt('due_at',start.toISOString()),
        db.from('opportunities').select('*',{count:'exact',head:true}).eq('workspace_id',membership.workspace_id).eq('status','won'),
        db.from('opportunities').select('*',{count:'exact',head:true}).eq('workspace_id',membership.workspace_id).in('status',['won','lost']),
      ]);
      const firstError = [leads,open,values,due,overdue,won,closed].find(result => result.error)?.error; if (firstError) throw firstError;
      if (active) setStats({ leads: leads.count || 0, opportunities: open.count || 0, value: (values.data || []).reduce((sum,row) => sum + Number(row.estimated_value || 0),0), due: due.count || 0, overdue: overdue.count || 0, conversion: closed.count ? Math.round(((won.count || 0)/closed.count)*100) : 0 });
    }
    setLoading(true); setError(''); void load().catch(() => setError('داشبورد به‌روزرسانی نشد.')).finally(() => active && setLoading(false)); return () => { active=false; };
  }, [membership.workspace_id, preview, refreshKey]);
  const cards = [['سرنخ جدید',stats.leads],['فرصت باز',stats.opportunities],['ارزش پایپ‌لاین',`${toPersianNumber(stats.value)} تومان`],['پیگیری امروز',stats.due],['عقب‌افتاده',stats.overdue],['نرخ تبدیل',`${toPersianNumber(stats.conversion)}٪`]];
  return <><PageHeader eyebrow="نمای امروز" title="داشبورد فروش" description="چیزهایی که امروز برای ادامه گفتگوها و حرکت فرصت‌ها نیاز داری."/><DataState loading={loading} error={error}><section className="stat-grid" aria-label="شاخص‌های فروش">{cards.map(([label,value]) => <article key={String(label)}><span>{label}</span><strong>{typeof value === 'number' ? toPersianNumber(value) : value}</strong></article>)}</section>{stats.leads+stats.opportunities+stats.due+stats.overdue===0 ? <EmptyState title="هنوز فعالیتی ثبت نشده" text="با ثبت یک سرنخ یا فرصت واقعی، خلاصه کارهای امروز در این صفحه شکل می‌گیرد." action={<NavLink className="crm-primary inline" to="/inbox">رفتن به ورودی‌ها</NavLink>}/> : <section className="dashboard-focus"><div><span>نیازمند توجه</span><strong>{toPersianNumber(stats.overdue)} پیگیری عقب‌افتاده</strong></div><NavLink to="/tasks">دیدن پیگیری‌ها <Icon name="arrow" size={17}/></NavLink></section>}</DataState></>;
}

function Inbox() {
  const { membership, refresh } = useCrm(); const [query,setQuery]=useState(''); const [busy,setBusy]=useState('');
  const data = useRows<LeadSubmission>(async()=>{ const {data,error}=await requireSupabase().from('lead_submissions').select('*').eq('workspace_id',membership.workspace_id).eq('status','new').is('archived_at',null).order('created_at',{ascending:false}); if(error)throw error; return data as LeadSubmission[];},[membership.workspace_id]);
  const members = useRows<Membership>(async()=>{if(membership.role!=='admin')return[];const{data,error}=await requireSupabase().from('workspace_members').select('workspace_id,user_id,role,is_active,profile:profiles(full_name,email)').eq('workspace_id',membership.workspace_id).eq('is_active',true);if(error)throw error;return data as unknown as Membership[]},[membership.workspace_id,membership.role]);
  const rows=data.rows.filter(row=>`${row.name} ${row.phone} ${row.business_name||''}`.includes(query));
  async function update(id:string, values:Record<string,unknown>){setBusy(id);const {error}=await requireSupabase().from('lead_submissions').update(values).eq('id',id);setBusy('');if(error)throw error;refresh();}
  async function qualify(row:LeadSubmission){setBusy(row.id);const {error}=await requireSupabase().rpc('qualify_lead',{p_lead_id:row.id,p_owner_id:row.assigned_to||membership.user_id});setBusy('');if(error)throw error;refresh();}
  return <><PageHeader eyebrow="صندوق بررسی" title="سرنخ‌های جدید" description="هر درخواست ابتدا اینجا بررسی می‌شود و فقط با تأیید تیم وارد پایپ‌لاین خواهد شد."/><Toolbar query={query} setQuery={setQuery} placeholder="جست‌وجوی نام، موبایل یا کسب‌وکار"/><DataState loading={data.loading} error={data.error||members.error}>{rows.length===0?<EmptyState title="سرنخ جدیدی نیست" text="درخواست‌های واقعی ثبت‌شده از فرم سایت در این بخش ظاهر می‌شوند."/>:<div className="data-list">{rows.map(row=><article className="lead-row" key={row.id}><div><span className="service-pill">{serviceLabels[row.service_type]}</span><h2>{row.name}</h2><p><bdi>{row.phone}</bdi>{row.business_name&&<> · {row.business_name}</>}</p><small>{formatPersianDate(row.created_at,true)}</small>{membership.role==='admin'&&<label className="lead-owner">مسئول<select value={row.assigned_to||''} disabled={busy===row.id} onChange={event=>void update(row.id,{assigned_to:event.target.value||null})}><option value="">تخصیص‌نیافته</option>{members.rows.map(member=><option key={member.user_id} value={member.user_id}>{member.profile?.full_name||member.profile?.email||'عضو تیم'}</option>)}</select></label>}</div><p className="lead-brief">{row.brief}</p><div className="row-actions"><button className="crm-primary small" disabled={busy===row.id} onClick={()=>void qualify(row)}>تأیید و تبدیل</button><button className="crm-secondary small" disabled={busy===row.id} onClick={()=>void update(row.id,{status:'rejected'})}>رد درخواست</button><button className="icon-button" aria-label={`آرشیو ${row.name}`} disabled={busy===row.id} onClick={()=>void update(row.id,{status:'archived',archived_at:new Date().toISOString(),archived_by:membership.user_id})}><Icon name="close" size={16}/></button></div></article>)}</div>}</DataState></>;
}

function Pipeline() {
  const { membership, refresh }=useCrm(); const [dialog,setDialog]=useState(false); const [editing,setEditing]=useState<Opportunity|null>(null); const [dragged,setDragged]=useState('');
  const stages=useRows<PipelineStage>(async()=>{const{data,error}=await requireSupabase().from('pipeline_stages').select('*').eq('workspace_id',membership.workspace_id).order('position');if(error)throw error;return data as PipelineStage[]},[membership.workspace_id]);
  const opportunities=useRows<Opportunity>(async()=>{const{data,error}=await requireSupabase().from('opportunities').select('*').eq('workspace_id',membership.workspace_id).is('archived_at',null).order('created_at',{ascending:false});if(error)throw error;return data as Opportunity[]},[membership.workspace_id]);
  async function move(id:string,stageId:string){const stage=stages.rows.find(item=>item.id===stageId);const status=stage?.terminal_status||'open';const{error}=await requireSupabase().from('opportunities').update({stage_id:stageId,status}).eq('id',id);if(error)throw error;refresh();}
  return <><PageHeader eyebrow="مسیر فروش" title="پایپ‌لاین فرصت‌ها" description="تغییر مرحله با منوی هر فرصت همیشه در دسترس است؛ Drag میانبر دسکتاپ است." action={<div className="header-actions">{membership.role==='admin'&&<ExportCsv table="opportunities" rows={opportunities.rows as unknown as Record<string,unknown>[]}/>}<button className="crm-primary" onClick={()=>setDialog(true)}>فرصت جدید <Icon name="plus" size={17}/></button></div>}/><DataState loading={stages.loading||opportunities.loading} error={stages.error||opportunities.error}>{stages.rows.length===0?<EmptyState title="مراحل فروش تنظیم نشده‌اند" text="مدیر باید مراحل اولیه پایپ‌لاین را ایجاد کند." action={<NavLink className="crm-primary inline" to="/settings/pipeline">تنظیم مراحل</NavLink>}/>:<div className="pipeline-board">{stages.rows.map(stage=>{const cards=opportunities.rows.filter(item=>item.stage_id===stage.id);return <section className="pipeline-column" key={stage.id} onDragOver={event=>event.preventDefault()} onDrop={()=>{if(dragged)void move(dragged,stage.id);setDragged('')}}><header><span style={{background:stage.color}}/><h2>{stage.name}</h2><b>{toPersianNumber(cards.length)}</b></header><div>{cards.map(card=><article className="opportunity-card" key={card.id} draggable onDragStart={()=>setDragged(card.id)} onDragEnd={()=>setDragged('')}><span>{serviceLabels[card.service_type]}</span><h3>{card.title}</h3><strong>{card.estimated_value?`${toPersianNumber(card.estimated_value)} تومان`:'ارزش ثبت نشده'}</strong><label>مرحله<select value={card.stage_id} onChange={event=>void move(card.id,event.target.value)}>{stages.rows.map(option=><option key={option.id} value={option.id}>{option.name}</option>)}</select></label><button className="text-button card-edit" onClick={()=>setEditing(card)}>ویرایش جزئیات</button></article>)}{cards.length===0&&<p className="column-empty">فرصتی در این مرحله نیست.</p>}</div></section>})}</div>}</DataState>{dialog&&<OpportunityDialog stages={stages.rows} onClose={()=>setDialog(false)} onSaved={()=>{setDialog(false);refresh()}}/>}{editing&&<OpportunityDialog stages={stages.rows} opportunity={editing} onClose={()=>setEditing(null)} onSaved={()=>{setEditing(null);refresh()}}/>}</>;
}

function OpportunityDialog({stages,opportunity,onClose,onSaved}:{stages:PipelineStage[];opportunity?:Opportunity;onClose():void;onSaved():void}){
  const {membership}=useCrm(); const [date,setDate]=useState(opportunity?.expected_close_date||''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);const form=new FormData(event.currentTarget);const stageId=String(form.get('stage_id'));const status=stages.find(stage=>stage.id===stageId)?.terminal_status||'open';const payload={workspace_id:membership.workspace_id,title:String(form.get('title')),service_type:String(form.get('service_type')) as ServiceType,stage_id:stageId,owner_id:opportunity?.owner_id||membership.user_id,estimated_value:form.get('estimated_value')?Number(form.get('estimated_value')):null,final_value:form.get('final_value')?Number(form.get('final_value')):null,lost_reason:String(form.get('lost_reason')||'')||null,currency_code:'IRT',expected_close_date:date||null,status};const query=requireSupabase().from('opportunities');const{error}=opportunity?await query.update(payload).eq('id',opportunity.id):await query.insert(payload);setBusy(false);if(error)setError('ثبت فرصت انجام نشد.');else onSaved();}
  async function archive(){if(!opportunity||!confirm(`«${opportunity.title}» به آرشیو منتقل شود؟`))return;setBusy(true);const{error}=await requireSupabase().from('opportunities').update({archived_at:new Date().toISOString(),archived_by:membership.user_id}).eq('id',opportunity.id);setBusy(false);if(error)setError('آرشیو فرصت انجام نشد.');else onSaved()}
  return <Dialog title={opportunity?'ویرایش فرصت':'فرصت جدید'} onClose={onClose}><form className="dialog-form" onSubmit={submit}><label>عنوان فرصت<input className="crm-field" name="title" required maxLength={160} defaultValue={opportunity?.title}/></label><label>خدمت<select className="crm-field" name="service_type" required defaultValue={opportunity?.service_type||'web_design'}><option value="web_design">طراحی سایت</option><option value="ai_agent">AI Agent اختصاصی</option><option value="other">سایر</option></select></label><label>مرحله<select className="crm-field" name="stage_id" required defaultValue={opportunity?.stage_id}>{stages.map(stage=><option key={stage.id} value={stage.id}>{stage.name}</option>)}</select></label><label>ارزش تخمینی (تومان)<input className="crm-field" name="estimated_value" type="number" min="0" step="1" inputMode="numeric" defaultValue={opportunity?.estimated_value||''}/></label>{opportunity&&<><label>مبلغ نهایی (تومان)<input className="crm-field" name="final_value" type="number" min="0" step="1" inputMode="numeric" defaultValue={opportunity.final_value||''}/></label><label>دلیل از دست رفتن<textarea className="crm-field" name="lost_reason" rows={3} defaultValue={opportunity.lost_reason||''}/></label></>}<Suspense fallback={<span className="field-loading">در حال آماده‌سازی تقویم…</span>}><PersianDatePicker value={date} onChange={setDate} label="تاریخ احتمالی پایان"/></Suspense>{error&&<p className="field-error" role="alert">{error}</p>}<div className="dialog-actions"><button className="crm-primary" disabled={busy}>{busy?'در حال ثبت…':'ذخیره فرصت'}</button>{opportunity&&<button className="text-button danger" type="button" disabled={busy} onClick={()=>void archive()}>انتقال به آرشیو</button>}</div></form></Dialog>;
}

function Directory({kind}:{kind:'contacts'|'companies'}){
  const {membership,refresh}=useCrm();const [query,setQuery]=useState('');const [dialog,setDialog]=useState(false);const isContact=kind==='contacts';
  const data=useRows<ContactRecord|CompanyRecord>(async()=>{const{data,error}=await requireSupabase().from(kind).select('*').eq('workspace_id',membership.workspace_id).is('archived_at',null).order('created_at',{ascending:false});if(error)throw error;return data as (ContactRecord|CompanyRecord)[]},[kind,membership.workspace_id]);
  const rows=data.rows.filter(row=>(isContact?(row as ContactRecord).full_name:(row as CompanyRecord).name).includes(query));
  return <><PageHeader eyebrow={isContact?'افراد':'سازمان‌ها'} title={isContact?'مخاطبان':'کسب‌وکارها'} description={isContact?'افرادی که گفتگو و فرصت فروش با آن‌ها شکل گرفته است.':'برندها و سازمان‌های مرتبط با مخاطبان و فرصت‌ها.'} action={<button className="crm-primary" onClick={()=>setDialog(true)}>{isContact?'مخاطب':'کسب‌وکار'} جدید <Icon name="plus" size={17}/></button>}/><Toolbar query={query} setQuery={setQuery} placeholder={isContact?'جست‌وجوی نام مخاطب':'جست‌وجوی نام کسب‌وکار'} extra={membership.role==='admin'&&<ExportCsv table={kind} rows={rows as unknown as Record<string,unknown>[]}/>}/><DataState loading={data.loading} error={data.error}>{rows.length===0?<EmptyState title={isContact?'هنوز مخاطبی ثبت نشده':'هنوز کسب‌وکاری ثبت نشده'} text={isContact?'مخاطب را دستی اضافه کنید یا یک سرنخ واقعی را تبدیل کنید.':'کسب‌وکار می‌تواند هنگام تبدیل سرنخ یا از همین صفحه ساخته شود.'}/>:<div className="table-wrap"><table><thead><tr><th>{isContact?'نام':'کسب‌وکار'}</th><th>{isContact?'راه ارتباط':'وب‌سایت'}</th><th>تاریخ ایجاد</th><th><span className="sr-only">عملیات</span></th></tr></thead><tbody>{rows.map(row=>{const contact=row as ContactRecord;const company=row as CompanyRecord;const name=isContact?contact.full_name:company.name;return <tr key={row.id}><td><strong>{name}</strong></td><td>{isContact?<bdi>{contact.phone||contact.email||'—'}</bdi>:company.website?<a href={company.website} target="_blank" rel="noreferrer">{company.website}</a>:'—'}</td><td>{formatPersianDate(row.created_at)}</td><td><NavLink className="row-link" to={`/${kind}/${row.id}`}>جزئیات <Icon name="arrow" size={15}/></NavLink></td></tr>})}</tbody></table></div>}</DataState>{dialog&&<DirectoryDialog kind={kind} onClose={()=>setDialog(false)} onSaved={()=>{setDialog(false);refresh()}}/>}</>;
}

function DirectoryDialog({kind,onClose,onSaved}:{kind:'contacts'|'companies';onClose():void;onSaved():void}){
  const {membership}=useCrm();const [error,setError]=useState('');const [duplicate,setDuplicate]=useState<{id:string;label:string}|null>(null);const [busy,setBusy]=useState(false);const isContact=kind==='contacts';
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setDuplicate(null);const form=new FormData(event.currentTarget);if(isContact){const phone=String(form.get('phone')||'').trim()||null;const email=String(form.get('email')||'').trim()||null;if(phone||email){let check=requireSupabase().from('contacts').select('id,full_name').eq('workspace_id',membership.workspace_id).is('archived_at',null);check=phone?check.eq('phone',phone):check.eq('email',email!);const{data}=await check.limit(1);if(data?.[0]&&!form.get('allow_duplicate')){setDuplicate({id:data[0].id,label:data[0].full_name});setBusy(false);return;}}}
    const payload=isContact?{workspace_id:membership.workspace_id,full_name:String(form.get('name')),phone:String(form.get('phone')||'')||null,email:String(form.get('email')||'')||null,preferred_channel:String(form.get('preferred_channel')||'whatsapp'),owner_id:membership.user_id}:{workspace_id:membership.workspace_id,name:String(form.get('name')),website:String(form.get('website')||'')||null,description:String(form.get('description')||'')||null,owner_id:membership.user_id};const table=requireSupabase().from(kind);const{error}=isContact?await table.insert(payload as Record<string,unknown>):await table.insert(payload as Record<string,unknown>);setBusy(false);if(error)setError('ثبت رکورد انجام نشد.');else onSaved();}
  return <Dialog title={isContact?'مخاطب جدید':'کسب‌وکار جدید'} onClose={onClose}><form className="dialog-form" onSubmit={submit}><label>{isContact?'نام و نام خانوادگی':'نام کسب‌وکار'}<input className="crm-field" name="name" required maxLength={160}/></label>{isContact?<><label>موبایل<input className="crm-field" name="phone" type="tel" dir="ltr"/></label><label>ایمیل<input className="crm-field" name="email" type="email" dir="ltr"/></label><label>کانال ترجیحی<select className="crm-field" name="preferred_channel"><option value="whatsapp">واتساپ</option><option value="phone">تلفن</option><option value="email">ایمیل</option></select></label></>:<><label>وب‌سایت<input className="crm-field" name="website" type="url" dir="ltr"/></label><label>توضیح<textarea className="crm-field" name="description" rows={4}/></label></>}{duplicate&&<div className="duplicate-warning" role="alert">رکورد مشابه «{duplicate.label}» وجود دارد. <NavLink to={`/contacts/${duplicate.id}`}>بازکردن رکورد</NavLink><label><input type="checkbox" name="allow_duplicate"/> با این حال ثبت شود</label></div>}{error&&<p className="field-error">{error}</p>}<button className="crm-primary" disabled={busy}>{busy?'در حال ثبت…':'ثبت'}</button></form></Dialog>;
}

function RecordDetail({kind}:{kind:'contacts'|'companies'}){
  const {id}=useParams();const navigate=useNavigate();const {membership,refresh}=useCrm();const isContact=kind==='contacts';
  const record=useRows<ContactRecord|CompanyRecord>(async()=>{const{data,error}=await requireSupabase().from(kind).select('*').eq('workspace_id',membership.workspace_id).eq('id',id!).maybeSingle();if(error)throw error;return data?[data as ContactRecord|CompanyRecord]:[]},[kind,id,membership.workspace_id]);
  const activities=useRows<Activity>(async()=>{let query=requireSupabase().from('activities').select('*').eq('workspace_id',membership.workspace_id).is('archived_at',null);query=isContact?query.eq('contact_id',id!):query.eq('company_id',id!);const{data,error}=await query.order('created_at',{ascending:false});if(error)throw error;return data as Activity[]},[kind,id,membership.workspace_id]);
  const opportunities=useRows<Opportunity>(async()=>{let query=requireSupabase().from('opportunities').select('*').eq('workspace_id',membership.workspace_id).is('archived_at',null);query=isContact?query.eq('contact_id',id!):query.eq('company_id',id!);const{data,error}=await query.order('created_at',{ascending:false});if(error)throw error;return data as Opportunity[]},[kind,id,membership.workspace_id]);
  const relatedIds=[id!,...opportunities.rows.map(item=>item.id)];
  const events=useRows<TimelineEvent>(async()=>{const{data,error}=await requireSupabase().from('timeline_events').select('id,entity_id,entity_type,event_type,metadata,created_at').eq('workspace_id',membership.workspace_id).in('entity_id',relatedIds).order('created_at',{ascending:false});if(error)throw error;return data as TimelineEvent[]},[membership.workspace_id,relatedIds.join(',')]);
  if(record.loading)return <DataState loading error=""><></></DataState>;const item=record.rows[0];if(!item)return <EmptyState title="رکورد پیدا نشد" text="ممکن است این رکورد آرشیو شده باشد یا به آن دسترسی نداشته باشید."/>;const name=isContact?(item as ContactRecord).full_name:(item as CompanyRecord).name;
  async function archive(){if(!confirm(`«${name}» به آرشیو منتقل شود؟`))return;const{error}=await requireSupabase().from(kind).update({archived_at:new Date().toISOString(),archived_by:membership.user_id}).eq('id',id!);if(error)return;refresh();navigate(`/${kind}`)}
  const eventLabels:Record<string,string>={created:'ایجاد فرصت',stage_changed:'تغییر مرحله فروش',assigned:'تغییر مسئول',archived:'انتقال به آرشیو',restored:'بازیابی',status_changed:'تغییر وضعیت فعالیت'};
  return <><PageHeader eyebrow={isContact?'جزئیات مخاطب':'جزئیات کسب‌وکار'} title={name} action={<button className="crm-secondary" onClick={()=>void archive()}>انتقال به آرشیو</button>}/><section className="record-layout"><article className="record-summary"><dl>{isContact?<><dt>موبایل</dt><dd><bdi>{(item as ContactRecord).phone||'—'}</bdi></dd><dt>ایمیل</dt><dd><bdi>{(item as ContactRecord).email||'—'}</bdi></dd></>:<><dt>وب‌سایت</dt><dd>{(item as CompanyRecord).website||'—'}</dd><dt>توضیح</dt><dd>{(item as CompanyRecord).description||'—'}</dd></>}<dt>ایجاد</dt><dd>{formatPersianDate(item.created_at)}</dd></dl></article><section className="timeline"><h2>فرصت‌های مرتبط</h2>{opportunities.rows.length?<div className="related-opportunities">{opportunities.rows.map(opportunity=><article key={opportunity.id}><strong>{opportunity.title}</strong><small>{serviceLabels[opportunity.service_type]} · {opportunity.estimated_value?`${toPersianNumber(opportunity.estimated_value)} تومان`:'بدون مبلغ'}</small></article>)}</div>:<p className="timeline-empty">فرصتی به این رکورد متصل نیست.</p>}<h2>فعالیت‌ها</h2>{activities.rows.length?<ol>{activities.rows.map(activity=><li key={activity.id}><span/><div><strong>{activity.subject}</strong><small>{formatPersianDate(activity.created_at,true)}</small>{activity.notes&&<p>{activity.notes}</p>}</div></li>)}</ol>:<p className="timeline-empty">فعالیتی ثبت نشده است.</p>}<h2>تایم‌لاین تغییرات</h2><DataState loading={events.loading||activities.loading||opportunities.loading} error={events.error||activities.error||opportunities.error}>{events.rows.length?<ol>{events.rows.map(event=><li key={event.id}><span/><div><strong>{eventLabels[event.event_type]||event.event_type}</strong><small>{formatPersianDate(event.created_at,true)}</small></div></li>)}</ol>:<p className="timeline-empty">رویدادی ثبت نشده است.</p>}</DataState></section></section></>;
}

function Tasks(){
  const {membership,refresh}=useCrm();const [filter,setFilter]=useState<'today'|'overdue'|'future'|'completed'>('today');const [dialog,setDialog]=useState(false);const {start,end}=tehranDayBounds();
  const data=useRows<Activity>(async()=>{let query=requireSupabase().from('activities').select('*').eq('workspace_id',membership.workspace_id).is('archived_at',null);if(filter==='completed')query=query.eq('status','completed');else{query=query.eq('status','planned');if(filter==='today')query=query.gte('due_at',start.toISOString()).lt('due_at',end.toISOString());if(filter==='overdue')query=query.lt('due_at',start.toISOString());if(filter==='future')query=query.gte('due_at',end.toISOString());}const{data,error}=await query.order('due_at',{ascending:true});if(error)throw error;return data as Activity[]},[filter,membership.workspace_id]);
  async function complete(id:string){const{error}=await requireSupabase().from('activities').update({status:'completed',completed_at:new Date().toISOString()}).eq('id',id);if(error)throw error;refresh();}
  const labels={today:'امروز',overdue:'عقب‌افتاده',future:'آینده',completed:'تکمیل‌شده'};
  return <><PageHeader eyebrow="کارهای بعدی" title="پیگیری‌ها" description="تماس‌ها، جلسه‌ها و اقدام‌هایی که نباید از دست بروند." action={<div className="header-actions">{membership.role==='admin'&&<ExportCsv table="activities" rows={data.rows as unknown as Record<string,unknown>[]}/>}<button className="crm-primary" onClick={()=>setDialog(true)}>پیگیری جدید <Icon name="plus" size={17}/></button></div>}/><div className="segmented" role="group" aria-label="فیلتر پیگیری‌ها">{Object.entries(labels).map(([key,label])=><button key={key} aria-pressed={filter===key} onClick={()=>setFilter(key as typeof filter)}>{label}</button>)}</div><DataState loading={data.loading} error={data.error}>{data.rows.length===0?<EmptyState title={`پیگیری ${labels[filter]} ندارید`} text="فهرست فقط از وظایف واقعی ثبت‌شده تشکیل می‌شود."/>:<div className="task-list">{data.rows.map(task=><article key={task.id}><span className={`task-check ${task.status}`}><Icon name="check" size={16}/></span><div><h2>{task.subject}</h2><p>{task.notes||'بدون توضیح'}</p><small>{formatPersianDate(task.due_at,true)}</small></div>{task.status==='planned'&&<button className="crm-secondary small" onClick={()=>void complete(task.id)}>تکمیل شد</button>}</article>)}</div>}</DataState>{dialog&&<TaskDialog onClose={()=>setDialog(false)} onSaved={()=>{setDialog(false);refresh()}}/>}</>;
}

function TaskDialog({onClose,onSaved}:{onClose():void;onSaved():void}){const{membership}=useCrm();const[date,setDate]=useState('');const[error,setError]=useState('');async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=new FormData(event.currentTarget);const type=String(form.get('type'));if(type!=='note'&&!date){setError('برای تماس، جلسه یا پیگیری یک موعد انتخاب کنید.');return}const due=date?tehranDueIso(date):null;const{error}=await requireSupabase().from('activities').insert({workspace_id:membership.workspace_id,type,subject:String(form.get('subject')),notes:String(form.get('notes')||'')||null,due_at:due,status:'planned',assigned_to:membership.user_id});if(error)setError('ثبت پیگیری انجام نشد.');else onSaved();}return <Dialog title="پیگیری جدید" onClose={onClose}><form className="dialog-form" onSubmit={submit}><label>نوع<select className="crm-field" name="type"><option value="follow_up">پیگیری</option><option value="call">تماس</option><option value="meeting">جلسه</option><option value="note">یادداشت</option></select></label><label>عنوان<input className="crm-field" name="subject" required maxLength={180}/></label><label>توضیح<textarea className="crm-field" name="notes" rows={4}/></label><Suspense fallback={<span className="field-loading">در حال آماده‌سازی تقویم…</span>}><PersianDatePicker label="موعد" value={date} onChange={setDate}/></Suspense>{error&&<p className="field-error" role="alert">{error}</p>}<button className="crm-primary">ثبت پیگیری</button></form></Dialog>}

function TeamSettings(){
  const {membership,refresh}=useCrm();const [dialog,setDialog]=useState(false);const [error,setError]=useState('');
  const data=useRows<Membership>(async()=>{const{data,error}=await requireSupabase().from('workspace_members').select('workspace_id,user_id,role,is_active,profile:profiles(full_name,email)').eq('workspace_id',membership.workspace_id).order('invited_at',{ascending:false});if(error)throw error;return data as unknown as Membership[]},[membership.workspace_id]);
  async function deactivate(member:Membership){if(member.user_id===membership.user_id)return;try{await invokeFunction('deactivate-member',{workspace_id:membership.workspace_id,user_id:member.user_id,transfer_to:membership.user_id});refresh()}catch{setError('غیرفعال‌سازی عضو انجام نشد. موارد باز او را بررسی کنید.')}}
  return <><PageHeader eyebrow="تنظیمات" title="اعضای تیم" description="دعوت، نقش و وضعیت دسترسی اعضای CRM." action={<button className="crm-primary" onClick={()=>setDialog(true)}>دعوت عضو <Icon name="plus" size={17}/></button>}/>{error&&<div className="notice error">{error}</div>}<DataState loading={data.loading} error={data.error}><div className="table-wrap"><table><thead><tr><th>عضو</th><th>نقش</th><th>وضعیت</th><th/></tr></thead><tbody>{data.rows.map(member=><tr key={member.user_id}><td><strong>{member.profile?.full_name||member.profile?.email||'دعوت‌شده'}</strong></td><td>{member.role==='admin'?'مدیر':'عضو'}</td><td><span className={`status-dot ${member.is_active?'active':''}`}/>{member.is_active?'فعال':'غیرفعال'}</td><td>{member.is_active&&member.user_id!==membership.user_id&&<button className="text-button danger" onClick={()=>void deactivate(member)}>غیرفعال‌کردن</button>}</td></tr>)}</tbody></table></div></DataState>{dialog&&<InviteDialog onClose={()=>setDialog(false)} onSaved={()=>{setDialog(false);refresh()}}/>}</>;
}

function InviteDialog({onClose,onSaved}:{onClose():void;onSaved():void}){const{membership}=useCrm();const[error,setError]=useState('');const[busy,setBusy]=useState(false);async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);const form=new FormData(event.currentTarget);try{await invokeFunction('invite-member',{workspace_id:membership.workspace_id,email:String(form.get('email')),full_name:String(form.get('full_name')),role:String(form.get('role')) as Role,redirect_to:`${location.origin}/auth/callback`});onSaved()}catch{setError('دعوت ارسال نشد. تنظیمات SMTP یا دسترسی مدیر را بررسی کنید.')}finally{setBusy(false)}}return <Dialog title="دعوت عضو" onClose={onClose}><form className="dialog-form" onSubmit={submit}><label>نام<input className="crm-field" name="full_name" required/></label><label>ایمیل<input className="crm-field" name="email" type="email" required dir="ltr"/></label><label>نقش<select className="crm-field" name="role"><option value="member">عضو</option><option value="admin">مدیر</option></select></label>{error&&<p className="field-error">{error}</p>}<button className="crm-primary" disabled={busy}>{busy?'در حال ارسال…':'ارسال دعوت'}</button></form></Dialog>}

function PipelineSettings(){
  const {membership,refresh}=useCrm();const [name,setName]=useState('');
  const data=useRows<PipelineStage>(async()=>{const{data,error}=await requireSupabase().from('pipeline_stages').select('*').eq('workspace_id',membership.workspace_id).order('position');if(error)throw error;return data as PipelineStage[]},[membership.workspace_id]);
  async function add(){if(!name.trim())return;const pipeline=await requireSupabase().from('pipelines').select('id').eq('workspace_id',membership.workspace_id).eq('is_active',true).single();if(pipeline.error)throw pipeline.error;const{error}=await requireSupabase().from('pipeline_stages').insert({workspace_id:membership.workspace_id,pipeline_id:pipeline.data.id,name:name.trim(),color:'#8aa5d8',probability:0,position:data.rows.length});if(error)throw error;setName('');refresh()}
  async function update(stage:PipelineStage,values:Record<string,unknown>){const{error}=await requireSupabase().from('pipeline_stages').update(values).eq('id',stage.id);if(error)throw error;refresh()}
  async function reorder(stage:PipelineStage,direction:-1|1){const{error}=await requireSupabase().rpc('reorder_pipeline_stage',{p_stage_id:stage.id,p_direction:direction});if(error)throw error;refresh()}
  return <><PageHeader eyebrow="تنظیمات فروش" title="مراحل پایپ‌لاین" description="نام، ترتیب و احتمال مراحل را بدون تغییر سابقه فرصت‌ها مدیریت کنید."/><div className="settings-panel"><div className="stage-list">{data.rows.map((stage,index)=><article key={stage.id}><span className="stage-color" style={{background:stage.color}}/><input className="crm-field" aria-label="نام مرحله" defaultValue={stage.name} onBlur={event=>{if(event.target.value!==stage.name)void update(stage,{name:event.target.value})}}/><label>احتمال<input className="crm-field compact" type="number" min="0" max="100" defaultValue={stage.probability} onBlur={event=>void update(stage,{probability:Number(event.target.value)})}/></label><div className="stage-order"><button disabled={index===0} aria-label="انتقال به بالا" onClick={()=>void reorder(stage,-1)}>↑</button><button disabled={index===data.rows.length-1} aria-label="انتقال به پایین" onClick={()=>void reorder(stage,1)}>↓</button></div></article>)}</div><div className="add-stage"><input className="crm-field" value={name} onChange={event=>setName(event.target.value)} placeholder="نام مرحله جدید"/><button className="crm-primary" onClick={()=>void add()}>افزودن مرحله</button></div></div></>;
}

function ArchiveSettings(){
  const {membership,refresh}=useCrm();const [error,setError]=useState('');
  const data=useRows<{id:string;label:string;kind:string;archived_at:string}>(async()=>{const db=requireSupabase();const[c,co,o,l,a]=await Promise.all([db.from('contacts').select('id,full_name,archived_at').eq('workspace_id',membership.workspace_id).not('archived_at','is',null),db.from('companies').select('id,name,archived_at').eq('workspace_id',membership.workspace_id).not('archived_at','is',null),db.from('opportunities').select('id,title,archived_at').eq('workspace_id',membership.workspace_id).not('archived_at','is',null),db.from('lead_submissions').select('id,name,archived_at').eq('workspace_id',membership.workspace_id).not('archived_at','is',null),db.from('activities').select('id,subject,archived_at').eq('workspace_id',membership.workspace_id).not('archived_at','is',null)]);const failed=[c,co,o,l,a].find(item=>item.error);if(failed?.error)throw failed.error;return[...(c.data||[]).map(x=>({id:x.id,label:x.full_name,kind:'contacts',archived_at:x.archived_at!})),...(co.data||[]).map(x=>({id:x.id,label:x.name,kind:'companies',archived_at:x.archived_at!})),...(o.data||[]).map(x=>({id:x.id,label:x.title,kind:'opportunities',archived_at:x.archived_at!})),...(l.data||[]).map(x=>({id:x.id,label:x.name,kind:'lead_submissions',archived_at:x.archived_at!})),...(a.data||[]).map(x=>({id:x.id,label:x.subject,kind:'activities',archived_at:x.archived_at!}))]},[membership.workspace_id]);
  async function restore(row:{id:string;kind:string}){const values=row.kind==='lead_submissions'?{archived_at:null,archived_by:null,status:'new'}:{archived_at:null,archived_by:null};const{error}=await requireSupabase().from(row.kind).update(values).eq('id',row.id);if(error)setError('بازیابی انجام نشد.');else refresh()}
  async function purge(row:{id:string;kind:string;label:string}){if(!confirm(`«${row.label}» برای همیشه حذف شود؟ این کار قابل بازگشت نیست.`))return;try{await invokeFunction('purge-record',{workspace_id:membership.workspace_id,table:row.kind,id:row.id});refresh()}catch{setError('حذف دائمی انجام نشد.')}}
  return <><PageHeader eyebrow="تنظیمات" title="آرشیو" description="رکوردهای کنارگذاشته‌شده را بازیابی یا با تأیید صریح برای همیشه حذف کنید."/>{error&&<div className="notice error">{error}</div>}<DataState loading={data.loading} error={data.error}>{data.rows.length===0?<EmptyState title="آرشیو خالی است" text="رکوردهای آرشیوشده در این بخش نگهداری می‌شوند."/>:<div className="data-list">{data.rows.map(row=><article className="archive-row" key={`${row.kind}-${row.id}`}><div><strong>{row.label}</strong><small>{formatPersianDate(row.archived_at,true)}</small></div><div><button className="crm-secondary small" onClick={()=>void restore(row)}>بازیابی</button><button className="text-button danger" onClick={()=>void purge(row)}>حذف دائمی</button></div></article>)}</div>}</DataState></>;
}

function Toolbar({query,setQuery,placeholder,extra}:{query:string;setQuery(value:string):void;placeholder:string;extra?:ReactNode}){return <div className="toolbar"><label className="search-field"><Icon name="search" size={18}/><span className="sr-only">جست‌وجو</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={placeholder}/></label>{extra}</div>}

function ExportCsv({table,rows}:{table:string;rows:Record<string,unknown>[]}){function download(){if(!rows.length)return;const keys=Object.keys(rows[0]).filter(key=>!['workspace_id','archived_by'].includes(key));const cell=(value:unknown)=>`"${String(value??'').replaceAll('"','""')}"`;const csv='\uFEFF'+[keys.map(cell).join(','),...rows.map(row=>keys.map(key=>cell(row[key])).join(','))].join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=`pixel-${table}-${new Date().toISOString().slice(0,10)}.csv`;link.click();URL.revokeObjectURL(url)}return <button className="crm-secondary" disabled={!rows.length} onClick={download}>خروجی CSV</button>}

function Dialog({title,onClose,children}:{title:string;onClose():void;children:ReactNode}){const dialogRef=useRef<HTMLElement>(null);useEffect(()=>{const previous=document.activeElement as HTMLElement|null;const dialog=dialogRef.current;dialog?.querySelector<HTMLElement>('input,select,textarea,button,a[href]')?.focus();const handle=(event:KeyboardEvent)=>{if(event.key==='Escape'){onClose();return}if(event.key==='Tab'&&dialog){const focusable=[...dialog.querySelectorAll<HTMLElement>('input:not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),a[href]')];if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}};document.addEventListener('keydown',handle);return()=>{document.removeEventListener('keydown',handle);previous?.focus()}},[onClose]);return <div className="dialog-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><section ref={dialogRef} className="crm-dialog glass" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><header><h2 id="dialog-title">{title}</h2><button className="icon-button" aria-label="بستن" onClick={onClose}><Icon name="close"/></button></header>{children}</section></div>}
