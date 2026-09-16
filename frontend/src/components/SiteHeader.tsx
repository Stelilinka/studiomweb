// SiteHeader — skleněná lepkavá navigace s monogramem, kotvami a CTA.

import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ANCHORS = [
  { href: "#sluzby", label: "Služby" },
  { href: "#ai-studio", label: "AI Studio" },
  { href: "#filozofie", label: "O nás" },
  { href: "#recenze", label: "Recenze" },
];

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E8E1D7]/70 bg-[#FAF7F2]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#hero"
          data-testid="nav-brand-logo"
          className="flex items-center gap-2.5"
          aria-label="Studio M — domovská stránka"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-[#1C1917] font-heading text-lg font-semibold text-[#F5D0C5]">
            M
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-lg tracking-tight text-[#1C1917]">Studio M</span>
            <span className="text-[11px] tracking-[0.18em] text-[#6E675F] uppercase">Nail ateliér</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Hlavní navigace">
          {ANCHORS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="text-sm text-[#57534E] transition-colors duration-300 hover:text-[#9E4733]"
            >
              {a.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            data-testid="nav-admin-portal-button"
            className="hidden text-sm text-[#6E675F] transition-colors duration-300 hover:text-[#9E4733] sm:block"
          >
            Správa
          </Link>
          <Button
            render={
              <a href="#rezervace" data-testid="nav-book-appointment-button">
                <Sparkles className="size-4" aria-hidden />
                Rezervovat termín
              </a>
            }
          />
        </div>
      </div>
    </header>
  );
}
