import { ComponentChildren } from "preact";

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  maxWidth?: number;
  footer?: ComponentChildren;
  children: ComponentChildren;
}

export function Modal({
  title,
  subtitle,
  onClose,
  maxWidth = 540,
  footer,
  children,
}: ModalProps) {
  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.68)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        className="modern-card"
        style={{
          width: maxWidth,
          maxWidth: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          margin: 0,
          boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
        }}
      >
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">{title}</h2>

            {subtitle && (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  marginTop: 4,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <button
            className="btn-icon"
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {children}

        {footer && <div className="form-actions">{footer}</div>}
      </div>
    </div>
  );
}
