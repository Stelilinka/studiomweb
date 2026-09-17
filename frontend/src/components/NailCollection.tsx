// NailCollection — sekce s vystřiženými nehty klientky: plynulý pás,
// který se při hoveru zastaví, jednotlivé nehty se zvednou a rozsvítí
// zlatá aura. Pod pásem plovoucí zlatý prach.

import { COLLECTION_NAILS } from "@/lib/photos";

export default function NailCollection() {
  // pás skládáme z kurátorovaných segmentů (dvojitě, aby byl dost dlouhý)
  const strip = [...COLLECTION_NAILS, ...COLLECTION_NAILS].map((n) => n.src);

  return (
    <div data-testid="nail-collection">
      {/* běžící pás vystřižených nehtů */}
      <div className="group relative flex overflow-hidden py-6">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#FAF3EE] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#FAF3EE] to-transparent"
          aria-hidden
        />
        {[0, 1].map((dup) => (
          <div
            key={`strip-${dup}`}
            className="animate-marquee flex shrink-0 items-center gap-8 pr-8 group-hover:[animation-play-state:paused]"
          >
            {strip.map((src, i) => (
              <img
                key={`${dup}-${i}-${src}`}
                src={src}
                alt="Ukázka zdobeného nehtu"
                loading="lazy"
                className="animate-float-soft h-20 w-auto drop-shadow-[0_10px_18px_rgba(154,114,68,0.35)] transition-transform duration-500 hover:scale-125 sm:h-24"
                style={{ ["--rot" as string]: `${(i % 5) * 4 - 8}deg`, animationDelay: `${i * 0.35}s` }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* kolekce s názvy a zlatými rámečky */}
      <div
        className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
        data-testid="nail-collection-grid"
      >
        {COLLECTION_NAILS.map((item, i) => (
          <figure
            key={item.src}
            data-testid={`collection-item-${i + 1}`}
            className="gold-frame group relative flex flex-col items-center overflow-hidden rounded-[20px] bg-gradient-to-b from-white/85 to-[#F7E9E1] px-4 py-6 transition-all duration-500 hover:-translate-y-1.5 hover:gold-frame-hover"
          >
            {/* zlatá aura za nehtem */}
            <span
              className="absolute top-4 size-24 rounded-full bg-[radial-gradient(circle,rgba(226,187,131,0.55)_0%,transparent_70%)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
            />
            <img
              src={item.src}
              alt={`${item.name} — ${item.note}`}
              loading="lazy"
              className="relative h-24 w-auto drop-shadow-[0_12px_20px_rgba(154,114,68,0.32)] transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110 sm:h-28"
            />
            <figcaption className="relative mt-5 text-center">
              <p className="gold-text font-heading text-[0.95rem] tracking-[0.12em] uppercase">
                {item.name}
              </p>
              <p className="mt-1 text-[11px] text-[#8A7972]">{item.note}</p>
            </figcaption>
            {/* zlatý prach v rohu */}
            <span
              className="animate-gold-twinkle absolute top-3 right-4 size-1.5 rounded-full bg-[#E2BB83]"
              aria-hidden
            />
            <span
              className="animate-gold-twinkle absolute bottom-5 left-4 size-1 rounded-full bg-[#E7C79B] [animation-delay:-1.4s]"
              aria-hidden
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
