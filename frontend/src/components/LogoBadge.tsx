// LogoBadge — kulaté logo studia jako v předloze (monogram + větvička + podpis).
// Čistě SVG/CSS, žádná fotka.

export default function LogoBadge({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex aspect-square items-center justify-center rounded-full border border-[#E9B9AE]/70 bg-[#FAF3EE] p-1 shadow-[0_18px_40px_-24px_rgba(74,59,52,0.35)] ${className ?? ""}`}
      data-testid="studio-logo-badge"
    >
      <div className="flex size-full flex-col items-center justify-center rounded-full border border-[#E9B9AE]/50 bg-gradient-to-br from-[#FFFBF8] via-[#F8E7E1] to-[#EFD9D2] text-center">
        <div className="relative flex items-baseline justify-center">
          <span className="font-heading text-[2.6rem] leading-none tracking-[-0.04em] text-[#6B4F45]">
            S
          </span>
          <span className="font-heading text-[2.6rem] leading-none tracking-[-0.04em] text-[#6B4F45]">
            M
          </span>
          {/* větvička */}
          <svg viewBox="0 0 40 60" className="absolute -right-6 -top-2 h-12 w-8" aria-hidden>
            <path d="M20 58 C20 40 20 20 20 4" stroke="#A9B5A3" strokeWidth="1.4" fill="none" />
            {[10, 20, 30, 40].map((y, i) => (
              <g key={y}>
                <ellipse
                  cx={13 - i * 0.4}
                  cy={y}
                  rx="6"
                  ry="3.4"
                  fill="#A9B5A3"
                  opacity={0.85 - i * 0.12}
                  transform={`rotate(-28 ${13 - i * 0.4} ${y})`}
                />
                <ellipse
                  cx={27 + i * 0.4}
                  cy={y + 5}
                  rx="6"
                  ry="3.4"
                  fill="#A9B5A3"
                  opacity={0.72 - i * 0.1}
                  transform={`rotate(28 ${27 + i * 0.4} ${y + 5})`}
                />
              </g>
            ))}
          </svg>
        </div>
        <p className="mt-1.5 font-heading text-[0.68rem] tracking-[0.34em] text-[#8A7972] uppercase">
          Studio M
        </p>
        <span className="mt-1 h-px w-10 bg-[#C79A7B]/60" aria-hidden />
        <p className="mt-1 font-script text-base leading-none text-[#C08272]">
          tvé nehty — tvůj styl
        </p>
        <span className="mt-1 text-[#C79A7B]" aria-hidden>
          ♥
        </span>
      </div>
    </div>
  );
}
