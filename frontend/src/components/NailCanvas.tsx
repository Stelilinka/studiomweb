// NailCanvas — stylizovaná SVG ruka s nastavitelným tvarem, délkou a finišem nehtů.
// Čistě vektorová grafika — žádné fotobanky, vše generované CSS/SVG.

export type NailShape = "mandle" | "oval" | "stiletto" | "square";
export type NailFinish = "glazed" | "matte" | "chrome" | "french";

export const SHAPE_LABELS: Record<NailShape, string> = {
  mandle: "Mandle",
  oval: "Oval",
  stiletto: "Stiletto",
  square: "Square",
};

export const FINISH_LABELS: Record<NailFinish, string> = {
  glazed: "Glazed donut",
  matte: "Velvet mat",
  chrome: "Rose gold chrom",
  french: "Francouzská ombré",
};

interface NailCanvasProps {
  shape?: NailShape;
  finish?: NailFinish;
  length?: 1 | 2 | 3;
  className?: string;
}

// Vrátí path nehtu v lokálních souřadnicích (0,0 = levý horní roh lůžka).
function nailPath(shape: NailShape, w: number, len: number): string {
  const hw = w / 2;
  if (shape === "square") {
    const r = w * 0.26;
    return `M0 ${r} Q0 0 ${r} 0 L${w - r} 0 Q${w} 0 ${w} ${r} L${w} ${len * 0.86} Q${w} ${len} ${w - r} ${len} L${r} ${len} Q0 ${len} 0 ${len * 0.86} Z`;
  }
  if (shape === "oval") {
    return `M0 ${len * 0.3} Q0 0 ${hw} 0 Q${w} 0 ${w} ${len * 0.3} L${w} ${len * 0.68} Q${w} ${len} ${hw} ${len} Q0 ${len} 0 ${len * 0.68} Z`;
  }
  if (shape === "mandle") {
    return `M0 ${len * 0.22} Q0 0 ${hw} 0 Q${w} 0 ${w} ${len * 0.22} L${w} ${len * 0.62} Q${w} ${len} ${hw} ${len} Q${w * 0.2} ${len * 0.96} 0 ${len * 0.7} Z`;
  }
  // stiletto
  return `M${w * 0.14} 0 L${w * 0.86} 0 Q${w * 0.98} ${len * 0.38} ${hw} ${len} Q${w * 0.02} ${len * 0.38} ${w * 0.14} 0 Z`;
}

const FINGERS = [
  { x: 96, tip: 84, w: 38, h: 180, rot: -3 },
  { x: 142, tip: 62, w: 40, h: 208, rot: 0 },
  { x: 190, tip: 74, w: 38, h: 196, rot: 3 },
  { x: 234, tip: 106, w: 32, h: 158, rot: 6 },
];

export default function NailCanvas({
  shape = "mandle",
  finish = "glazed",
  length = 2,
  className,
}: NailCanvasProps) {
  const nailLen = 18 + length * 9;

  const fingerFill = "url(#nc-skin)";
  const fingerStroke = "#3F3730";

  return (
    <svg
      viewBox="0 0 340 400"
      className={className}
      role="img"
      aria-label={`Ukázka nehtů — tvar ${SHAPE_LABELS[shape]}, finiš ${FINISH_LABELS[finish]}`}
      data-testid="nail-design-canvas"
    >
      <defs>
        <radialGradient id="nc-glow" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F5DED6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nc-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBF1EA" />
          <stop offset="100%" stopColor="#F1DFD2" />
        </linearGradient>
        <linearGradient id="nc-glazed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAEBE4" />
          <stop offset="55%" stopColor="#F0CDC3" />
          <stop offset="100%" stopColor="#F9E8E0" />
        </linearGradient>
        <linearGradient id="nc-chrome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E4C8" />
          <stop offset="45%" stopColor="#D9A96F" />
          <stop offset="70%" stopColor="#F5E7D3" />
          <stop offset="100%" stopColor="#C98A5B" />
        </linearGradient>
        <clipPath id="nc-french-clip">
          <rect x="0" y="0" width="60" height="60" />
        </clipPath>
      </defs>

      <circle cx="170" cy="180" r="165" fill="url(#nc-glow)" />

      {/* dekorativní jiskřičky */}
      {[
        { x: 58, y: 60, s: 1, d: "0s" },
        { x: 288, y: 120, s: 0.7, d: "1.2s" },
        { x: 268, y: 300, s: 0.9, d: "2.1s" },
        { x: 46, y: 250, s: 0.6, d: "0.6s" },
      ].map((sp, i) => (
        <path
          key={i}
          d={`M0 -9 Q1.6 -1.6 9 0 Q1.6 1.6 0 9 Q-1.6 1.6 -9 0 Q-1.6 -1.6 0 -9 Z`}
          transform={`translate(${sp.x} ${sp.y}) scale(${sp.s})`}
          fill="#C49A6C"
          className="animate-float"
          style={{ animationDelay: sp.d }}
        />
      ))}

      {/* dlaň */}
      <path
        d="M118 240 Q170 224 222 240 Q262 254 258 300 Q252 352 170 356 Q88 352 82 300 Q78 254 118 240 Z"
        fill={fingerFill}
        stroke={fingerStroke}
        strokeWidth="1.4"
      />

      {/* prsty */}
      {FINGERS.map((f, i) => {
        const cx = f.x + f.w / 2;
        const w = f.w * 0.62;
        return (
          <g key={i} transform={`rotate(${f.rot} ${cx} ${f.tip + f.h / 2})`}>
            <rect
              x={f.x}
              y={f.tip + nailLen * 0.55}
              width={f.w}
              height={f.h}
              rx={f.w / 2}
              fill={fingerFill}
              stroke={fingerStroke}
              strokeWidth="1.4"
            />
            <g transform={`translate(${cx - w / 2} ${f.tip})`}>
              {shape === "oval" ? (
                <ellipse
                  cx={w / 2}
                  cy={nailLen / 2}
                  rx={w / 2}
                  ry={nailLen / 2}
                  fill={finish === "chrome" ? "url(#nc-chrome)" : finish === "glazed" ? "url(#nc-glazed)" : finish === "matte" ? "#E5B3A5" : "#F7EDE7"}
                  stroke={fingerStroke}
                  strokeWidth="1.1"
                />
              ) : (
                <path
                  d={nailPath(shape, w, nailLen)}
                  fill={finish === "chrome" ? "url(#nc-chrome)" : finish === "glazed" ? "url(#nc-glazed)" : finish === "matte" ? "#E5B3A5" : "#F7EDE7"}
                  stroke={fingerStroke}
                  strokeWidth="1.1"
                />
              )}
              {finish === "french" && (
                <path
                  d={`M-1 ${nailLen * 0.52} Q${w / 2} ${nailLen * 0.3} ${w + 1} ${nailLen * 0.52} L${w + 1} -1 L-1 -1 Z`}
                  fill="#FFFDFB"
                  stroke={fingerStroke}
                  strokeWidth="0.8"
                />
              )}
              {finish === "glazed" && (
                <ellipse
                  cx={w / 2}
                  cy={nailLen * 0.38}
                  rx={w * 0.24}
                  ry={nailLen * 0.2}
                  fill="#FFFFFF"
                  opacity="0.55"
                />
              )}
            </g>
          </g>
        );
      })}

      {/* palec */}
      <g transform="rotate(40 76 268)">
        <rect x="56" y="268" width="40" height="118" rx="20" fill={fingerFill} stroke={fingerStroke} strokeWidth="1.4" />
        <g transform="translate(61 246)">
          {shape === "oval" ? (
            <ellipse cx={15} cy={nailLen / 2} rx={15} ry={nailLen / 2} fill={finish === "chrome" ? "url(#nc-chrome)" : finish === "glazed" ? "url(#nc-glazed)" : finish === "matte" ? "#E5B3A5" : "#F7EDE7"} stroke={fingerStroke} strokeWidth="1.1" />
          ) : (
            <path d={nailPath(shape, 30, nailLen)} fill={finish === "chrome" ? "url(#nc-chrome)" : finish === "glazed" ? "url(#nc-glazed)" : finish === "matte" ? "#E5B3A5" : "#F7EDE7"} stroke={fingerStroke} strokeWidth="1.1" />
          )}
          {finish === "french" && (
            <path d={`M-1 ${nailLen * 0.52} Q15 ${nailLen * 0.3} 31 ${nailLen * 0.52} L31 -1 L-1 -1 Z`} fill="#FFFDFB" stroke={fingerStroke} strokeWidth="0.8" />
          )}
          {finish === "glazed" && (
            <ellipse cx={15} cy={nailLen * 0.38} rx={7} ry={nailLen * 0.2} fill="#FFFFFF" opacity="0.55" />
          )}
        </g>
      </g>
    </svg>
  );
}
