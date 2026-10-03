export type PropertyType = 'apartment' | 'villa' | 'land' | 'commercial';
export type TransactionType = 'sale' | 'rent';

export interface DemoProperty {
  id: string;
  title: string;
  type: PropertyType;
  transaction: TransactionType;
  district: string;
  area: number;
  rooms: number | null;
  /** Purchase price or rental deposit, in millions of tomans; all values are fictional. */
  price: number;
  monthlyRent?: number;
  image: string;
  imageAlt: string;
  description: string;
  features: string[];
}

export const propertyTypeLabels: Record<PropertyType, string> = {
  apartment: 'آپارتمان', villa: 'ویلا', land: 'زمین', commercial: 'تجاری',
};

export const demoProperties: DemoProperty[] = [
  {
    id: 'GK-101', title: 'آپارتمان ۱۲۰ متری در ناهارخوران', type: 'apartment', transaction: 'sale',
    district: 'ناهارخوران', area: 120, rooms: 2, price: 10900, image: 'apartment-120',
    imageAlt: 'تصویر کانسپت یک آپارتمان روشن با بالکن و مبلمان کرم؛ ملک واقعی نیست',
    description: 'نشیمن نورگیر، بالکن رو به فضای سبز و چیدمانی که برای زندگی روزمره جا دارد.',
    features: ['۲ اتاق خواب', 'طبقهٔ سوم', 'پارکینگ', 'آسانسور', 'بالکن'],
  },
  {
    id: 'GK-102', title: 'آپارتمان ۹۵ متری در عدالت', type: 'apartment', transaction: 'rent',
    district: 'عدالت', area: 95, rooms: 2, price: 700, monthlyRent: 16, image: 'apartment-95',
    imageAlt: 'تصویر کانسپت یک آپارتمان شهری با آشپزخانهٔ باز و جزئیات چوبی؛ ملک واقعی نیست',
    description: 'یک خانهٔ جمع‌وجور با آشپزخانهٔ باز، نور صبح و فضایی برای یک میز چهارنفره.',
    features: ['۲ اتاق خواب', 'طبقهٔ دوم', 'پارکینگ', 'آسانسور', 'آشپزخانهٔ باز'],
  },
  {
    id: 'GK-103', title: 'ویلای مدرن در زیارت', type: 'villa', transaction: 'sale',
    district: 'زیارت', area: 240, rooms: 3, price: 23500, image: 'villa',
    imageAlt: 'تصویر کانسپت ویلای مدرن سنگی میان درختان و تپه‌ها؛ عکس زیارت یا ملک واقعی نیست',
    description: 'فرم معماری ساده، پنجره‌های بلند و تراسی برای نشستن رو به سبزیِ حیاط.',
    features: ['۳ اتاق خواب', '۲ طبقه', 'زمین ۳۸۰ متری', 'تراس', 'حیاط اختصاصی'],
  },
  {
    id: 'GK-104', title: 'آپارتمان ۱۴۰ متری در گلشهر', type: 'apartment', transaction: 'sale',
    district: 'گلشهر', area: 140, rooms: 3, price: 14200, image: 'apartment-140',
    imageAlt: 'تصویر کانسپت نشیمن آپارتمان با کف سنگی و پنجره‌های بزرگ؛ ملک واقعی نیست',
    description: 'نشیمنی باز با پنجره‌های سرتاسری، جزئیات گرم چوب و فضای جدا برای میز غذاخوری.',
    features: ['۳ اتاق خواب', 'طبقهٔ چهارم', 'پارکینگ', 'آسانسور', 'انباری'],
  },
  {
    id: 'GK-105', title: 'زمین ۳۵۰ متری در اطراف گرگان', type: 'land', transaction: 'sale',
    district: 'شهرک بهارستان', area: 350, rooms: null, price: 4900, image: 'land',
    imageAlt: 'تصویر کانسپت قطعه زمین سبز با دیوار کوتاه در حاشیهٔ یک شهر خیالی',
    description: 'قطعه‌ای با فرم منظم و دسترسی از مسیر محلی؛ پیشنهادی برای نمایش یک فایل زمین.',
    features: ['۳۵۰ متر زمین', 'فرم منظم', 'دسترسی محلی', 'بدون بنای موجود'],
  },
  {
    id: 'GK-106', title: 'واحد تجاری در مرکز شهر', type: 'commercial', transaction: 'rent',
    district: 'مرکز شهر', area: 65, rooms: null, price: 950, monthlyRent: 28, image: 'commercial',
    imageAlt: 'تصویر کانسپت واحد تجاری با ویترین بزرگ در یک خیابان شهری خیالی',
    description: 'ویترین رو به خیابان و فضای یکپارچه؛ برای تصور چیدمان یک کسب‌وکار کوچک.',
    features: ['۶۵ متر زیربنا', 'طبقهٔ همکف', 'ویترین سرتاسری', 'فضای یکپارچه'],
  },
];

export const districts = [
  { name: 'ناهارخوران', image: 'apartment-120', caption: 'برای یک خانهٔ نورگیر', description: 'در این مجموعهٔ نمونه، آپارتمانی با بالکن و نشیمن روشن را اینجا می‌بینید.' },
  { name: 'زیارت', image: 'villa', caption: 'برای یک مکثِ سبز', description: 'یک ویلای فرضی با تراس و حیاط؛ تصویری از زندگی با فضای باز بیشتر.' },
  { name: 'گلشهر', image: 'apartment-140', caption: 'برای جا باز کردن', description: 'گزینهٔ نمونهٔ این محدوده، خانه‌ای سه‌خوابه با نشیمن بزرگ است.' },
  { name: 'عدالت', image: 'apartment-95', caption: 'برای زندگی روزمره', description: 'یک آپارتمان جمع‌وجور در فهرست اجاره؛ با نور و چیدمان کاربردی.' },
  { name: 'شهرک بهارستان', image: 'land', caption: 'برای فکر کردن به آینده', description: 'نمونهٔ یک فایل زمین؛ برای بررسی مساحت، دسترسی و نیاز شما.' },
  { name: 'مرکز شهر', image: 'commercial', caption: 'برای شروع یک کسب‌وکار', description: 'یک واحد تجاری فرضی با ویترین باز و فضای قابل چیدمان.' },
];

export function formatDemoPrice(millions: number) {
  return millions >= 1000
    ? `${(millions / 1000).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} میلیارد تومان`
    : `${millions.toLocaleString('fa-IR')} میلیون تومان`;
}

export function parseBudget(value: string): number | null {
  const normalized = value.trim().replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[٬,\s]/g, '').replace('٫', '.');
  if (!normalized) return null;
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return NaN;
  return Number(normalized);
}
