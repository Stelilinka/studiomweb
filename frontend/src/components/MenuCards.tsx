// MenuCards — „MENU STUDIA“: pět akvarelových karet jako v předloze.
// Akvarelový efekt je čistě CSS (gradienty + jemné vrstvy), žádné fotky.

import { Gift, Heart, Images, Sparkles, Tag } from "lucide-react";

const CARDS = [
  {
    id: "cenik",
    icon: Tag,
    title: "CENÍK",
    sub: "na služby",
    target: "#sluzby",
    bg: "linear-gradient(160deg, #EFC3B8 0%, #E3A79B 55%, #D9978A 100%)",
    ink: "#FFFFFF",
  },
  {
    id: "ukazky",
    icon: Images,
    title: "UKÁZKY",
    sub: "prací",
    target: "#galerie",
    bg: "linear-gradient(160deg, #AFBAA8 0%, #9BA894 55%, #8B9A85 100%)",
    ink: "#FFFFFF",
  },
  {
    id: "recenze",
    icon: Heart,
    title: "RECENZE",
    sub: "klientek",
    target: "#recenze",
    bg: "linear-gradient(160deg, #FBF1EA 0%, #F6E3D9 55%, #EFD6C9 100%)",
    ink: "#6B4F45",
  },
  {
    id: "objednani",
    icon: Sparkles,
    title: "OBJEDNÁNÍ",
    sub: "online",
    target: "#rezervace",
    bg: "linear-gradient(160deg, #F0BDB0 0%, #E7A899 55%, #DE9787 100%)",
    ink: "#FFFFFF",
  },
  {
    id: "akce",
    icon: Gift,
    title: "AKCE",
    sub: "a slevy",
    target: "#akce",
    bg: "linear-gradient(160deg, #F7E2D6 0%, #F0D2C2 55%, #E8C2AE 100%)",
    ink: "#6B4F45",
  },
];

export default function MenuCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" data-testid="studio-menu-cards">
      {CARDS.map((card) => (
        <a
          key={card.id}
          href={card.target}
          data-testid={`menu-card-${card.id}`}
          className="watercolor group relative flex aspect-[3/5] flex-col items-center justify-end overflow-hidden rounded-[18px] p-4 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_46px_-22px_rgba(74,59,52,0.45)]"
          style={{ background: card.bg, color: card.ink }}
        >
          {/* jemný zlatý obrys jako v předloze */}
          <span
            className="pointer-events-none absolute inset-2 rounded-[13px] border border-dashed opacity-50"
            style={{ borderColor: card.ink === "#FFFFFF" ? "rgba(255,255,255,0.75)" : "rgba(199,154,123,0.8)" }}
            aria-hidden
          />
          <card.icon
            className="mb-auto mt-2 size-9 transition-transform duration-500 group-hover:scale-110"
            strokeWidth={1.2}
            aria-hidden
          />
          <p className="font-heading text-base tracking-[0.12em]">{card.title}</p>
          <p className="mt-0.5 text-[11px] tracking-[0.08em] opacity-85">{card.sub}</p>
          <span className="mt-2 text-sm opacity-80" aria-hidden>
            ♥
          </span>
        </a>
      ))}
    </div>
  );
}
