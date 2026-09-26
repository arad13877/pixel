import { type ChangeEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../Icons';
import PortfolioCard from '../PortfolioCard';
import type { PortfolioPayload } from '../portfolio-data';
import { formatPersianDate, toPersianNumber } from './format';
import { invokeFunction, requireSupabase } from './supabase';
import type { CmsPortfolioItem, Membership } from './types';

type Props = { membership: Membership; preview: boolean; refreshKey: number; refresh(): void };
const labels = { draft: 'پیش‌نویس', published: 'منتشرشده', archived: 'آرشیوشده' } as const;
const deployLabels = { idle: '', pending: 'در صف انتشار', requested: 'درخواست ساخت ارسال شد', failed: 'خطای درخواست انتشار' } as const;

function header(title: string, description: string, action?: ReactNode) {
  return <div className="page-header"><div><span>نمونه‌کارهای پیکسل</span><h1>{title}</h1><p>{description}</p></div>{action && <div className="page-action">{action}</div>}</div>;
}

function emptyPayload(): PortfolioPayload {
  return { title: '', subtitle: '', description: '', link: '', imagePath: '', imageAlt: '', imageWidth: 0, imageHeight: 0, label: '', service: 'طراحی سایت', conceptNote: '', theme: 'client' };
}

export function PortfolioList({ membership, preview, refreshKey, refresh }: Props) {
  const [rows, setRows] = useState<CmsPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | CmsPortfolioItem['status']>('all');
  useEffect(() => {
    let active = true;
    if (preview) { setRows([]); setLoading(false); return; }
    setLoading(true); setError('');
    requireSupabase().from('portfolio_items').select('*').eq('workspace_id', membership.workspace_id).order('sort_order').order('id').then(({ data, error: fetchError }) => {
      if (!active) return;
      if (fetchError) setError('دریافت نمونه‌کارها انجام نشد.');
      else setRows((data || []) as CmsPortfolioItem[]);
      setLoading(false);
    });
    return () => { active = false; };
  }, [membership.workspace_id, preview, refreshKey]);
  const visible = useMemo(() => rows.filter(row => (filter === 'all' || row.status === filter) && (!query || `${row.draft_payload.title} ${row.draft_payload.description}`.toLowerCase().includes(query.toLowerCase()))), [rows, filter, query]);
  const ordered = rows.filter(row => row.status !== 'archived');
  async function move(id: string, direction: -1 | 1) {
    const position = ordered.findIndex(row => row.id === id);
    if (position < 0 || position + direction < 0 || position + direction >= ordered.length) return;
    const next = [...ordered];
    [next[position], next[position + direction]] = [next[position + direction], next[position]];
    setBusy(true); setError(''); setNotice('');
    try {
      await invokeFunction('manage-portfolio', { action: 'reorder', workspace_id: membership.workspace_id, id, ids: next.map(row => row.id) });
      setRows([...next, ...rows.filter(row => row.status === 'archived')]);
      setNotice('ترتیب ذخیره شد و درخواست ساخت سایت ارسال شد. نمایش سایت پس از تکمیل build تغییر می‌کند.');
      refresh();
    } catch { setError('ذخیره ترتیب یا درخواست ساخت سایت ناموفق بود. وضعیت انتشار را بررسی و دوباره تلاش کنید.'); }
    finally { setBusy(false); }
  }
  async function retry(id: string) {
    setBusy(true); setError('');
    try { await invokeFunction('manage-portfolio', { action: 'retry', workspace_id: membership.workspace_id, id }); setNotice('درخواست ساخت سایت دوباره ارسال شد.'); refresh(); }
    catch { setError('ارسال دوباره درخواست ساخت سایت انجام نشد.'); }
    finally { setBusy(false); }
  }
  return <>{header('مدیریت نمونه‌کارها', 'پروژه‌های مشتری را آماده کنید؛ نمایش عمومی و ترتیب نهایی با تأیید مدیر است.', <NavLink className="crm-primary" to="/portfolio/new">نمونه‌کار جدید <Icon name="plus" size={17}/></NavLink>)}
    <div className="article-toolbar"><label className="search-field"><Icon name="search" size={18}/><span className="sr-only">جست‌وجوی نمونه‌کار</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="جست‌وجوی عنوان یا توضیح"/></label><div className="segmented" role="group" aria-label="فیلتر وضعیت">{([['all','همه'], ['draft','پیش‌نویس'], ['published','منتشرشده'], ['archived','آرشیو']] as const).map(([value,label]) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div></div>
    {notice && <div className="notice success" role="status">{notice}</div>}{error && <div className="notice error" role="alert">{error}</div>}
    {loading ? <div className="skeleton-list" aria-label="در حال بارگذاری"><i/><i/><i/></div> : visible.length === 0 ? <section className="empty-state"><span><Icon name="globe" size={22}/></span><h2>نمونه‌کاری در این وضعیت نیست</h2><p>نمونه‌کار تازه‌ای بسازید یا فیلتر را تغییر دهید.</p></section> : <div className="article-admin-list portfolio-admin-list">{visible.map(row => { const index = ordered.findIndex(item => item.id === row.id); const changed = JSON.stringify(row.draft_payload) !== JSON.stringify(row.published_payload); return <article key={row.id}><div><span className={`article-status ${row.status}`}>{labels[row.status]}</span><h2>{row.draft_payload.title}</h2><p>{row.kind === 'concept' ? 'کانسپت نمایشی' : 'پروژه مشتری'} · {row.draft_payload.service}</p><small>آخرین ویرایش {formatPersianDate(row.updated_at, true)}</small></div><div className="article-row-state">{row.status === 'published' && changed && <span>تغییرات منتشرنشده</span>}{row.deployment_status !== 'idle' && <span className={row.deployment_status}>{deployLabels[row.deployment_status]}</span>}{row.deployment_status === 'failed' && membership.role === 'admin' && <button className="text-button" disabled={busy} onClick={() => void retry(row.id)}>تلاش دوباره</button>}</div>{membership.role === 'admin' && row.status !== 'archived' && <div className="portfolio-order-controls"><button type="button" aria-label={`انتقال ${row.draft_payload.title} به بالا`} title="انتقال به بالا" disabled={busy || Boolean(query) || filter !== 'all' || index <= 0} onClick={() => void move(row.id, -1)}>↑</button><button type="button" aria-label={`انتقال ${row.draft_payload.title} به پایین`} title="انتقال به پایین" disabled={busy || Boolean(query) || filter !== 'all' || index >= ordered.length - 1} onClick={() => void move(row.id, 1)}>↓</button></div>}<NavLink className="crm-secondary small" to={`/portfolio/${row.id}/edit`}>ویرایش</NavLink></article>; })}</div>}
  </>;
}

export function PortfolioEditor({ membership, preview, refresh }: Props) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const isNew = !routeId;
  const [id] = useState(() => routeId || crypto.randomUUID());
  const [row, setRow] = useState<CmsPortfolioItem | null>(null);
  const [payload, setPayload] = useState<PortfolioPayload>(emptyPayload);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isNew || preview) { setLoading(false); return; }
    let active = true;
    requireSupabase().from('portfolio_items').select('*').eq('workspace_id', membership.workspace_id).eq('id', id).maybeSingle().then(async ({ data, error: fetchError }) => {
      if (!active) return;
      if (fetchError || !data) setError('نمونه‌کار پیدا نشد.');
      else {
        const item = data as CmsPortfolioItem;
        setRow(item); setPayload(item.draft_payload);
        if (item.kind === 'concept') setImagePreview(item.draft_payload.imagePath);
        else if (item.draft_payload.imagePath) {
          const signed = await requireSupabase().storage.from('portfolio-drafts').createSignedUrl(item.draft_payload.imagePath, 3600);
          if (active && signed.data) setImagePreview(signed.data.signedUrl);
        }
      }
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [id, isNew, membership.workspace_id, preview]);
  useEffect(() => {
    const before = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    const links = (event: MouseEvent) => { const anchor = (event.target as Element).closest('a[href]'); if (dirty && anchor instanceof HTMLAnchorElement && anchor.origin === location.origin && !confirm('تغییرات ذخیره نشده‌اند. از صفحه خارج می‌شوید؟')) event.preventDefault(); };
    addEventListener('beforeunload', before); document.addEventListener('click', links, true);
    return () => { removeEventListener('beforeunload', before); document.removeEventListener('click', links, true); };
  }, [dirty]);
  useEffect(() => {
    if (!previewOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Escape') { setPreviewOpen(false); return; } if (event.key === 'Tab') { const focusable = Array.from(modalRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]') || []); if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0]?.focus(); } } };
    document.addEventListener('keydown', keyboard);
    return () => { document.removeEventListener('keydown', keyboard); previous?.focus(); };
  }, [previewOpen]);
  function set<K extends keyof PortfolioPayload>(key: K, value: PortfolioPayload[K]) { setPayload(current => ({ ...current, [key]: value })); setDirty(true); setConsent(false); setNotice(''); }
  async function syncRow() {
    const result = await requireSupabase().from('portfolio_items').select('*').eq('workspace_id', membership.workspace_id).eq('id', id).maybeSingle();
    if (result.data) setRow(result.data as CmsPortfolioItem);
  }
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    setError('');
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('عکس باید JPG، PNG یا WebP و حداکثر ۵ مگابایت باشد.'); return; }
    const objectUrl = URL.createObjectURL(file);
    try {
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => { const image = new Image(); image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight }); image.onerror = reject; image.src = objectUrl; });
      if (dimensions.width < 1200 || dimensions.height < 630) { setError('ابعاد عکس باید حداقل ۱۲۰۰ در ۶۳۰ پیکسل باشد.'); return; }
      setUploading(true);
      const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const path = `${membership.workspace_id}/${id}/${crypto.randomUUID()}.${extension}`;
      const result = await requireSupabase().storage.from('portfolio-drafts').upload(path, file, { contentType: file.type, upsert: false });
      if (result.error) throw result.error;
      const signed = await requireSupabase().storage.from('portfolio-drafts').createSignedUrl(path, 3600);
      if (signed.error || !signed.data) throw signed.error;
      setPayload(current => ({ ...current, imagePath: path, imageWidth: dimensions.width, imageHeight: dimensions.height }));
      setImagePreview(signed.data.signedUrl); setDirty(true); setConsent(false);
    } catch { setError('آپلود عکس انجام نشد. دوباره تلاش کنید.'); }
    finally { URL.revokeObjectURL(objectUrl); setUploading(false); event.target.value = ''; }
  }
  async function save() {
    setSaving(true); setError('');
    try {
      const result = await invokeFunction<{ item: CmsPortfolioItem }>('manage-portfolio', { action: 'save', workspace_id: membership.workspace_id, id, payload });
      if (!result?.item) throw new Error('empty_response');
      setRow(result.item); setPayload(result.item.draft_payload); setDirty(false); setNotice('پیش‌نویس ذخیره شد.'); refresh();
      if (isNew) navigate(`/portfolio/${id}/edit`, { replace: true });
      return result.item;
    } catch { setError('ذخیره انجام نشد. عکس، عنوان، لینک و متن جایگزین را بررسی کنید.'); return null; }
    finally { setSaving(false); }
  }
  async function publish() {
    const saved = dirty || !row ? await save() : row;
    if (!saved) return;
    setSaving(true); setError('');
    try {
      await invokeFunction('manage-portfolio', { action: 'publish', workspace_id: membership.workspace_id, id, consent_confirmed: saved.kind === 'concept' || consent });
      setNotice('نسخهٔ عمومی ثبت شد و درخواست ساخت سایت ارسال شد. زنده‌شدن سایت پس از پایان build بررسی می‌شود.');
      setConsent(false); refresh();
    } catch { setError('انتشار کامل نشد. مجوز مشتری، عکس و وضعیت Deploy Hook را بررسی کنید.'); refresh(); }
    finally { await syncRow().catch(() => undefined); setSaving(false); }
  }
  async function archive() {
    if (!confirm('این نمونه‌کار از خروجی بعدی سایت حذف و آرشیو شود؟')) return;
    setSaving(true); setError('');
    try { await invokeFunction('manage-portfolio', { action: 'archive', workspace_id: membership.workspace_id, id }); refresh(); navigate('/portfolio'); }
    catch { setError('آرشیو یا درخواست ساخت سایت انجام نشد.'); await syncRow(); refresh(); }
    finally { setSaving(false); }
  }
  async function retry() {
    setSaving(true); setError('');
    try { await invokeFunction('manage-portfolio', { action: 'retry', workspace_id: membership.workspace_id, id }); setNotice('درخواست ساخت سایت دوباره ارسال شد.'); await syncRow(); refresh(); }
    catch { setError('تلاش دوباره انجام نشد.'); }
    finally { setSaving(false); }
  }
  if (loading) return <div className="skeleton-list" aria-label="در حال بارگذاری"><i/><i/><i/></div>;
  const kind = row?.kind || 'client';
  const canPublish = membership.role === 'admin';
  const canSave = !saving && !uploading && Boolean(payload.title.trim() && payload.link.trim() && payload.imageAlt.trim() && payload.imagePath);
  return <>{header(isNew ? 'نمونه‌کار جدید' : payload.title || 'نمونه‌کار بدون عنوان', row ? `${labels[row.status]} · آخرین ویرایش ${formatPersianDate(row.updated_at, true)}` : 'پس از ذخیره، این نمونه‌کار در فهرست ظاهر می‌شود.', <div className="header-actions"><button type="button" className="crm-secondary" onClick={() => setPreviewOpen(true)}>پیش‌نمایش</button><button type="button" className="crm-secondary" disabled={!canSave || !dirty} onClick={() => void save()}>{saving ? 'در حال ذخیره…' : 'ذخیره'}</button>{canPublish && <button type="button" className="crm-primary" disabled={!canSave || (kind === 'client' && !consent)} onClick={() => void publish()}>انتشار <Icon name="arrow" size={17}/></button>}</div>)}
    {notice && <div className="notice success" role="status">{notice}</div>}{error && <div className="notice error" role="alert">{error}</div>}{row?.deployment_status === 'failed' && canPublish && <div className="notice warning">درخواست ساخت سایت ناموفق بوده است. <button className="text-button" onClick={() => void retry()}>تلاش دوباره</button></div>}
    <div className="article-editor-layout"><form className="article-editor" onSubmit={event => { event.preventDefault(); void save(); }}><section className="editor-panel"><header><h2>اطلاعات نمونه‌کار</h2></header><div><label>عنوان<input className="crm-field" required maxLength={160} value={payload.title} onChange={event => set('title', event.target.value)}/></label>{kind === 'concept' && <label>زیرعنوان<input className="crm-field" maxLength={180} value={payload.subtitle} onChange={event => set('subtitle', event.target.value)}/></label>}<label>لینک نمونه‌کار<input className="crm-field" dir="ltr" required maxLength={2048} value={payload.link} placeholder="https://example.com" onChange={event => set('link', event.target.value)}/></label><label>توضیح کوتاه (اختیاری)<textarea className="crm-field" rows={3} maxLength={500} value={payload.description} onChange={event => set('description', event.target.value)}/></label>{kind === 'concept' && <label>برچسب نمایشی<input className="crm-field" value={payload.conceptNote} onChange={event => set('conceptNote', event.target.value)}/></label>}<label>نوع خدمت<input className="crm-field" maxLength={80} value={payload.service} onChange={event => set('service', event.target.value)}/></label></div></section>
      <section className="editor-panel"><header><h2>عکس نمونه‌کار</h2></header><div>{kind === 'client' && <label className="cover-upload">انتخاب عکس<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={event => void upload(event)}/><span>{uploading ? 'در حال آپلود…' : 'JPG، PNG یا WebP؛ حداقل ۱۲۰۰×۶۳۰ و حداکثر ۵ مگابایت'}</span></label>}{imagePreview && <img className="cover-preview" src={imagePreview} alt="پیش‌نمایش عکس نمونه‌کار"/>}<label>متن جایگزین عکس<input className="crm-field" required maxLength={180} value={payload.imageAlt} onChange={event => set('imageAlt', event.target.value)}/></label>{kind === 'concept' && <p className="legacy-cover-note">عکس این کانسپت از فایل‌های فعلی سایت استفاده می‌کند.</p>}</div></section>
      {kind === 'client' && canPublish && <section className="editor-panel"><header><h2>مجوز نمایش عمومی</h2></header><div><label className="portfolio-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)}/><span>تأیید می‌کنم مشتری اجازهٔ نمایش عمومی نام، تصویر و لینک این پروژه را داده است.</span></label><p className="portfolio-help">این تأیید برای هر بار انتشار یا انتشار دوباره لازم است.</p></div></section>}
      <div className="editor-savebar"><button className="crm-primary" disabled={!canSave}>{saving ? 'در حال ذخیره…' : 'ذخیره پیش‌نویس'}</button>{row && canPublish && <button type="button" className="text-button danger" onClick={() => void archive()}>انتقال به آرشیو</button>}</div></form><aside className="article-editor-summary"><strong>وضعیت محتوا</strong><span>{dirty ? 'تغییرات ذخیره‌نشده' : 'همهٔ تغییرات ذخیره شده'}</span><dl><dt>نوع</dt><dd>{kind === 'concept' ? 'کانسپت نمایشی' : 'پروژه مشتری'}</dd><dt>وضعیت</dt><dd>{row ? labels[row.status] : 'پیش‌نویس تازه'}</dd><dt>تصویر</dt><dd>{payload.imagePath ? 'ثبت‌شده' : 'ثبت‌نشده'}</dd></dl>{row?.status === 'published' && <a href="https://pxlgrid.design/portfolio/" target="_blank" rel="noreferrer">مشاهده صفحهٔ عمومی</a>}</aside></div>
    {previewOpen && <div ref={modalRef} className="article-preview-modal portfolio-preview-modal" role="dialog" aria-modal="true" aria-label="پیش‌نمایش نمونه‌کار" tabIndex={-1}><button ref={closeRef} type="button" className="preview-close" onClick={() => setPreviewOpen(false)} aria-label="بستن پیش‌نمایش"><Icon name="close"/></button><div className="portfolio-preview-inner">{payload.title && imagePreview ? <PortfolioCard item={{ id, kind, sortOrder: row?.sort_order || 0, payload: { ...payload, imagePath: imagePreview } }} index={0}/> : <section className="empty-state"><h2>پیش‌نمایش هنوز آماده نیست</h2><p>عنوان و عکس را وارد کنید تا ظاهر کارت نمونه‌کار را ببینید.</p></section>}</div></div>}
  </>;
}
