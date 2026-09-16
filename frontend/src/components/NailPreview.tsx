// NailPreview — realistický náhled místo kresleného SVG: reálné fotky nehtů,
// které se plynule prolínají podle zvoleného finiše, tvaru a délky.

import { NAIL_PHOTOS } from "@/lib/photos";

export type NailShape = "mandle" | "oval" | "stiletto" | "ctverec";
export type NailFinish = "glazed" | "mat" | "chrom" | "ombre";

export const SHAPE_LABELS: Record<NailShape, string> = {
  mandle: "Mandle",
  oval: "Oval",
  stiletto: "Stiletto",
  ctverec: "Square",
};

export const FINISH_LABELS: Record<NailFinish, string> = {
  glazed: "Glazed donut",
  mat: "Velvet mat",
  chrom: "Rose gold chrom",
  ombre: "Francouzská ombré",
};

export const LENGTH_LABELS: Record<1 | 2 | 3, string> = {
  1: "Krátká",
  2: "Střední",
  3: "Dlouhá",
};

/** Ke každému finiši reálná fotka ze studia. */
const FINISH_PHOTOS: Record<NailFinish, string> = {
  glazed: NAIL_PHOTOS.heroRight,
  mat: NAIL_PHOTOS.sageFrench,
  chrom: NAIL_PHOTOS.nailArt,
  ombre: NAIL_PHOTOS.manikura,
};

/** Jemné barevné dolazení fotky podle finiše — realistické, ne kreslené. */
const FINISH_FILTER: Record<NailFinish, string> = {
  glazed: "saturate(1.05) contrast(1.06) brightness(1.02)",
  mat: "saturate(0.82) contrast(0.96) brightness(1.01)",
  chrom: "saturate(1.18) contrast(1.12) sepia(0.12)",
  ombre: "saturate(0.95) contrast(1.04) brightness(1.04)",
};

export default function NailPreview({
  shape,
  finish,
  length,
  className,
}: {
  shape: NailShape;
  finish: NailFinish;
  length: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <figure
      className={`relative overflow-hidden rounded-[22px] border border-white/20 ${className ?? ""}`}
      data-testid="nail-preview"
    >
      {(Object.keys(FINISH_PHOTOS) as NailFinish[]).map((key) => (
        <img
          key={key}
          src={FINISH_PHOTOS[key]}
          alt={`Reálná ukázka finiše ${FINISH_LABELS[key]}`}
          className="absolute inset-0 size-full object-cover transition-opacity duration-700"
          style={{
            opacity: key === finish ? 1 : 0,
            filter: FINISH_FILTER[key],
            transform: `scale(${1.02 + length * 0.02})`,
            transition: "opacity 700ms ease, transform 900ms cubic-bezier(0.22,1,0.36,1)",
          }}
          data-testid={`nail-preview-photo-${key}`}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(0deg, rgba(47,39,34,0.62) 0%, transparent 55%)" }}
        aria-hidden
      />

      <figcaption
        className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-4 gap-y-1 p-4 text-[10px] tracking-[0.18em] text-white/90 uppercase"
        data-testid="nail-preview-caption"
      >
        <span>{FINISH_LABELS[finish]}</span>
        <span className="text-white/40">·</span>
        <span>{SHAPE_LABELS[shape]}</span>
        <span className="text-white/40">·</span>
        <span>{LENGTH_LABELS[length]} délka</span>
      </figcaption>
    </figure>
  );
}
