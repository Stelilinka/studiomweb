// Home — prémiová editorial prezentace Studia M.
// Asymetrický hero, typografické bloky, ceník jako redakční seznam,
// mozaiková galerie. Paleta: pudrová růžová · šalvěj · krém · rose gold.

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowRight,
  Clock,
  Diamond,
  HeartHandshake,
  ShieldCheck,
  Sparkles as SparkIcon,
  Star,
  Timer,
} from "lucide-react";
import BookingWizard from "@/components/BookingWizard";
import ChatAssistant from "@/components/ChatAssistant";
import LogoBadge from "@/components/LogoBadge";
import MenuCards from "@/components/MenuCards";
import NailCanvas, {
  FINISH_LABELS,
  SHAPE_LABELS,
  type NailFinish,
  type NailShape,
} from "@/components/NailCanvas";
import { Reveal } from "@/components/Reveal";
import Sparkles from "@/components/Sparkles";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { GALLERY_PHOTOS, NAIL_PHOTOS, SERVICE_PHOTOS, SERVICE_PHOTO_FALLBACK } from "@/lib/photos";
import type { Service } from "@/types";

const FEATURES = [
  { icon: ShieldCheck, title: "Sterilně", sub: "a bezpečně" },
  { icon: Diamond, title: "Premium", sub: "materiály" },
  { icon: Timer, title: "Dlouhá", sub: "výdrž" },
  { icon: HeartHandshake, title: "Přístup", sub: "ke každé" },
];

const RIBBON = [
  "Gel lak s výdrží 4+ týdny",
  "Modeláž na míru",
  "Nail art bez kompromisu",
  "Online objednání bez volání",
  "AI návrh vašeho designu",
  "Sterilní nástroje",
];

const REVIEWS = [
  {
    author: "Tereza K.",
    service: "Gel lak + Nail art",
    text: "Konečně nemusím nikam volat. Termín jsem měla vybraný za dvě minuty a nehty jsou pokaždé nádherné a drží přes měsíc bez jediného odštípnutí.",
  },
  {
    author: "Karolína M.",
    service: "Modeláž nehtů",
    text: "Jemná práce, krásné a čisté prostředí a výsledek přesně podle mé představy. Líbí se mi, že si styl můžu popsat předem.",
  },
  {
    author: "Michaela V.",
    service: "Klasická manikúra",
    text: "Líbí se mi, že hned vidím volné časy a můžu se objednat i večer z mobilu. Studio M je moje srdcová záležitost.",
  },
];

const PROMOS = [
  {
    title: "První návštěva",
    value: "−15 %",
    text: "Na svou první manikúru nebo gel lak u nás dostanete patnáctiprocentní slevu.",
  },
  {
    title: "Přiveď kamarádku",
    value: "2 × −10 %",
    text: "Přijďte spolu a slevu deset procent dostanete obě — na jakoukoliv službu.",
  },
  {
    title: "Doplnění do 4 týdnů",
    value: "−100 Kč",
    text: "Dodržíte-li interval doplnění modeláže, odečteme vám stovku z ceny.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="Hodnocení 5 z 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-3.5 fill-[#C79A7B] text-[#C79A7B]" aria-hidden />
      ))}
    </div>
  );
}

/** Redakční nadpis sekce — číslovaný index, vlasová linka, levé zarovnání. */
function SectionHead({
  index,
  kicker,
  title,
  script,
  align = "left",
  testId,
}: {
  index: string;
  kicker: string;
  title: string;
  script?: string;
  align?: "left" | "center";
  testId?: string;
}) {
  return (
    <div
      className={align === "center" ? "text-center" : "max-w-2xl text-left"}
      data-testid={testId}
    >
      <div
        className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#C79A7B]">{index}</span>
        <span className="h-px w-12 bg-gradient-to-r from-[#D9BFB2] to-transparent" aria-hidden />
        <span className="text-[10px] tracking-[0.3em] text-[#A98F84] uppercase">{kicker}</span>
      </div>
      <h2 className="mt-4 font-heading text-[2rem] leading-[1.02] tracking-[0.02em] text-[#5E4238] sm:text-[2.9rem]">
        {title}
      </h2>
      {script && <p className="mt-2 font-script text-2xl text-[#B8776A] sm:text-3xl">{script}</p>}
    </div>
  );
}

export default function Home() {
  const [autoServiceId, setAutoServiceId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [shape, setShape] = useState<NailShape>("mandle");
  const [finish, setFinish] = useState<NailFinish>("glazed");
  const [length, setLength] = useState<1 | 2 | 3>(2);

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: () => apiGet<Service[]>("/services"),
  });
  const services = servicesQuery.data ?? [];

  const pickService = (id: string) => {
    setAutoServiceId(id);
    document.getElementById("rezervace")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#FAF3EE] text-[#4A3B34] antialiased">
      <SiteHeader />

      {/* ===== HERO — asymetrický editorial blok ===== */}
      <section id="hero" className="relative px-5 pt-28 pb-10 sm:px-8 sm:pt-36 lg:pb-20">
        {/* pudrové světelné plochy — čistě CSS */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="animate-aurora absolute -top-24 -left-24 size-[420px] rounded-full bg-[#F3D3C9] blur-[110px]" />
          <div className="animate-aurora absolute top-40 right-0 size-[360px] rounded-full bg-[#CFD8C8] blur-[130px] [animation-delay:-6s]" />
          <div className="hairline-grid absolute inset-0 opacity-[0.5]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-end gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          {/* levá strana — typografie */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex size-2 items-center justify-center">
                <span className="animate-pulse-soft absolute size-2 rounded-full bg-[#8B9A85]" />
              </span>
              <p className="text-[10px] tracking-[0.34em] text-[#A98F84] uppercase">
                Nehtové studio · Česko
              </p>
            </div>

            <h1 className="mt-6 font-heading text-[3.4rem] leading-[0.86] tracking-[-0.01em] text-[#5E4238] sm:text-[5.4rem] lg:text-[6.2rem]">
              <span className="block">Ideální</span>
              <span className="block italic text-[#C08272]">manikúra</span>
              <span className="mt-2 block text-[0.34em] tracking-[0.42em] text-[#A98F84] uppercase">
                Studio M
              </span>
            </h1>

            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-[#6B4F45]">
              Precizní modeláž, gel lak s výdrží a nail art navržený přesně pro vás.
              Termín si vyberete online — a návrh svých vysněných nehtů uvidíte ještě
              před návštěvou.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="gloss-hover rounded-full bg-[#5E4238] px-7 text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#4A3B34]"
                render={
                  <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    data-testid="hero-cta-book-button"
                  />
                }
              >
                Vybrat termín s Klárou
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <button
                type="button"
                onClick={() => scrollTo("rezervace")}
                data-testid="hero-secondary-wizard-button"
                className="group flex items-center gap-2 rounded-full border border-[#E1CCC2] px-6 py-3 text-[11px] tracking-[0.16em] text-[#6B4F45] uppercase transition-colors duration-300 hover:border-[#C08272] hover:text-[#C08272]"
              >
                Objednat se sama
                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </button>
            </div>

            {/* benefity — typografický řádek, žádné kartičky */}
            <dl
              className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-[#EADCD4] pt-7 sm:grid-cols-4"
              data-testid="hero-feature-icons"
            >
              {FEATURES.map((f) => (
                <div key={f.title} className="group">
                  <f.icon
                    className="size-5 text-[#C08272] transition-transform duration-500 group-hover:-translate-y-0.5"
                    strokeWidth={1.2}
                    aria-hidden
                  />
                  <dt className="mt-2.5 text-[11px] tracking-[0.14em] text-[#5E4238] uppercase">
                    {f.title}
                  </dt>
                  <dd className="text-[11px] text-[#A98F84]">{f.sub}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* pravá strana — vrstvená fotokompozice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[460px] lg:mr-0"
          >
            <span
              className="absolute -top-5 -left-5 hidden size-28 rounded-full border border-[#D9BFB2] sm:block"
              aria-hidden
            />
            <div className="gloss relative overflow-hidden rounded-[32px_32px_140px_32px] border border-[#EFDCD4] shadow-[0_40px_90px_-50px_rgba(74,59,52,0.55)]">
              <img
                src={NAIL_PHOTOS.heroRight}
                alt="Modeláž nehtů s jemným zdobením"
                className="aspect-[4/5] size-full object-cover"
                data-testid="hero-photo-right"
              />
              <Sparkles count={14} seed={2} color="#FFFFFF" className="z-10" />
            </div>

            <div className="absolute -bottom-10 -left-6 w-40 overflow-hidden rounded-[24px_80px_24px_24px] border-4 border-[#FAF3EE] shadow-[0_24px_50px_-28px_rgba(74,59,52,0.5)] sm:w-48">
              <img
                src={NAIL_PHOTOS.heroLeft}
                alt="Detail jemné pudrové manikúry"
                className="aspect-square size-full object-cover"
                data-testid="hero-photo-left"
              />
            </div>

            <div className="absolute -right-2 -bottom-6 rounded-2xl border border-[#EFDCD4] bg-white/80 px-4 py-3 text-right backdrop-blur-md sm:-right-6">
              <p className="font-heading text-2xl text-[#5E4238]">4,9</p>
              <p className="text-[10px] tracking-[0.18em] text-[#A98F84] uppercase">
                380+ recenzí
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== BĚŽÍCÍ PÁS ===== */}
      <div
        className="relative flex overflow-hidden border-y border-[#EADCD4] bg-[#F3E4DC] py-3.5"
        data-testid="ribbon-marquee"
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
            {RIBBON.map((item) => (
              <span
                key={item}
                className="flex items-center gap-10 text-[11px] tracking-[0.22em] whitespace-nowrap text-[#8A7972] uppercase"
              >
                {item}
                <SparkIcon className="size-3 text-[#C79A7B]" aria-hidden />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* ===== MENU STUDIA ===== */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_2.3fr] lg:items-center">
            <Reveal>
              <SectionHead
                index="01"
                kicker="Menu studia"
                title="Co pro vás umíme"
                script="s citem pro detail"
                testId="menu-section-title"
              />
              <div className="mt-10 w-44">
                <LogoBadge />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <MenuCards />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== CENÍK — redakční seznam s fotonáhledem ===== */}
      <section id="sluzby" className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHead
              index="02"
              kicker="Služby a ceny"
              title="Ceník bez překvapení"
              script="každá cena včetně péče"
              testId="services-section-title"
            />
          </Reveal>

          {servicesQuery.isError && (
            <p
              className="mt-8 rounded-2xl border border-[#D98A80]/40 bg-[#F8E4E0] p-5 text-sm text-[#A4463C]"
              data-testid="services-error"
            >
              Ceník se nepodařilo načíst — obnovte prosím stránku, nebo to zkuste za chvíli.
            </p>
          )}

          <div className="mt-12 border-t border-[#EADCD4]">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={0.04 * i}>
                <article
                  data-testid={`service-card-${service.id}`}
                  className="group relative grid items-center gap-4 border-b border-[#EADCD4] py-7 transition-colors duration-500 hover:bg-[#F7EBE4] sm:grid-cols-[auto_1fr_auto_auto] sm:gap-8 sm:px-4"
                >
                  <span className="font-mono text-[10px] tracking-[0.24em] text-[#C79A7B]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <h3 className="font-heading text-[1.5rem] leading-tight text-[#5E4238] sm:text-[1.75rem]">
                      {service.name}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#8A7972]">
                      {service.description}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-[10px] tracking-[0.16em] text-[#A98F84] uppercase">
                      <Clock className="size-3" aria-hidden /> {service.duration_min} min
                      <span className="text-[#D9BFB2]">·</span> {service.tag}
                    </p>
                  </div>

                  {/* fotonáhled se objeví při hoveru */}
                  <div className="pointer-events-none hidden h-24 w-32 overflow-hidden rounded-[18px] opacity-0 transition-all duration-500 group-hover:opacity-100 lg:block">
                    <img
                      src={SERVICE_PHOTOS[service.id] ?? SERVICE_PHOTO_FALLBACK}
                      alt={service.name}
                      className="size-full scale-110 object-cover transition-transform duration-[900ms] group-hover:scale-100"
                    />
                  </div>

                  <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-2">
                    <p className="font-heading text-xl whitespace-nowrap text-[#6B4F45]">
                      {service.price}
                    </p>
                    <button
                      type="button"
                      onClick={() => pickService(service.id)}
                      data-testid={`service-select-btn-${service.id}`}
                      className="group/btn flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-[#C08272] uppercase transition-colors duration-300 hover:text-[#8B9A85]"
                    >
                      Objednat
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-1"
                        aria-hidden
                      />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALERIE — mozaika ===== */}
      <section id="galerie" className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHead
              index="03"
              kicker="Ukázky prací"
              title="Každá modeláž je originál"
              script="od nude klasiky po zdobení"
              testId="gallery-section-title"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <div
              className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12"
              data-testid="gallery-grid"
            >
              {GALLERY_PHOTOS.map((photo, i) => {
                const layout = [
                  "lg:col-span-5 lg:row-span-2 aspect-[4/5]",
                  "lg:col-span-7 aspect-[16/11] lg:mt-10",
                  "lg:col-span-4 aspect-[4/5]",
                  "lg:col-span-3 aspect-[3/4] lg:mt-10",
                ][i % 4];
                return (
                  <figure
                    key={photo.src}
                    className={`group relative overflow-hidden rounded-[22px] border border-[#EFDCD4] ${layout}`}
                    data-testid={`gallery-photo-${i + 1}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="size-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.08]"
                    />
                    <figcaption
                      className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-[10px] tracking-[0.16em] text-white uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                      style={{
                        background: "linear-gradient(0deg, rgba(74,59,52,0.7) 0%, transparent 100%)",
                      }}
                    >
                      {photo.alt}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== AI STUDIO ===== */}
      <section
        id="ai-studio"
        className="relative scroll-mt-24 overflow-hidden bg-[#5E4238] px-5 py-20 text-[#F7EDE8] sm:px-8 sm:py-28"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="animate-aurora absolute -top-20 right-10 size-[380px] rounded-full bg-[#C08272]/40 blur-[120px]" />
          <div className="animate-aurora absolute -bottom-24 left-0 size-[320px] rounded-full bg-[#8B9A85]/35 blur-[120px] [animation-delay:-8s]" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#E9B9AE]">04</span>
              <span className="h-px w-12 bg-gradient-to-r from-[#C79A7B] to-transparent" aria-hidden />
              <span className="text-[10px] tracking-[0.3em] text-[#D9BFB2] uppercase">
                AI studio designu
              </span>
            </div>
            <h2 className="mt-4 font-heading text-[2.2rem] leading-[1.02] sm:text-[3rem]">
              Popište, co si přejete
            </h2>
            <p className="mt-2 font-script text-2xl text-[#E9B9AE] sm:text-3xl">
              a my to uvidíme dřív, než přijdete
            </p>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-[#E4D5CD]">
              Při rezervaci napíšete svůj vysněný design. Agent Claude z popisu připraví
              precizní zadání a druhý agent vygeneruje fotorealistický náhled vašich
              nehtů — uložený přímo u vašeho termínu.
            </p>
            <ol className="mt-8 space-y-4" data-testid="ai-studio-steps">
              {[
                "Napíšete barvy, tvar, délku i efekt",
                "Claude přemění popis na přesné zadání",
                "Druhý agent vygeneruje náhled nehtů",
                "Návrh máme připravený u vašeho termínu",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 border-b border-white/10 pb-3 text-sm text-[#F0E3DC]"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#C79A7B]">
                    0{i + 1}
                  </span>
                  {text}
                </li>
              ))}
            </ol>
            <Button
              className="gloss-hover mt-8 rounded-full bg-[#F5DDD8] text-[#5E4238] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
              render={<a href="#rezervace" data-testid="ai-studio-cta-button" />}
            >
              Zkusit při rezervaci
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[28px] border border-white/15 bg-white/8 p-6 backdrop-blur-md sm:p-8">
              <NailCanvas
                shape={shape}
                finish={finish}
                length={length}
                className="mx-auto h-[280px] w-full sm:h-[320px]"
              />
              <div className="mt-6 space-y-4" data-testid="ai-studio-controls">
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#D9BFB2] uppercase">Tvar</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Object.keys(SHAPE_LABELS) as NailShape[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setShape(s)}
                        data-testid={`shape-option-${s}`}
                        className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 ${
                          shape === s
                            ? "border-[#F5DDD8] bg-[#F5DDD8] text-[#5E4238]"
                            : "border-white/25 text-[#F0E3DC] hover:border-[#E9B9AE]"
                        }`}
                      >
                        {SHAPE_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#D9BFB2] uppercase">Finiš</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Object.keys(FINISH_LABELS) as NailFinish[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFinish(f)}
                        data-testid={`finish-option-${f}`}
                        className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 ${
                          finish === f
                            ? "border-[#A9B5A3] bg-[#A9B5A3] text-[#2F2722]"
                            : "border-white/25 text-[#F0E3DC] hover:border-[#A9B5A3]"
                        }`}
                      >
                        {FINISH_LABELS[f]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#D9BFB2] uppercase">Délka</p>
                  <div className="mt-2 flex gap-2">
                    {([1, 2, 3] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLength(l)}
                        data-testid={`length-option-${l}`}
                        className={`h-8 w-10 rounded-lg border text-xs transition-all duration-300 ${
                          length === l
                            ? "border-[#C79A7B] bg-[#C79A7B] text-white"
                            : "border-white/25 text-[#F0E3DC] hover:border-[#C79A7B]"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== REZERVACE ===== */}
      <section id="rezervace" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHead
              index="05"
              kicker="Objednání online"
              title="Čtyři kroky, žádné volání"
              align="center"
              testId="booking-section-title"
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <BookingWizard autoServiceId={autoServiceId} />
          </Reveal>
        </div>
      </section>

      {/* ===== RECENZE ===== */}
      <section id="recenze" className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead
                index="06"
                kicker="Recenze klientek"
                title="Proč se k nám vracejí"
                testId="reviews-section-title"
              />
              <Badge
                variant="outline"
                className="gap-2 rounded-full border-[#D9BFB2] bg-white/70 px-4 py-2 text-[#6B4F45]"
              >
                <Stars />
                4,9 / 5 z více než 380 recenzí
              </Badge>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((review, i) => (
              <Reveal key={review.author} delay={0.08 * i} className={i === 1 ? "md:mt-10" : ""}>
                <figure className="flex h-full flex-col border-t-2 border-[#C79A7B]/50 pt-6 transition-all duration-500 hover:border-[#C08272]">
                  <Stars />
                  <blockquote className="mt-4 flex-1 font-heading text-[1.05rem] leading-relaxed text-[#5E4238]">
                    „{review.text}“
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[#5E4238]">{review.author}</span>
                    <span className="text-[10px] tracking-[0.12em] text-[#A98F84] uppercase">
                      {review.service}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AKCE A SLEVY ===== */}
      <section id="akce" className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHead
              index="07"
              kicker="Akce a slevy"
              title="Malé pozornosti navíc"
              testId="promos-section-title"
            />
          </Reveal>
          <div
            className="mt-12 grid gap-px overflow-hidden rounded-[26px] border border-[#EADCD4] bg-[#EADCD4] md:grid-cols-3"
            data-testid="promos-grid"
          >
            {PROMOS.map((promo, i) => (
              <div
                key={promo.title}
                className="watercolor group bg-[#FBF1EC] p-8 transition-colors duration-500 hover:bg-white"
                data-testid={`promo-card-${i + 1}`}
              >
                <p className="font-heading text-[2.6rem] leading-none text-[#C08272] transition-transform duration-500 group-hover:-translate-y-1">
                  {promo.value}
                </p>
                <h3 className="mt-4 text-[11px] tracking-[0.2em] text-[#5E4238] uppercase">
                  {promo.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8A7972]">{promo.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA pás ===== */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] border border-[#EFDCD4]">
              <img
                src={NAIL_PHOTOS.zpevneni}
                alt="Jemná manikúra v pudrovém odstínu"
                className="absolute inset-0 size-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(94,66,56,0.88) 0%, rgba(94,66,56,0.45) 55%, rgba(244,219,210,0.15) 100%)",
                }}
                aria-hidden
              />
              <Sparkles count={14} seed={6} color="#F5DDD8" />
              <div className="relative max-w-xl px-8 py-16 sm:px-14 sm:py-20">
                <SparkIcon className="size-6 text-[#E9B9AE]" strokeWidth={1.2} aria-hidden />
                <h2 className="mt-5 font-heading text-[2rem] leading-[1.05] text-[#FBF1EC] sm:text-[2.7rem]">
                  Termín, popis i návrh za dvě minuty
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#EBDCD4]">
                  Rezervujte si online svůj čas ve Studiu M a nechte AI asistentku Kláru
                  připravit návrh vašich vysněných nehtů.
                </p>
                <Button
                  size="lg"
                  className="gloss-hover mt-8 rounded-full bg-[#F5DDD8] text-[#5E4238] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
                  render={
                    <button
                      type="button"
                      onClick={() => setChatOpen(true)}
                      data-testid="bottom-cta-book-button"
                    />
                  }
                >
                  Vybrat termín
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />

      <ChatAssistant open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
