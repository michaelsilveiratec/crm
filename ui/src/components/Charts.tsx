import type { VNode } from 'preact'

function chartId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

/* ── Line Chart Premium ─────────────────────────────────── */
export function LineChart({ data }: { data: { month: string; count: number }[] }): VNode {
  const lineGradientId = chartId('lineGradient')
  const areaGradientId = chartId('areaGradient')
  const glowId = chartId('glowLine')

  if (!data?.length) {
    return (
      <div
        className="skeleton"
        style={{
          height: 190,
          borderRadius: 18,
          background: 'rgba(255,255,255,0.03)',
        }}
      />
    )
  }

  const W = 560
  const H = 180
  const PX = 38
  const PY = 26

  const vals = data.map(d => d.count)
  const max = Math.max(...vals, 1)
  const min = Math.min(...vals, 0)
  const rng = max - min || 1

  const px = (i: number) => {
    if (data.length === 1) return W / 2
    return PX + (i / (data.length - 1)) * (W - PX * 2)
  }

  const py = (v: number) => H - PY - ((v - min) / rng) * (H - PY * 2)

  const pts = data.map((d, i) => ({
    x: px(i),
    y: py(d.count),
    ...d,
  }))

  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')

  const area =
    pts.length > 1
      ? `${line} L${pts[pts.length - 1].x},${H - PY} L${pts[0].x},${H - PY} Z`
      : ''

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{
        width: '100%',
        height: 190,
        display: 'block',
      }}
      role="img"
      aria-label="Gráfico de crescimento"
    >
      <defs>
        <linearGradient id={lineGradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>

        <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#7C3AED" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>

        <filter id={glowId}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0, 1, 2, 3].map(i => {
        const y = PY + (i * (H - PY * 2)) / 3

        return (
          <line
            key={i}
            x1={PX}
            x2={W - PX}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        )
      })}

      {area && <path d={area} fill={`url(#${areaGradientId})`} />}

      {pts.length > 1 && (
        <path
          d={line}
          fill="none"
          stroke={`url(#${lineGradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
        />
      )}

      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="9" fill="#8B5CF6" opacity="0.16" />
          <circle
            cx={p.x}
            cy={p.y}
            r="5"
            fill="#8B5CF6"
            stroke="#070B1A"
            strokeWidth="2"
          />
        </g>
      ))}

      {pts.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y - 14}
          textAnchor="middle"
          fill="#CBD5E1"
          fontSize="10"
          fontWeight="700"
          fontFamily="Inter"
        >
          {p.count}
        </text>
      ))}

      {pts.map((p, i) => (
        <text
          key={`month-${i}`}
          x={p.x}
          y={H - 4}
          textAnchor="middle"
          fill="#64748B"
          fontSize="10"
          fontWeight="600"
          fontFamily="Inter"
        >
          {p.month}
        </text>
      ))}
    </svg>
  )
}

/* ── Donut Chart Premium ────────────────────────────────── */
export function DonutChart({
  segments,
  total,
  label,
}: {
  segments: { label: string; value: number; color: string }[]
  total: number
  label: string
}): VNode {
  const donutGlowId = chartId('donutGlow')

  const r = 54
  const cx = 72
  const cy = 72
  const circ = 2 * Math.PI * r

  const safeTotal = Math.max(total, 1)

  let offset = 0

  const arcs = segments.map(segment => {
    const dash = Math.max(0, (segment.value / safeTotal) * circ)
    const arc = { ...segment, dash, offset }
    offset += dash
    return arc
  })

  return (
    <svg
      viewBox="0 0 144 144"
      width="144"
      height="144"
      role="img"
      aria-label={`Gráfico de ${label}`}
    >
      <defs>
        <filter id={donutGlowId}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="17"
      />

      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth="17"
          strokeLinecap="round"
          strokeDasharray={`${arc.dash} ${circ - arc.dash}`}
          strokeDashoffset={-arc.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter={`url(#${donutGlowId})`}
          style={{ transition: 'all 0.8s ease' }}
        />
      ))}

      <circle cx={cx} cy={cy} r="39" fill="rgba(7,11,26,0.88)" />

      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="20"
        fontWeight="900"
        fontFamily="Inter"
      >
        {total.toLocaleString('pt-BR')}
      </text>

      <text
        x={cx}
        y={cy + 13}
        textAnchor="middle"
        fill="#9CA3AF"
        fontSize="10"
        fontWeight="600"
        fontFamily="Inter"
      >
        {label}
      </text>
    </svg>
  )
}

/* ── Mini Bar Premium ───────────────────────────────────── */
export function MiniBar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}): VNode {
  const pct = Math.min(100, Math.max(0, Math.round((value / Math.max(max, 1)) * 100)))

  return (
    <div style={{ marginBottom: 13 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          {label}
        </span>

        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--text-main)',
          }}
        >
          {value}
        </span>
      </div>

      <div
        style={{
          height: 8,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 999,
          overflow: 'hidden',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.35)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            borderRadius: 999,
            transition: 'width 1s ease',
            boxShadow: `0 0 14px ${color}80`,
          }}
        />
      </div>
    </div>
  )
}

/* ── Skeleton ───────────────────────────────────────────── */
export function Sk({
  w = '100%',
  h = '1rem',
  r = '8px',
}: {
  w?: string
  h?: string
  r?: string
}): VNode {
  return (
    <div
      className="skeleton"
      style={{
        width: w,
        height: h,
        borderRadius: r,
      }}
    />
  )
}