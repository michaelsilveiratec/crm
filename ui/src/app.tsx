import { useState, useEffect, useCallback } from "preact/hooks";
import type { VNode } from "preact";
import { PastoralMessages } from "./components/PastoralMessages";
import { Dashboard } from "./components/Dashboard";
import { SuperAdmin } from "./components/SuperAdmin";
import { WhatsAppLogs } from "./components/WhatsAppLogs";
import { Settings } from "./components/Settings";
import { MembersList } from "./components/MembersList";
import { PastoralVisits } from "./components/PastoralVisits";
import { WorkerMessages } from "./components/WorkerMessages";
import { BirthdayAlert } from "./components/BirthdayAlert";
import { UserManagement } from "./components/UserManagement";
import { Alert, ConfirmDialog } from "./components/shared";
import { useNotification } from "./hooks/useNotification";
import { usePhotoUpload } from "./hooks/usePhotoUpload";

// ---------------------------------------------------------------------------
// Ícones SVG inline
// ---------------------------------------------------------------------------
const Icons: Record<string, () => VNode> = {
  Grid: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Users: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  UserCheck: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  Gift: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
  MessageCircle: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 11.5a8.5 8.5 0 1 1-8.5-8.5A8.38 8.38 0 0 1 21 11.5z" />
    </svg>
  ),
  Home: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Cup: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  ),
  Layers: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Shield: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  BarChart: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  LogOut: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Globe: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Mail: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// Temas disponíveis — array mapeado
// ---------------------------------------------------------------------------
const THEMES = [
  { id: "theme-navy", label: "Azul", icon: "🌊" },
  { id: "theme-dark", label: "Escuro", icon: "🌙" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

// ---------------------------------------------------------------------------
// RemovePhotoButton — helper reutilizável
// ---------------------------------------------------------------------------
function RemovePhotoButton({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      onClick={onRemove}
      aria-label={label}
      style={{
        width: "100%",
        padding: "6px 8px",
        fontSize: "0.72rem",
        background: "rgba(239,68,68,0.12)",
        border: "1px solid rgba(239,68,68,0.35)",
        color: "#F87171",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 700,
        transition: "background 0.15s",
      }}
      onMouseEnter={(e: MouseEvent) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(239,68,68,0.22)";
      }}
      onMouseLeave={(e: MouseEvent) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(239,68,68,0.12)";
      }}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// NavItem — com tooltip nativo e badge de contagem
// ---------------------------------------------------------------------------
function NavItem({
  icon,
  label,
  tab,
  activeTab,
  onClick,
  badge,
}: {
  icon: string;
  label: string;
  tab: string;
  activeTab: string;
  onClick: (t: string) => void;
  badge?: number;
}) {
  const I = Icons[icon];

  return (
    <button
      className={`sidebar-item ${activeTab === tab ? "active" : ""}`}
      onClick={() => onClick(tab)}
      title={label}
      aria-label={badge ? `${label} — ${badge} hoje` : label}
      aria-current={activeTab === tab ? "page" : undefined}
      style={{ position: "relative" }}
    >
      <I />
      <span>{label}</span>

      {/* Badge de notificação (ex.: aniversariantes de hoje) */}
      {badge != null && badge > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 6,
            right: 8,
            minWidth: 18,
            height: 18,
            borderRadius: 999,
            background: "#F59E0B",
            color: "#000",
            fontSize: "0.62rem",
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            lineHeight: 1,
            boxShadow: "0 2px 6px rgba(245,158,11,0.5)",
          }}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------
function Avatar({
  name,
  role,
  photo_url,
}: {
  name: string;
  role: string;
  photo_url?: string;
}) {
  if (photo_url) {
    return (
      <img
        src={photo_url}
        alt={name}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      />
    );
  }

  const initials = (name || "US")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const bg =
    role === "super_admin"
      ? "linear-gradient(135deg,#9333ea,#6D28D9)"
      : role === "pastor"
        ? "linear-gradient(135deg,#7C3AED,#2563EB)"
        : "linear-gradient(135deg,#10B981,#2563EB)";

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "0.9rem",
        color: "#fff",
        flexShrink: 0,
        boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
        border: "2px solid rgba(255,255,255,0.1)",
      }}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ComingSoon
// ---------------------------------------------------------------------------
function ComingSoon({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: 16,
        color: "var(--text-muted)",
      }}
    >
      <div style={{ fontSize: "3rem" }}>🚧</div>
      <h2 style={{ color: "var(--text-main)", margin: 0 }}>{label}</h2>
      <p style={{ margin: 0, fontSize: "0.875rem" }}>
        Módulo em desenvolvimento — em breve!
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AppSkeleton — shimmer animado para o estado de loading inicial
// ---------------------------------------------------------------------------
function AppSkeleton() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#070B1A" }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0 }
          100% { background-position:  600px 0 }
        }
        .sk-app {
          background: linear-gradient(90deg,#111827 25%,#1F2937 50%,#111827 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 8px;
        }
      `}</style>

      {/* Sidebar skeleton */}
      <div
        style={{
          width: 220,
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div
            className="sk-app"
            style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0 }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div className="sk-app" style={{ height: 12, width: "80%" }} />
            <div className="sk-app" style={{ height: 10, width: "60%" }} />
          </div>
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="sk-app"
            style={{ height: 36, borderRadius: 10, opacity: 1 - i * 0.06 }}
          />
        ))}
      </div>

      {/* Conteúdo principal skeleton */}
      <div
        style={{
          flex: 1,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="sk-app" style={{ height: 18, width: 140 }} />
          <div className="sk-app" style={{ height: 32, width: 360 }} />
          <div className="sk-app" style={{ height: 14, width: 280 }} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6,1fr)",
            gap: 12,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="sk-app"
              style={{ height: 88, borderRadius: 16 }}
            />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 12,
          }}
        >
          <div className="sk-app" style={{ height: 220, borderRadius: 20 }} />
          <div className="sk-app" style={{ height: 220, borderRadius: 20 }} />
          <div className="sk-app" style={{ height: 220, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App principal
// ---------------------------------------------------------------------------
export function App({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<{
    user_id?: number;
    role: string;
    user_name?: string;
    church_name?: string;
    provisional_access?: boolean;
    photo_url?: string;
  } | null>(null);

  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem("crm_theme");
    // Migra tema-light (removido) para navy
    return saved === "theme-navy" || saved === "theme-dark"
      ? (saved as ThemeId)
      : "theme-navy";
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Badge de aniversariantes de hoje
  const [birthdaysToday, setBirthdaysToday] = useState(0);

  // ConfirmDialog de logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Notificações via hook compartilhado
  const {
    notification,
    showSuccess,
    showError,
    showInfo,
    clear: clearNotification,
  } = useNotification();

  // ── Foto do perfil — chave POR USUÁRIO para não vazar entre contas ──────────
  // A chave usa o user_id para que admin e obreiros tenham fotos independentes.
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
  const { handlePhotoChange: _handleProfilePhoto } = usePhotoUpload();

  // Carrega a foto DEPOIS de saber quem é o usuário logado
  useEffect(() => {
    if (!user?.user_id) return;
    const stored =
      localStorage.getItem(`crm_profile_photo_${user.user_id}`) || "";
    setProfilePhotoUrl(stored);
  }, [user?.user_id]);

  const handleProfilePhotoChange = useCallback(
    (e: Event) => {
      _handleProfilePhoto(
        e,
        (b64) => {
          setProfilePhotoUrl(b64);
          // Salva com chave específica do usuário
          if (user?.user_id) {
            localStorage.setItem(`crm_profile_photo_${user.user_id}`, b64);
          }
          showSuccess("Foto do perfil atualizada!");
        },
        showError,
      );
    },
    [_handleProfilePhoto, showSuccess, showError, user?.user_id],
  );

  const removeProfilePhoto = useCallback(() => {
    setProfilePhotoUrl("");
    if (user?.user_id) {
      localStorage.removeItem(`crm_profile_photo_${user.user_id}`);
    }
  }, [user?.user_id]);

  // ── Logo da igreja ─────────────────────────────────────────────────────────
  const [churchLogoUrl, setChurchLogoUrl] = useState<string>(
    () => localStorage.getItem("crm_church_logo") || "",
  );
  const { handlePhotoChange: _handleChurchLogo } = usePhotoUpload();

  const handleChurchLogoChange = useCallback(
    (e: Event) => {
      _handleChurchLogo(
        e,
        (b64) => {
          setChurchLogoUrl(b64);
          localStorage.setItem("crm_church_logo", b64);
          showSuccess("Logo da igreja atualizado!");
        },
        showError,
      );
    },
    [_handleChurchLogo, showSuccess, showError],
  );

  const removeChurchLogo = useCallback(() => {
    setChurchLogoUrl("");
    localStorage.removeItem("crm_church_logo");
  }, []);

  // ── Tema ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.classList.remove("theme-navy", "theme-dark", "theme-light");
    document.body.classList.add(theme);
    localStorage.setItem("crm_theme", theme);
  }, [theme]);

  const handleThemeChange = useCallback(
    (id: ThemeId) => {
      setTheme(id);
      showInfo(
        `Tema ${THEMES.find((t) => t.id === id)?.label ?? id} aplicado.`,
      );
    },
    [showInfo],
  );

  // ── Carrega usuário ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setUser(data);
          setActiveTab(
            data.role === "super_admin" ? "superadmin" : "dashboard",
          );
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // ── Badge de aniversariantes de hoje ──────────────────────────────────────
  useEffect(() => {
    if (!user || user.role === "super_admin") return;
    fetch("/api/pastor/dashboard-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: any) => {
        if (data?.birthdays_today) {
          setBirthdaysToday(
            Array.isArray(data.birthdays_today)
              ? data.birthdays_today.length
              : Number(data.birthdays_today) || 0,
          );
        }
      })
      .catch(() => {
        /* silencia — não crítico */
      });
  }, [user]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    setShowLogoutConfirm(false);
    await fetch("/api/logout", { method: "POST" });
    onLogout();
    window.location.href = "/login";
  }, [onLogout]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) return <AppSkeleton />;
  if (!user) return null;

  const isSuperAdmin = user.role === "super_admin";
  const isPastor = user.role === "pastor";

  return (
    <div className="app-layout">
      {/* Notificação flutuante (fixed) */}
      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          fixed
          onClose={clearNotification}
          autoDismiss={3500}
        />
      )}

      {/* ConfirmDialog de logout */}
      {showLogoutConfirm && (
        <ConfirmDialog
          title="Sair do sistema"
          message="Tem certeza que deseja encerrar sua sessão? Você precisará fazer login novamente."
          confirmLabel="Sair"
          cancelLabel="Cancelar"
          danger
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Logo da igreja */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {churchLogoUrl ? (
              <img
                src={churchLogoUrl}
                alt="Logo da igreja"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  objectFit: "cover",
                  boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                }}
              />
            ) : (
              <div
                style={{
                  width: 42,
                  height: 42,
                  background: "linear-gradient(135deg,#7C3AED,#2563EB)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
            )}

            <label
              title="Trocar logo da igreja"
              style={{
                position: "absolute",
                right: -6,
                bottom: -6,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "var(--primary)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.68rem",
                cursor: "pointer",
                border: "2px solid var(--sidebar-bg)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                zIndex: 2,
              }}
            >
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleChurchLogoChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div>
            <h2>
              {isSuperAdmin
                ? "Eclesia SaaS"
                : user.church_name || "Igreja Rochdale"}
            </h2>
            <p>{isSuperAdmin ? "Painel Global" : "Sistema Pastoral"}</p>
          </div>
        </div>

        {/* ── Navegação ──────────────────────────────────────────────────── */}
        <nav className="sidebar-nav">
          {isSuperAdmin ? (
            <NavItem
              icon="Globe"
              label="Gestão SaaS"
              tab="superadmin"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          ) : (
            <>
              <span className="section-label">Principal</span>

              <NavItem
                icon="Grid"
                label="Dashboard"
                tab="dashboard"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon="Users"
                label="Membros"
                tab="membros"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon="UserCheck"
                label="Visitantes"
                tab="visitantes"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon="Gift"
                label="Aniversariantes"
                tab="aniversariantes"
                activeTab={activeTab}
                onClick={setActiveTab}
                badge={birthdaysToday}
              />
              <NavItem
                icon="MessageCircle"
                label="Mensagens Pastorais"
                tab="mensagens"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon="Home"
                label="Visitas Pastorais"
                tab="visitas"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon="Cup"
                label="Santa Ceia"
                tab="santa_ceia"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon="Layers"
                label="Grupos"
                tab="grupos"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon="Shield"
                label="Obreiros"
                tab="obreiros"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon="Mail"
                label="Recados da Equipe"
                tab="recados"
                activeTab={activeTab}
                onClick={setActiveTab}
              />

              <span className="section-label" style={{ marginTop: 8 }}>
                Sistema
              </span>

              <NavItem
                icon="BarChart"
                label="Relatórios"
                tab="relatorios"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon="Settings"
                label="Configurações"
                tab="config"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
            </>
          )}

          <div style={{ flex: 1 }} />

          {/* Sair — abre ConfirmDialog */}
          <button
            className="sidebar-item"
            onClick={() => setShowLogoutConfirm(true)}
            title="Sair do sistema"
            style={{ color: "#F87171" }}
          >
            <Icons.LogOut />
            <span>Sair</span>
          </button>
        </nav>

        {/* ── Perfil + Tema ─────────────────────────────────────────────── */}
        <div
          className="sidebar-profile"
          style={{
            margin: "8px 16px 12px",
            padding: "12px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Informações do usuário */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative" }}>
              <Avatar
                name={user.user_name || "US"}
                role={user.role}
                photo_url={profilePhotoUrl || user.photo_url}
              />

              <label
                title="Trocar foto"
                style={{
                  position: "absolute",
                  right: -4,
                  bottom: -4,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  border: "2px solid var(--bg-card)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                }}
              >
                📷
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div>
              <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#F3F4F6" }}>
                {isPastor
                  ? `Pr. ${user.user_name || "Michael Ramos"}`
                  : user.user_name || "Usuário"}
              </h3>

              <p style={{ margin: 0, fontSize: "0.75rem", color: "#9CA3AF" }}>
                {isSuperAdmin
                  ? "Super Admin"
                  : isPastor
                    ? "Pastor Administrador"
                    : "Obreiro · Equipe"}
              </p>

              <p
                style={{
                  margin: "4px 0 0 0",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.75rem",
                  color: "#10B981",
                  fontWeight: 500,
                }}
              >
                <span
                  className="status-online"
                  style={{
                    background: "#10B981",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: 6,
                    boxShadow: "0 0 8px #10B981",
                  }}
                />
                Online
              </p>
            </div>
          </div>

          {/* ── Seletor de tema — único lugar ─────────────────────────── */}
          <div
            style={{
              paddingTop: "10px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "0.68rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Aparência
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              {THEMES.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    title={`Tema ${t.label}`}
                    aria-pressed={active}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      padding: "7px 4px",
                      fontSize: "0.75rem",
                      fontWeight: active ? 800 : 500,
                      borderRadius: "10px",
                      border: active
                        ? "1.5px solid var(--primary)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: active
                        ? "linear-gradient(135deg, var(--primary), var(--primary-hover))"
                        : "rgba(255,255,255,0.05)",
                      color: active ? "#fff" : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      boxShadow: active
                        ? "0 4px 12px rgba(0,0,0,0.25)"
                        : "none",
                    }}
                  >
                    <span style={{ fontSize: "0.9rem" }}>{t.icon}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remover foto de perfil */}
          {profilePhotoUrl && (
            <RemovePhotoButton
              label="Remover foto"
              onRemove={removeProfilePhoto}
            />
          )}

          {/* Remover logo da igreja */}
          {churchLogoUrl && (
            <RemovePhotoButton
              label="Remover logo"
              onRemove={removeChurchLogo}
            />
          )}
        </div>
      </aside>

      {/* ── Conteúdo principal (roteamento por tab) ──────────────────────── */}

      {activeTab === "superadmin" && isSuperAdmin && <SuperAdmin />}

      {activeTab === "dashboard" && !isSuperAdmin && (
        <Dashboard
          onNavigate={setActiveTab}
          userName={user.user_name || ""}
          userRole={user.role}
        />
      )}

      {activeTab === "membros" && !isSuperAdmin && (
        <MembersList role={user.role} />
      )}

      {activeTab === "visitantes" && !isSuperAdmin && (
        <MembersList role={user.role} />
      )}

      {activeTab === "aniversariantes" && !isSuperAdmin && <BirthdayAlert />}

      {activeTab === "mensagens" && !isSuperAdmin && <PastoralMessages />}

      {activeTab === "visitas" && !isSuperAdmin && (
        <PastoralVisits role={user.role} />
      )}

      {activeTab === "santa_ceia" && !isSuperAdmin && (
        <ComingSoon label="Santa Ceia" />
      )}

      {activeTab === "grupos" && !isSuperAdmin && <ComingSoon label="Grupos" />}

      {activeTab === "obreiros" && !isSuperAdmin && isPastor && (
        <UserManagement />
      )}

      {activeTab === "obreiros" && !isSuperAdmin && !isPastor && (
        <ComingSoon label="Acesso restrito ao Pastor Administrador" />
      )}

      {activeTab === "recados" && !isSuperAdmin && <WorkerMessages />}

      {activeTab === "relatorios" && !isSuperAdmin && <WhatsAppLogs />}

      {activeTab === "config" && !isSuperAdmin && <Settings />}
    </div>
  );
}
