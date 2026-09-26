-- Add the fictional concept to the published portfolio data source.
-- Use the workspace of the existing fictional concepts rather than a generated workspace ID.
with concept as (
  select workspace_id, jsonb_build_object(
    'title', 'لاین صفر؛',
    'subtitle', 'جزئیات، اتفاقی نیستند.',
    'description', 'یک لندینگ فارسی برای استودیوی فرضی دیتیلینگ خودرو؛ با تصویرپردازی صنعتی، خدمات پیشنهادی و مسیر روشن درخواست نمایشی.',
    'link', '/portfolio/zero-line/',
    'imagePath', '/images/zero-line/hero.jpg',
    'imageAlt', 'خودروی تیرهٔ بی‌نشان در استودیوی صنعتی با نور لیمویی',
    'imageWidth', 1672,
    'imageHeight', 941,
    'label', 'ZERO LINE / DETAILING CONCEPT',
    'service', 'طراحی لندینگ',
    'conceptNote', 'کانسپت نمایشی پیکسل؛ کسب‌وکار واقعی نیست',
    'theme', 'carbon'
  ) as payload
  from public.portfolio_items
  where id = '20000000-0000-0000-0000-000000000001'
)
insert into public.portfolio_items(id, workspace_id, kind, status, draft_payload, published_payload, sort_order, published_at)
select '20000000-0000-0000-0000-000000000003', workspace_id, 'concept', 'published', payload, payload, 30, now()
from concept
on conflict (id) do nothing;
