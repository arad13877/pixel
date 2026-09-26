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
  theme: 'mint' | 'sand' | 'carbon' | 'client';
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
];
