export interface PortfolioPayload {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  imagePath: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  label: string;
  service: string;
  conceptNote: string;
  theme: 'mint' | 'sand' | 'carbon' | 'coffee' | 'estate' | 'client';
}

export interface PublishedPortfolioItem {
  id: string;
  kind: 'client' | 'concept';
  payload: PortfolioPayload;
  sortOrder: number;
}

export const portfolioFixtures: PublishedPortfolioItem[] = [
  {
    id: '20000000-0000-0000-0000-000000000001', kind: 'concept', sortOrder: 10,
    payload: { title: 'نیلورا؛', subtitle: 'آرامش، پیش از اولین مراجعه.', description: 'یک لندینگ فارسی برای کلینیک دندانپزشکی فرضی؛ با مسیر روشن آشنایی با خدمات و فرم نمایشی درخواست نوبت.', link: '/portfolio/nilora/', imagePath: '/images/nilora/reception.jpg', imageAlt: 'فضای داخلی فرضی کلینیک دندانپزشکی نیلورا', imageWidth: 1536, imageHeight: 1024, label: 'NILORA / DENTAL CONCEPT', service: 'طراحی لندینگ', conceptNote: 'کانسپت نمایشی پیکسل؛ کلینیک واقعی نیست', theme: 'mint' },
  },
  {
    id: '20000000-0000-0000-0000-000000000002', kind: 'concept', sortOrder: 20,
    payload: { title: 'وِلوما؛', subtitle: 'فشن، بدون قواعد تکراری.', description: 'یک لندینگ فارسی برای برند پوشاک فرضی؛ با تصویرپردازی ادیتوریال، تایپوگرافی جسور و مسیری ساده برای کشف کالکشن نمایشی.', link: '/portfolio/veloma/', imagePath: '/images/veloma/hero.jpg', imageAlt: 'تصویر ادیتوریال نمایشی فشن وِلوما با کت تیره در استودیو', imageWidth: 1122, imageHeight: 1402, label: 'VELOMA / FASHION CONCEPT', service: 'طراحی لندینگ', conceptNote: 'کانسپت نمایشی پیکسل؛ برند واقعی نیست', theme: 'sand' },
  },
  {
    id: '20000000-0000-0000-0000-000000000003', kind: 'concept', sortOrder: 30,
    payload: { title: 'لاین صفر؛', subtitle: 'جزئیات، اتفاقی نیستند.', description: 'یک لندینگ فارسی برای استودیوی فرضی دیتیلینگ خودرو؛ با تصویرپردازی صنعتی، خدمات پیشنهادی و مسیر روشن درخواست نمایشی.', link: '/portfolio/zero-line/', imagePath: '/images/zero-line/hero.jpg', imageAlt: 'خودروی تیرهٔ بی‌نشان در استودیوی صنعتی با نور لیمویی', imageWidth: 1672, imageHeight: 941, label: 'ZERO LINE / DETAILING CONCEPT', service: 'طراحی لندینگ', conceptNote: 'کانسپت نمایشی پیکسل؛ کسب‌وکار واقعی نیست', theme: 'carbon' },
  },
  {
    id: '20000000-0000-0000-0000-000000000004', kind: 'concept', sortOrder: 40,
    payload: { title: 'کافه روما؛', subtitle: 'کمی مکث، کمی روما.', description: 'یک لندینگ فارسی برای کافه‌ای فرضی در گرگان؛ با هویت گرم و ادیتوریال، تصاویر اختصاصی، منوی قابل فیلتر و تجربهٔ نمایشی رزرو میز.', link: '/portfolio/roma/', imagePath: '/images/roma/interior.jpg', imageAlt: 'فضای پیشنهادی کافه روما با چوب گردویی، صندلی زیتونی و نور طبیعی', imageWidth: 1536, imageHeight: 1024, label: 'ROMA / CAFÉ CONCEPT', service: 'طراحی لندینگ', conceptNote: 'کانسپت نمایشی پیکسل؛ کافهٔ واقعی نیست', theme: 'coffee' },
  },
  {
    id: '20000000-0000-0000-0000-000000000005', kind: 'concept', sortOrder: 50,
    payload: { title: 'گرگان‌خانه؛', subtitle: 'یک انتخاب روشن، برای فصل بعدی زندگی.', description: 'یک لندینگ فارسی برای مجموعهٔ املاک فرضی در گرگان؛ با هویت لوکس، تصاویر اختصاصی، جستجوی فایل‌های نمونه و جزئیات در همان صفحه.', link: '/portfolio/gorgan-khaneh/', imagePath: '/images/gorgan-khaneh/villa.jpg', imageAlt: 'تصویر کانسپت یک ویلای مدرن سنگی در فضای سبز؛ ملک واقعی نیست', imageWidth: 1536, imageHeight: 1024, label: 'GORGAN KHANEH / REAL ESTATE CONCEPT', service: 'طراحی لندینگ املاک', conceptNote: 'کانسپت نمایشی پیکسل؛ دفتر املاک واقعی نیست', theme: 'estate' },
  },
];
