// SiteFooter — hluboké espresso patička s kontaktem, hodinami a administrací.

import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-[#1C1917] text-[#FAF7F2]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-heading text-2xl">Studio M</p>
          <p className="mt-1 text-[11px] tracking-[0.22em] text-[#C49A6C] uppercase">Krása v každém detailu</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#D6D3D1]">
            Nail ateliér na Vinohradech. Manikúra, gel lak, modeláž i pedikúra —
            s online rezervacemi a AI návrhem designu na míru.
          </p>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.22em] text-[#C49A6C] uppercase">Kontakt</p>
          <ul className="mt-4 space-y-3 text-sm text-[#D6D3D1]">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-[#C49A6C]" aria-hidden />
              Vinohradská 48, Praha 2
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-[#C49A6C]" aria-hidden />
              +420 777 123 456
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-[#C49A6C]" aria-hidden />
              ahoj@studiom.cz
            </li>
            <li className="flex items-center gap-2.5">
              <Instagram className="size-4 text-[#C49A6C]" aria-hidden />
              @studio.m.nails
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.22em] text-[#C49A6C] uppercase">Otevírací doba</p>
          <ul className="mt-4 space-y-2 text-sm text-[#D6D3D1]">
            <li className="flex justify-between gap-6">
              <span>Pondělí – pátek</span>
              <span className="text-[#FAF7F2]">9:00 – 19:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Sobota</span>
              <span className="text-[#FAF7F2]">9:00 – 18:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Neděle</span>
              <span className="text-[#C49A6C]">Zavřeno</span>
            </li>
          </ul>
          <p className="mt-5 text-sm text-[#D6D3D1]">
            Online rezervace je dostupná nepřetržitě — termín vyberete i večer z mobilu.
          </p>
        </div>
      </div>

      <div className="border-t border-[#292524]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-[#78716C] sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Studio M — Všechna práva vyhrazena.</p>
          <p>Rezervační systém s AI asistencí · Claude + Execution Agent</p>
          <Link to="/admin" className="transition-colors duration-300 hover:text-[#F5D0C5]" data-testid="footer-admin-link">
            Správa rezervací
          </Link>
        </div>
      </div>
    </footer>
  );
}
