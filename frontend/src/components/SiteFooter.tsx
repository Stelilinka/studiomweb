// SiteFooter — patička v pudrové paletě s kontaktem, hodinami a správou.

import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import LogoBadge from "@/components/LogoBadge";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#EFDCD4] bg-[#F3E4DC] text-[#5E4238]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[0.7fr_1fr_1fr]">
        <div>
          <LogoBadge className="w-40" />
        </div>

        <div>
          <p className="font-heading text-[10px] tracking-[0.26em] text-[#A98F84] uppercase">
            Kontakt
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[#6B4F45]">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-[#C08272]" aria-hidden />
              Vinohradská 48, Praha 2
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-[#C08272]" aria-hidden />
              +420 777 123 456
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-[#C08272]" aria-hidden />
              ahoj@studiom.cz
            </li>
            <li className="flex items-center gap-2.5">
              <Instagram className="size-4 text-[#C08272]" aria-hidden />
              @studio.m.nails
            </li>
          </ul>
        </div>

        <div>
          <p className="font-heading text-[10px] tracking-[0.26em] text-[#A98F84] uppercase">
            Otevírací doba
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[#6B4F45]">
            <li className="flex justify-between gap-6">
              <span>Pondělí – pátek</span>
              <span className="text-[#5E4238]">9:00 – 19:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Sobota</span>
              <span className="text-[#5E4238]">9:00 – 18:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Neděle</span>
              <span className="text-[#C08272]">Zavřeno</span>
            </li>
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-[#8A7972]">
            Online objednání je dostupné nepřetržitě — termín vyberete i večer z mobilu.
          </p>
        </div>
      </div>

      <div className="border-t border-[#E6D2CA]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-[11px] text-[#A98F84] sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Studio M — Všechna práva vyhrazena.</p>
          <p>Objednávkový systém s AI asistencí</p>
          <Link
            to="/admin"
            className="transition-colors duration-300 hover:text-[#C08272]"
            data-testid="footer-admin-link"
          >
            Správa rezervací
          </Link>
        </div>
      </div>
    </footer>
  );
}
