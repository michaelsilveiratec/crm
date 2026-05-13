interface AvatarProps {
  name: string;
  photo?: string;
  size?: number;
  /** Sobrescreve o gradiente diretamente (ex: 'linear-gradient(135deg,#7C3AED,#2563EB)') */
  gradient?: string;
  /** API legada: usa gradiente diferente para visitantes */
  isVisitor?: boolean;
}

export function Avatar({
  name,
  photo,
  size = 46,
  gradient,
  isVisitor,
}: AvatarProps) {
  const initials = (name || "PS")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const resolvedGradient =
    gradient ??
    (isVisitor
      ? "linear-gradient(135deg,#F59E0B,#8B5CF6)"
      : "linear-gradient(135deg,#10B981,#2563EB)");

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: resolvedGradient,
        border: "3px solid rgba(255,255,255,0.12)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 900,
        fontSize: size >= 80 ? "1.3rem" : size >= 60 ? "0.95rem" : "0.78rem",
        overflow: "hidden",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt={`Foto de ${name || "pessoa"}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initials
      )}
    </div>
  );
}
