// GoldOrnament — zlaté dekorativní detaily: jemná linka s diamantem
// uprostřed a rohové zdobení. Čisté SVG/CSS, žádné obrázky.

export function GoldRule({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className ?? ""}`}
      aria-hidden
      data-testid="gold-rule"
    >
      <span className="gold-rule h-px w-16 sm:w-28" />
      <svg viewBox="0 0 24 24" className="size-3.5 animate-spin-slow">
        <path
          d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
          fill="url(#goldGrad)"
        />
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E7C79B" />
            <stop offset="50%" stopColor="#B98A5E" />
            <stop offset="100%" stopColor="#FFF3E2" />
          </linearGradient>
        </defs>
      </svg>
      <span className="gold-rule h-px w-16 sm:w-28" />
    </div>
  );
}

/** Zlaté rohové zdobení pro sekce a karty. */
export function GoldCorners({ className }: { className?: string }) {
  const corner = "absolute size-10 border-[#C9A06F]/55";
  return (
    <div className={`pointer-events-none absolute inset-3 ${className ?? ""}`} aria-hidden>
      <span className={`${corner} top-0 left-0 rounded-tl-[14px] border-t border-l`} />
      <span className={`${corner} top-0 right-0 rounded-tr-[14px] border-t border-r`} />
      <span className={`${corner} bottom-0 left-0 rounded-bl-[14px] border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 rounded-br-[14px] border-b border-r`} />
    </div>
  );
}

/** Zlatý prach — několik blikajících tečiček pro oživení ploch. */
export function GoldDust({ count = 10, seed = 1 }: { count?: number; seed?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const r = (Math.sin((i + 1) * seed * 12.9898) * 43758.5453) % 1;
        const r2 = (Math.sin((i + 2) * seed * 78.233) * 12345.6789) % 1;
        return (
          <span
            key={`dust-${seed}-${i}`}
            className="animate-gold-twinkle absolute rounded-full bg-[#E2BB83]"
            style={{
              top: `${Math.abs(r) * 100}%`,
              left: `${Math.abs(r2) * 100}%`,
              width: `${3 + Math.abs(r) * 3}px`,
              height: `${3 + Math.abs(r) * 3}px`,
              animationDelay: `${Math.abs(r2) * 3}s`,
            }}
          />
        );
      })}
    </div>
  );
}
