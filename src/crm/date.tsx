import { useEffect, useId, useRef, useState } from 'react';
import { DayPicker, faIR } from '@daypicker/persian';
import '@daypicker/react/style.css';
import { formatPersianDate, toGregorianDateInput } from './format';

export function PersianDatePicker({ value, onChange, label = 'تاریخ' }: { value: string; onChange(value: string): void; label?: string }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const selected = value ? new Date(`${value}T12:00:00`) : undefined;
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent | PointerEvent) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') setOpen(false);
      if (event instanceof PointerEvent && !container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close); };
  }, [open]);
  return <div className="crm-date-picker" ref={container}>
    <label htmlFor={buttonId}>{label}</label>
    <button id={buttonId} type="button" className="crm-field date-trigger" aria-expanded={open} onClick={() => setOpen(current => !current)}>{selected ? formatPersianDate(selected.toISOString()) : 'انتخاب تاریخ'}</button>
    {open && <div className="calendar-popover glass" role="dialog" aria-label={`انتخاب ${label}`}>
      <DayPicker locale={faIR} dir="rtl" mode="single" selected={selected} onSelect={date => { if (date) onChange(toGregorianDateInput(date)); setOpen(false); }} />
      {value && <button className="text-button" type="button" onClick={() => { onChange(''); setOpen(false); }}>پاک‌کردن تاریخ</button>}
    </div>}
  </div>;
}
