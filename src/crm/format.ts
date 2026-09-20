const dateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tehran' });
const dateTimeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran' });

export function formatPersianDate(value?: string | null, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return (withTime ? dateTimeFormatter : dateFormatter).format(date);
}

export function toPersianNumber(value: number | string) {
  return new Intl.NumberFormat('fa-IR').format(typeof value === 'string' ? Number(value) : value);
}

export function toGregorianDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function tehranDayBounds(reference = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(reference);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const midnightUtc = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)) - (3.5 * 60 * 60 * 1000);
  return { start: new Date(midnightUtc), end: new Date(midnightUtc + 24 * 60 * 60 * 1000) };
}

export function tehranDueIso(date: string) {
  return new Date(`${date}T09:00:00+03:30`).toISOString();
}
