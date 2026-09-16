// SiteHeader — jemná lepkavá navigace v pudrové paletě předlohy.

import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ANCHORS = [
  { href: "#sluzby", label: "Ceník" },
  { href: "#galerie", label: "Ukázky" },
  { href: "#recenze", label: "Recenze" },
  { href: "#akce", label: "Akce" },
];

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#EFDCD4] bg-[#FAF3EE]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#hero"
          data-testid="nav-brand-logo"
          className="flex items-center gap-2.5"
          aria-label="Studio M — domovská stránka"
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-[#E9B9AE] bg-gradient-to-br from-[#FBF1EC] to-[#EFD6C9] font-heading text-base text-[#6B4F45]">
            SM
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-base tracking-[0.18em] text-[#5E4238] uppercase">
              Studio M
            </span>
            <span className="font-script text-sm text-[#B8776A]">tvé nehty — tvůj styl</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Hlavní navigace">
          {ANCHORS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="text-[11px] tracking-[0.16em] text-[#8A7972] uppercase transition-colors duration-300 hover:text-[#C08272]"
            >
              {a.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            data-testid="nav-admin-portal-button"
            className="hidden text-[11px] tracking-[0.16em] text-[#A98F84] uppercase transition-colors duration-300 hover:text-[#C08272] sm:block"
          >
            Správa
          </Link>
          <Button
            className="rounded-full bg-[#8B9A85] text-white hover:bg-[#7E8C78]"
            render={
              <a href="#rezervace" data-testid="nav-book-appointment-button">
                <Sparkles className="size-4" aria-hidden />
                Objednat se
              </a>
            }
          />
        </div>
      </div>
    </header>
  );
}
