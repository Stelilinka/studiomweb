// SiteHeader — prémiová navigace: průhledná nad hero, po odscrollování
// zhutní do krémového pásu s indikátorem průběhu čtení.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ANCHORS = [
  { href: "#sluzby", label: "Ceník", num: "02" },
  { href: "#galerie", label: "Ukázky", num: "03" },
  { href: "#ai-studio", label: "AI design", num: "04" },
  { href: "#recenze", label: "Recenze", num: "06" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[#EFDCD4] bg-[#FAF3EE]/88 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 transition-all duration-500 sm:px-8 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <a
          href="#hero"
          data-testid="nav-brand-logo"
          className="group flex items-center gap-3"
          aria-label="Studio M — domovská stránka"
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-[#E9B9AE] bg-gradient-to-br from-[#FBF1EC] to-[#EFD6C9] font-heading text-base text-[#6B4F45] transition-transform duration-500 group-hover:rotate-12">
            SM
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-base tracking-[0.22em] text-[#5E4238] uppercase">
              Studio M
            </span>
            <span className="font-script text-sm text-[#B8776A]">krásné nehty na dosah ruky</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hlavní navigace">
          {ANCHORS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="group relative flex items-baseline gap-1.5 text-[11px] tracking-[0.16em] text-[#8A7972] uppercase transition-colors duration-300 hover:text-[#C08272]"
            >
              <span className="font-mono text-[9px] text-[#C79A7B] opacity-60">{a.num}</span>
              {a.label}
              <span
                className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#C08272] transition-[width] duration-400 group-hover:w-full"
                aria-hidden
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            data-testid="nav-admin-portal-button"
            className="hidden text-[11px] tracking-[0.16em] text-[#A98F84] uppercase transition-colors duration-300 hover:text-[#C08272] sm:block"
          >
            Správa
          </Link>
          <Button
            className="gloss-hover rounded-full bg-[#5E4238] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#4A3B34]"
            render={
              <a href="#rezervace" data-testid="nav-book-appointment-button">
                <Sparkles className="size-4" aria-hidden />
                Objednat se
              </a>
            }
          />
        </div>
      </div>

      <div
        className="h-px origin-left bg-gradient-to-r from-[#C08272] to-[#A9B5A3] transition-transform duration-200"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />
    </header>
  );
}
