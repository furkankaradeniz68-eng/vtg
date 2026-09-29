// Abhaengigkeitsfreies Liniendiagramm fuer den Energiekostenzuschlag: x-Achse
// sind die Monate (Jan-Dez), y-Achse ist fest auf 0-20% skaliert (so
// gewuenscht, unabhaengig vom tatsaechlichen Wertebereich der Daten). Bewusst
// als einfaches SVG gebaut statt einer Chart-Library, da der Rest des
// Projekts UI-Bausteine (z.B. SimpleTable) ebenfalls selbst baut statt
// zusaetzliche Pakete einzubinden.
const MONTH_LABELS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const Y_MAX = 20;
const Y_TICKS = [0, 5, 10, 15, 20];

const WIDTH = 320;
const HEIGHT = 180;
const PADDING_LEFT = 28;
const PADDING_RIGHT = 8;
const PADDING_TOP = 8;
const PADDING_BOTTOM = 20;

function parsePercent(value: string): number | null {
  const num = Number.parseFloat(value.replace(",", ".").replace("%", "").trim());
  return Number.isFinite(num) ? num : null;
}

function xFor(month: number): number {
  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  return PADDING_LEFT + ((month - 1) / 11) * plotWidth;
}

function yFor(percent: number): number {
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const clamped = Math.min(Math.max(percent, 0), Y_MAX);
  return PADDING_TOP + plotHeight - (clamped / Y_MAX) * plotHeight;
}

export default function EnergiekostenChart({ rows }: { rows: { month: number; percent: string }[] }) {
  const points = rows
    .map((r) => ({ month: r.month, value: parsePercent(r.percent) }))
    .filter((p): p is { month: number; value: number } => p.value !== null)
    .sort((a, b) => a.month - b.month);

  if (points.length === 0) return null;

  // Nur benachbarte Monate verbinden, damit Luecken (fehlende Monate) nicht
  // ueberbrueckt werden.
  const segments: { month: number; value: number }[][] = [];
  for (const p of points) {
    const last = segments[segments.length - 1];
    if (last && p.month === last[last.length - 1].month + 1) {
      last.push(p);
    } else {
      segments.push([p]);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      role="img"
      aria-label="Zuschlag in Prozent nach Monat"
    >
      {Y_TICKS.map((tick) => (
        <g key={tick}>
          <line
            x1={PADDING_LEFT}
            x2={WIDTH - PADDING_RIGHT}
            y1={yFor(tick)}
            y2={yFor(tick)}
            stroke="#e5e5e5"
            strokeWidth={1}
          />
          <text x={PADDING_LEFT - 4} y={yFor(tick) + 3} textAnchor="end" fontSize={9} fill="#737373">
            {tick}%
          </text>
        </g>
      ))}

      {MONTH_LABELS.map((label, i) => (
        <text
          key={label}
          x={xFor(i + 1)}
          y={HEIGHT - 4}
          textAnchor="middle"
          fontSize={8}
          fill="#737373"
        >
          {label}
        </text>
      ))}

      {segments.map((segment, i) => (
        <polyline
          key={i}
          points={segment.map((p) => `${xFor(p.month)},${yFor(p.value)}`).join(" ")}
          fill="none"
          stroke="#f5a623"
          strokeWidth={2}
        />
      ))}

      {points.map((p) => (
        <circle key={p.month} cx={xFor(p.month)} cy={yFor(p.value)} r={2.5} fill="#f5a623" />
      ))}
    </svg>
  );
}
