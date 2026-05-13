import { useEffect } from "preact/hooks";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoDismiss?: number;
  /** Se true, renderiza posicionado fixed no canto superior direito */
  fixed?: boolean;
}

const CONFIG: Record<
  AlertType,
  { bg: string; border: string; text: string; icon: string }
> = {
  success: {
    bg: "rgba(16,185,129,0.14)",
    border: "rgba(16,185,129,0.3)",
    text: "#34D399",
    icon: "✅",
  },
  error: {
    bg: "rgba(239,68,68,0.14)",
    border: "rgba(239,68,68,0.3)",
    text: "#F87171",
    icon: "⚠️",
  },
  warning: {
    bg: "rgba(245,158,11,0.14)",
    border: "rgba(245,158,11,0.3)",
    text: "#FCD34D",
    icon: "⚠️",
  },
  info: {
    bg: "rgba(59,130,246,0.14)",
    border: "rgba(59,130,246,0.3)",
    text: "#60A5FA",
    icon: "ℹ️",
  },
};

export function Alert({
  type,
  message,
  onClose,
  autoDismiss,
  fixed,
}: AlertProps) {
  const c = CONFIG[type];

  useEffect(() => {
    if (autoDismiss && onClose) {
      const timer = setTimeout(onClose, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, onClose]);

  const baseStyle: Record<string, string | number> = {
    padding: "0.9rem 1rem",
    borderRadius: 16,
    background: c.bg,
    border: `1px solid ${c.border}`,
    color: c.text,
    fontWeight: 800,
    fontSize: "0.85rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
  };

  if (fixed) {
    Object.assign(baseStyle, {
      position: "fixed",
      top: 20,
      right: 20,
      zIndex: 2000,
      maxWidth: 400,
      boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
    });
  } else {
    baseStyle.marginBottom = "1rem";
  }

  return (
    <div style={baseStyle}>
      <span>
        {c.icon} {message}
      </span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: c.text,
            fontSize: "1rem",
            lineHeight: 1,
            padding: "0 0.2rem",
            flexShrink: 0,
          }}
          aria-label="Fechar"
        >
          ✕
        </button>
      )}
    </div>
  );
}
