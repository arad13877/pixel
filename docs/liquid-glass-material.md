# Header material experiment

Only visual source: [Figma Buttons, node 24:59](https://www.figma.com/design/4GHiL0Wmbbytuoxm3DJzJE?node-id=24-59).
Inspected directly with Figma MCP design context and a read-only traversal of that instance.
No other Figma nodes outside its subtree were used. Icons, layout, dimensions and content were not copied.

## Material map

| Source layer | Observed properties | Browser adaptation |
| --- | --- | --- |
| Shadow 24:36 | Black 20%, vertical offset 21, layer blur 40, luminosity blend | Neutral external shadow, CSS blur 40; box-shadow approximates the offset blurred shape |
| Rectangle 3, alpha mask | 1% black interior, background blur 1, directional inner highlights, 3px overlay contour | Clear base lens, independent 1px backdrop filter; alpha mask has a 1% interior and stronger edge |
| Rectangle 10 | Gray #e1e1e1, 50% opacity, layer blur 50, behind the alpha mask | 25px CSS layer blur and combined center/ring mask; approximately 0.5% gray coverage at the center |
| Rectangle 4 | Additive white 5%; background blur 1 at center to 10 at bottom; layer blur 10 at top to 1 at center; texture radius 5, noise size 100 | Independent masked blur layers above the clear base, plus subtle neutral procedural edge texture |
| Rectangle 11 | Horizontally flipped; black 30% and 20% inner contours; opposing white highlights | Separate dark depth and white light layers; mirrored horizontal shadow direction |
| Rectangles 7–9 | Three directional white gradient strokes, 1px wide, 1px Figma layer blur; two opposing orientations | Masked 1px perimeter gradients with 0.5px CSS softness; transparent center |

Black 7% fills under additive blending in the stroke layers are not interpreted as a dark background.
The mask is important: copying the raw 50% fog opacity across the whole header makes an opaque gray bar.
White perimeter gradients must be ring-masked; a border-box background also paints the interior.

## Reuse

The existing navbar alone has `liquid-glass` and contains `<LiquidGlassMaterial />`.
The component is decorative and aria-hidden; it owns no interaction, geometry or state.
The host owns radius, dimensions, padding and content. Material tokens are scoped to `.liquid-glass`.
The mobile dropdown and all other cards/buttons retain their existing styling.

Optical layers sample the page as siblings. Avoid applying a backdrop filter, opacity or mask to their container.
Additive highlights are isolated separately: otherwise Chromium can composite the unblurred source back over the lens.

## Fidelity limits

CSS reproduces transparency, ring masking, neutral shadows and directional highlights natively.
Figma's continuous progressive blur is approximated with masked Gaussian blur layers.
The exact rendered mask profile, mixed inner-shadow blend modes and Figma texture shader are not directly portable;
the procedural monochrome texture is a subtle approximation. This node contains no native GLASS effect or
physical refraction shader, so no invented chromatic dispersion or animated distortion is added.
The result is an experiment derived from the material, not a claim of identical rendering across engines.

No dependencies, pointer tracking, scroll listeners or animation logic are added by the material.
Fallbacks cover missing backdrop-filter and reduced transparency. Existing reduced-motion and smart-header behavior remain in control.
