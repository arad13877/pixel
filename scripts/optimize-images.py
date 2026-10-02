"""Create responsive derivatives; preserve every original image and its URL."""
from pathlib import Path
from PIL import Image, ImageOps
import json

root = Path(__file__).resolve().parent.parent / 'public' / 'images'
catalog = {}
for source in sorted(root.rglob('*.jpg')):
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        variants = []
        for width in (600, 1000):
            if width > image.width:
                continue
            derivative = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            target = source.with_name(f'{source.stem}-{width}.webp')
            derivative.save(target, 'WEBP', quality=90, method=6)
            variants.append({'url': '/images/' + target.relative_to(root).as_posix(), 'width': width})
            print(f'{target.relative_to(root)}: {target.stat().st_size} bytes')
        catalog['/images/' + source.relative_to(root).as_posix()] = {'width': image.width, 'height': image.height, 'variants': variants}
with Image.open(root / 'interior.webp') as image:
    for width in (240, 360):
        image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS).save(root / f'interior-{width}.webp', 'WEBP', quality=90, method=6)
output = root.parent.parent / 'src' / 'image-variants.generated.ts'
output.write_text('export const imageVariants: Record<string, { width: number; height: number; variants: { url: string; width: number }[] }> = ' + json.dumps(catalog, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
