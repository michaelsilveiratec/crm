interface LoadingStateProps {
  rows?: number;
  height?: number;
}

export function LoadingState({ rows = 3, height = 56 }: LoadingStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "0.5rem 0",
      }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            borderRadius: 12,
            background: `rgba(255,255,255,${0.05 - i * 0.005})`,
            animation: "pulse 1.6s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
