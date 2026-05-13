// Mapa para compatibilidade com a API legada (status de membro espiritual)
const SPIRITUAL_STATUS: Record<string, { label: string; color: string }> = {
  CONVERTIDO: { label: "Convertido", color: "#3B82F6" },
  BATIZADO: { label: "Batizado", color: "#10B981" },
  MEMBRO_ATIVO: { label: "Membro Ativo", color: "#10B981" },
  DISCIPULADO: { label: "Em Discipulado", color: "#F59E0B" },
};

interface StatusBadgeProps {
  /** API nova: texto do badge */
  label?: string;
  /** API nova: cor hex do badge */
  color?: string;
  /** API nova: emoji/ícone */
  icon?: string;
  /** API legada: status espiritual do membro */
  status?: string;
}

export function StatusBadge({ label, color, icon, status }: StatusBadgeProps) {
  // Resolve props da API legada
  let resolvedLabel = label;
  let resolvedColor = color;

  if (status && !label) {
    const mapped = SPIRITUAL_STATUS[status];
    resolvedLabel = mapped?.label ?? status;
    resolvedColor = resolvedColor ?? mapped?.color ?? "#6B7280";
  }

  resolvedLabel = resolvedLabel ?? "";
  resolvedColor = resolvedColor ?? "#6B7280";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "0.25rem 0.65rem",
        borderRadius: 999,
        background: `${resolvedColor}20`,
        border: `1px solid ${resolvedColor}55`,
        color: resolvedColor,
        fontSize: "0.72rem",
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {icon && <span>{icon}</span>}
      {resolvedLabel}
    </span>
  );
}
