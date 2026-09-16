// Sparkles — vrstva jemně se třpytících hvězdiček (čisté SVG + CSS).
// Nezachytává kliknutí, jen dělá atmosféru „lesklých nehtů“.

interface SparklesProps {
  count?: number;
  className?: string;
  color?: string;
  seed?: number;
}

function pseudoRandom(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function Sparkles({
  count = 14,
  className,
  color = "#C79A7B",
  seed = 1,
}: SparklesProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden
      data-testid="sparkles-layer"
    >
      {Array.from({ length: count }).map((_, i) => {
        const r1 = pseudoRandom(i + seed * 7.13);
        const r2 = pseudoRandom(i * 3.77 + seed * 2.31);
        const r3 = pseudoRandom(i * 5.19 + seed * 4.87);
        const size = 6 + r3 * 12;
        return (
          <svg
            key={`sparkle-${seed}-${i}`}
            viewBox="0 0 24 24"
            className="animate-twinkle absolute"
            style={{
              left: `${r1 * 96}%`,
              top: `${r2 * 94}%`,
              width: size,
              height: size,
              animationDelay: `${r3 * 4.2}s`,
              animationDuration: `${2.8 + r1 * 2.4}s`,
              color,
            }}
          >
            <path
              d="M12 1.6 Q13.4 9.2 22.4 12 Q13.4 14.8 12 22.4 Q10.6 14.8 1.6 12 Q10.6 9.2 12 1.6 Z"
              fill="currentColor"
              opacity="0.85"
            />
          </svg>
        );
      })}
    </div>
  );
}
