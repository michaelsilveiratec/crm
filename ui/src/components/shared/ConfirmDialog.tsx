interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  danger = false,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}: ConfirmDialogProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "1rem",
      }}
    >
      <div
        className="modern-card"
        style={{
          width: 420,
          maxWidth: "100%",
          margin: 0,
          boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
        }}
      >
        <h2 className="modern-card-title" style={{ marginBottom: "0.75rem" }}>
          {title}
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            margin: "0 0 1.5rem",
          }}
        >
          {message}
        </p>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onConfirm}
            style={
              danger
                ? {
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    boxShadow: "0 10px 24px rgba(239,68,68,0.35)",
                  }
                : undefined
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
