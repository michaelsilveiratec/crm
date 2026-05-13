interface SummaryCardProps {
  title: string;
  value: number | string;
  icon?: string;
  /** Cor principal do card — controla o glow, ícone e destaque */
  color?: string;
  /** Alias legado para color */
  accentColor?: string;
}

export function SummaryCard({
  title,
  value,
  icon,
  color,
  accentColor,
}: SummaryCardProps) {
  const mainColor = color || accentColor;

  return (
    <div
      className="stat-card"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Glow decorativo */}
      {mainColor && (
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: mainColor,
            opacity: 0.12,
            filter: "blur(22px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Ícone */}
      {icon && (
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 16,
            background: mainColor ? `${mainColor}20` : "rgba(255,255,255,0.08)",
            border: `1px solid ${mainColor ? `${mainColor}55` : "rgba(255,255,255,0.12)"}`,
            color: mainColor || "var(--text-main)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}

      <div>
        <h3
          style={{
            margin: 0,
            fontSize: "1.65rem",
            fontWeight: 900,
            color: mainColor || "var(--text-main)",
          }}
        >
          {value}
        </h3>
        <p
          style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.78rem" }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
