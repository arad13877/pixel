/** Decorative material only; size, radius, content and behavior stay with the host. */
export default function LiquidGlassMaterial() {
  return <span className="liquid-glass__optics" aria-hidden="true">
    <span className="liquid-glass__base" />
    <span className="liquid-glass__blur-top" />
    <span className="liquid-glass__blur-mid" />
    <span className="liquid-glass__blur-deep" />
    <span className="liquid-glass__fog" />
    <span className="liquid-glass__depth" />
    <span className="liquid-glass__light" />
  </span>;
}
