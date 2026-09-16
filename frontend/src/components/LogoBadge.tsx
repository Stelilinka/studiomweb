// LogoBadge — oficiální logo studia (line-art monogram M · studio nails).
// Obrázek je tónovaný do rose gold, kolem rotuje jemný prstenec a při hoveru
// se logo nadechne. Bez fotobanky — jde o dodaný firemní podklad.

import { STUDIO_LOGO } from "@/lib/photos";

export default function LogoBadge({
  className,
  testId = "studio-logo-badge",
}: {
  className?: string;
  testId?: string;
}) {
  return (
    <div
      className={`group relative aspect-square ${className ?? ""}`}
      data-testid={testId}
    >
      {/* rotující přerušovaný prstenec */}
      <span
        className="animate-spin-slow pointer-events-none absolute inset-0 rounded-full border border-dashed border-[#C79A7B]/55"
        aria-hidden
      />
      {/* dýchající aura */}
      <span
        className="animate-pulse-soft pointer-events-none absolute -inset-3 rounded-full bg-[#F3D3C9]/40 blur-xl"
        aria-hidden
      />

      <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full border border-[#E9B9AE]/70 bg-gradient-to-br from-[#FFFBF8] via-[#F8E7E1] to-[#EFD9D2] shadow-[0_18px_40px_-24px_rgba(74,59,52,0.4)] transition-transform duration-700 group-hover:scale-[1.04]">
        <img
          src={STUDIO_LOGO}
          alt="Logo Studio M nails"
          className="size-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
          data-testid={`${testId}-image`}
        />
        {/* lesklý přejezd přes logo */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.65) 50%, transparent 65%)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
