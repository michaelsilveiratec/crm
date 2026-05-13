interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.5rem 1rem",
        gap: "0.75rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", lineHeight: 1 }}>{icon}</div>
      <strong style={{ color: "var(--text-main)", fontSize: "1rem" }}>
        {title}
      </strong>
      {description && (
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            maxWidth: 340,
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn-primary"
          onClick={onAction}
          style={{ marginTop: "0.5rem" }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
