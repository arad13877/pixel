-- Fictional real-estate portfolio concept; no real business or property listings.
with concept as (
  select workspace_id, jsonb_build_object(
    'title', 'گرگان‌خانه؛',
    'subtitle', 'یک انتخاب روشن، برای فصل بعدی زندگی.',
    'description', 'یک لندینگ فارسی برای مجموعهٔ املاک فرضی در گرگان؛ با هویت لوکس، تصاویر اختصاصی، جستجوی فایل‌های نمونه و جزئیات در همان صفحه.',
    'link', '/portfolio/gorgan-khaneh/',
    'imagePath', '/images/gorgan-khaneh/villa.jpg',
    'imageAlt', 'تصویر کانسپت یک ویلای مدرن سنگی در فضای سبز؛ ملک واقعی نیست',
    'imageWidth', 1536,
    'imageHeight', 1024,
    'label', 'GORGAN KHANEH / REAL ESTATE CONCEPT',
    'service', 'طراحی لندینگ املاک',
    'conceptNote', 'کانسپت نمایشی پیکسل؛ دفتر املاک واقعی نیست',
    'theme', 'estate'
  ) as payload
  from public.portfolio_items
  where id = '20000000-0000-0000-0000-000000000001'
)
insert into public.portfolio_items(id, workspace_id, kind, status, draft_payload, published_payload, sort_order, published_at)
select '20000000-0000-0000-0000-000000000005', workspace_id, 'concept', 'published', payload, payload, 50, now()
from concept
on conflict (id) do nothing;
