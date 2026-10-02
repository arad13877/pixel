import type { ImgHTMLAttributes } from 'react';
import { imageVariants } from './image-variants.generated';

export default function ResponsiveImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const image = typeof props.src === 'string' ? imageVariants[props.src] : undefined;
  const srcSet = image ? [...image.variants.map(variant => `${variant.url} ${variant.width}w`), `${props.src} ${image.width}w`].join(', ') : undefined;
  return <img {...props} width={props.width || image?.width} height={props.height || image?.height} srcSet={props.srcSet || srcSet} sizes={props.sizes || (srcSet ? '(max-width: 760px) 90vw, (max-width: 1200px) 45vw, 600px' : undefined)}/>;
}
