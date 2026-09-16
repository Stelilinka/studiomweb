// Home — jednotková prezentační stránka studia s celým rezervačním wizardem.

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowRight, Clock, HeartHandshake, Leaf, ShieldCheck, Sparkles, Star } from "lucide-react";
import BookingWizard from "@/components/BookingWizard";
import NailCanvas, {
  FINISH_LABELS,
  SHAPE_LABELS,
  type NailFinish,
  type NailShape,
} from "@/components/NailCanvas";
import { Reveal } from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Service } from "@/types";

const PHILOSOPHY = [
  {
    icon: ShieldCheck,
    title: "Sterilita a bezpečí",
    text: "Chirurgická úroveň sterilizace, jednorázové nástroje a čisté prostředí v každém koutě studia.",
  },
  {
    icon: Leaf,
    title: "Kvalitní materiály",
    text: "Prémiové veganské gely bez toxických složek — šetrné k vašim nehtům i k přírodě.",
  },
  {
    icon: HeartHandshake,
    title: "Péče na míru",
    text: "Žádný spěch. Vždy si uděláme čas na konzultaci, precizní práci i doporučení po péči.",
  },
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
    text: "Jemná práce, krásné a čisté prostředí a výsledek přesně podle mé představy. Líbí se mi možnost popsat si styl předem.",
  },
  {
    author: "Michaela V.",
    service: "Klasická manikúra",
    text: "Líbí se mi, že hned vidím volné časy a můžu se objednat i večer z mobilu. Studio M je moje srdcová záležitost.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="Hodnocení 5 z 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-3.5 fill-[#C49A6C] text-[#C49A6C]" aria-hidden />
      ))}
    </div>
  );
}

export default function Home() {
  const [autoServiceId, setAutoServiceId] = useState<string | null>(null);
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

  const featured = services.find((s) => s.id === "gel-lak");
  const rest = services.filter((s) => s.id !== "gel-lak");

  return (
    <div className="min-h-svh bg-[#FAF7F2] text-[#1C1917] antialiased">
      <SiteHeader />

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 12%, #F5DED6 0%, #FAF7F2 62%, #F4EBE1 100%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge variant="outline" className="gap-1.5 border-[#C49A6C]/50 bg-white/70 px-3 py-1.5 text-[#78350F]">
                <Sparkles className="size-3.5" aria-hidden />
                Nail ateliér · Vinohrady, Praha
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[68px]"
            >
              Krása v každém
              <br />
              <em className="italic text-[#9E4733]">detailu</em> — vaše nehty,
              váš styl
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-[#57534E]"
            >
              Manikúra, gel lak, modeláž i pedikúra — a k tomu AI asistentka,
              která si vyslechne váš vysněný design a připraví fotorealistický
              návrh přímo k vašemu termínu.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" render={<a href="#rezervace" data-testid="hero-cta-book-button" />}>
                Vyberte termín
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<a href="#sluzby" data-testid="hero-cta-explore-services" />}
              >
                Objevit služby
              </Button>
            </motion.div>
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-12 flex flex-wrap gap-x-10 gap-y-4"
              data-testid="hero-stats"
            >
              {[
                { value: "4,9 / 5", label: "průměrné hodnocení" },
                { value: "1 200+", label: "spokojených klientek" },
                { value: "24 / 7", label: "online rezervace" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-heading text-2xl text-[#1C1917]">{stat.value}</dd>
                  <dd className="text-[11px] tracking-[0.16em] text-[#6E675F] uppercase">{stat.label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <div className="relative lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[32px] border border-white/60 bg-white/55 p-6 shadow-[0_40px_90px_-50px_rgba(158,71,51,0.45)] backdrop-blur-md"
            >
              <NailCanvas shape={shape} finish={finish} length={length} className="mx-auto h-[340px] w-full sm:h-[400px]" />
              <div className="animate-float absolute -left-3 top-10 rounded-full border border-[#EFEAE4] bg-white/90 px-3.5 py-1.5 text-xs text-[#57534E] shadow-sm">
                AI návrh designu
              </div>
              <div
                className="animate-float absolute -right-2 bottom-16 rounded-full border border-[#EFEAE4] bg-white/90 px-3.5 py-1.5 text-xs text-[#57534E] shadow-sm"
                style={{ animationDelay: "1.4s" }}
              >
                Rezervace 24 / 7
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SLUŽBY & CENÍK */}
      <section id="sluzby" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[11px] tracking-[0.22em] text-[#9E4733] uppercase">Služby & ceny</p>
                <h2 className="mt-3 font-heading text-4xl tracking-[-0.02em] sm:text-5xl">
                  Ritual, který si zasloužíte
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-[#6E675F]">
                Každá služba začíná konzultací — vždy vycházíme z toho, co
                nehtům opravdu prospívá. Termín vyberete přímo tady online.
              </p>
            </div>
          </Reveal>

          {servicesQuery.isError && (
            <p className="mt-8 rounded-2xl border border-[#B91C1C]/25 bg-[#B91C1C]/5 p-5 text-sm text-[#B91C1C]" data-testid="services-error">
              Ceník se nepodařilo načíst — obnovte prosím stránku, nebo to zkuste za chvíli.
            </p>
          )}

          <div className="mt-10 grid auto-rows-fr gap-4 md:grid-cols-6">
            {featured && (
              <Reveal className="md:col-span-4 md:row-span-2" delay={0}>
                <article
                  data-testid={`service-card-${featured.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#EFEAE4] bg-[#1C1917] p-8 text-[#FAF7F2] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(28,25,23,0.55)] sm:p-10"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-70"
                    style={{
                      background:
                        "radial-gradient(circle at 85% 15%, rgba(245,222,214,0.35) 0%, transparent 55%)",
                    }}
                    aria-hidden
                  />
                  <Badge className="w-fit bg-[#C49A6C] text-[#1C1917]">{featured.tag}</Badge>
                  <h3 className="mt-5 font-heading text-3xl tracking-[-0.02em] sm:text-4xl">{featured.name}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#D6D3D1]">{featured.description}</p>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
                    <div>
                      <p className="font-heading text-4xl text-[#F5D0C5]">{featured.price}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#D6D3D1]">
                        <Clock className="size-3.5" aria-hidden /> {featured.duration_min} minut
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      render={
                        <button
                          type="button"
                          onClick={() => pickService(featured.id)}
                          data-testid={`service-select-btn-${featured.id}`}
                        />
                      }
                    >
                      Vybrat službu
                      <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                </article>
              </Reveal>
            )}
            {rest.map((service, i) => (
              <Reveal key={service.id} className="md:col-span-2" delay={0.06 * (i + 1)}>
                <article
                  data-testid={`service-card-${service.id}`}
                  className="flex h-full flex-col rounded-3xl border border-[#EFEAE4] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(158,71,51,0.4)]"
                >
                  <Badge variant="secondary" className="w-fit">
                    {service.tag}
                  </Badge>
                  <h3 className="mt-4 font-heading text-xl tracking-[-0.01em]">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6E675F]">{service.description}</p>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
                    <div>
                      <p className="font-heading text-2xl text-[#9E4733]">{service.price}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#6E675F]">
                        <Clock className="size-3.5" aria-hidden /> {service.duration_min} minut
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <button
                          type="button"
                          onClick={() => pickService(service.id)}
                          data-testid={`service-select-btn-${service.id}`}
                        />
                      }
                    >
                      Vybrat
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI STUDIO */}
      <section id="ai-studio" className="scroll-mt-20 bg-[#1C1917] py-20 text-[#FAF7F2] sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] tracking-[0.22em] text-[#C49A6C] uppercase">AI Studio nehtového designu</p>
            <h2 className="mt-3 font-heading text-4xl tracking-[-0.02em] sm:text-5xl">
              Popište, co si představujete.
              <em className="italic text-[#F5D0C5]"> My to vidíme</em> dřív, než přijdete.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-[#D6D3D1]">
              Při rezervaci napíšete svůj vysněný design. Agent Claude z popisu
              připraví precizní zadání a Execution Agent vygeneruje
              fotorealistický náhled vašich nehtů — uložený přímo u vašeho
              termínu v kalendáři.
            </p>
            <ol className="mt-8 space-y-4" data-testid="ai-studio-steps">
              {[
                "Napíšete barvy, tvar, délku i efekt svého vysněného designu",
                "Claude přemění popis na precizní prompt pro obrázek",
                "Execution Agent vygeneruje fotorealistický návrh",
                "Návrh najdete u svého termínu — vše připravené předem",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#D6D3D1]">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#C49A6C]/50 font-heading text-xs text-[#C49A6C]">
                    {i + 1}
                  </span>
                  {text}
                </li>
              ))}
            </ol>
            <Button className="mt-8" variant="secondary" render={<a href="#rezervace" data-testid="ai-studio-cta-button" />}>
              Zkusit při rezervaci
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[32px] border border-[#292524] bg-[#17130F] p-6 sm:p-8">
              <NailCanvas shape={shape} finish={finish} length={length} className="mx-auto h-[300px] w-full sm:h-[340px]" />
              <div className="mt-6 space-y-4" data-testid="ai-studio-controls">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-[#A8A29E] uppercase">Tvar</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Object.keys(SHAPE_LABELS) as NailShape[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setShape(s)}
                        data-testid={`shape-option-${s}`}
                        className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 ${
                          shape === s
                            ? "border-[#C49A6C] bg-[#C49A6C] text-[#1C1917]"
                            : "border-[#292524] text-[#D6D3D1] hover:border-[#C49A6C]/60"
                        }`}
                      >
                        {SHAPE_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-[#A8A29E] uppercase">Finiš</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Object.keys(FINISH_LABELS) as NailFinish[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFinish(f)}
                        data-testid={`finish-option-${f}`}
                        className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 ${
                          finish === f
                            ? "border-[#C49A6C] bg-[#C49A6C] text-[#1C1917]"
                            : "border-[#292524] text-[#D6D3D1] hover:border-[#C49A6C]/60"
                        }`}
                      >
                        {FINISH_LABELS[f]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-[#A8A29E] uppercase">Délka</p>
                  <div className="mt-2 flex gap-2">
                    {([1, 2, 3] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLength(l)}
                        data-testid={`length-option-${l}`}
                        className={`h-8 w-10 rounded-lg border text-xs transition-all duration-300 ${
                          length === l
                            ? "border-[#C49A6C] bg-[#C49A6C] text-[#1C1917]"
                            : "border-[#292524] text-[#D6D3D1] hover:border-[#C49A6C]/60"
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

      {/* FILOZOFIE */}
      <section id="filozofie" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-[11px] tracking-[0.22em] text-[#9E4733] uppercase">Naše filozofie & standardy</p>
            <h2 className="mt-3 max-w-2xl font-heading text-4xl tracking-[-0.02em] sm:text-5xl">
              Tři sliby, které si dáváme ke každé klientce
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PHILOSOPHY.map((pillar, i) => (
              <Reveal key={pillar.title} delay={0.08 * i}>
                <div className="h-full rounded-3xl border border-[#EFEAE4] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(158,71,51,0.4)]">
                  <span className="flex size-11 items-center justify-center rounded-full bg-[#EADCD5] text-[#5C2E25]">
                    <pillar.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-heading text-2xl">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6E675F]">{pillar.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REZERVACE */}
      <section id="rezervace" className="scroll-mt-20 bg-gradient-to-b from-[#FAF7F2] to-[#F5EFEB] py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Reveal>
            <div className="text-center">
              <p className="text-[11px] tracking-[0.22em] text-[#9E4733] uppercase">Online rezervace & AI pipeline</p>
              <h2 className="mt-3 font-heading text-4xl tracking-[-0.02em] sm:text-5xl">Vyberte si svůj termín</h2>
              <p className="mx-auto mt-4 max-w-xl text-[#57534E]">
                Čtyři kroky, žádné volání. Návrh designu nehtů za vás připraví
                naši AI agenti — rovnou k vašemu termínu.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <BookingWizard autoServiceId={autoServiceId} />
          </Reveal>
        </div>
      </section>

      {/* RECENZE */}
      <section id="recenze" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[11px] tracking-[0.22em] text-[#9E4733] uppercase">Zkušenosti našich klientek</p>
                <h2 className="mt-3 font-heading text-4xl tracking-[-0.02em] sm:text-5xl">
                  Slovy klientek, které se k nám vracejí
                </h2>
              </div>
              <Badge variant="outline" className="gap-2 border-[#C49A6C]/50 px-4 py-2 text-[#78350F]">
                <Stars />
                4,9 / 5 z více než 380 recenzí
              </Badge>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {REVIEWS.map((review, i) => (
              <Reveal key={review.author} delay={0.08 * i} className={i === 1 ? "md:mt-10" : ""}>
                <figure className="flex h-full flex-col rounded-3xl border border-[#EFEAE4] bg-white p-7">
                  <Stars />
                  <blockquote className="mt-4 flex-1 font-heading text-lg leading-relaxed text-[#1C1917]">
                    „{review.text}“
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[#1C1917]">{review.author}</span>
                    <Badge variant="secondary">{review.service}</Badge>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA pás */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-[#9E4733] px-8 py-14 text-center text-[#FAF7F2] sm:px-14">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 20% 20%, rgba(250,247,242,0.25) 0%, transparent 50%)",
                }}
                aria-hidden
              />
              <h2 className="relative font-heading text-3xl tracking-[-0.02em] sm:text-4xl">
                Termín, popis i návrh — vše za dvě minuty
              </h2>
              <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#F5D0C5]">
                Rezervujte si online svůj čas ve studiu M a nechte AI asistentku
                připravit návrh vašich vysněných nehtů.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="relative mt-7"
                render={<a href="#rezervace" data-testid="bottom-cta-book-button" />}
              >
                Vyberte termín
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
