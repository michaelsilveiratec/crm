import { ComponentChildren } from "preact";

export type PageBadgeColor =
  | "purple"
  | "green"
  | "blue"
  | "red"
  | "amber"
  | "yellow"
  | "orange";

interface PageBadgeProps {
  color?: PageBadgeColor;
  children: ComponentChildren;
}

const COLORS: Record<
  PageBadgeColor,
  { bg: string; border: string; text: string }
> = {
  purple: {
    bg: "rgba(124,58,237,0.14)",
    border: "rgba(124,58,237,0.35)",
    text: "#C4B5FD",
  },
  green: {
    bg: "rgba(16,185,129,0.14)",
    border: "rgba(16,185,129,0.35)",
    text: "#34D399",
  },
  blue: {
    bg: "rgba(37,99,235,0.14)",
    border: "rgba(37,99,235,0.35)",
    text: "#93C5FD",
  },
  red: {
    bg: "rgba(239,68,68,0.14)",
    border: "rgba(239,68,68,0.35)",
    text: "#FCA5A5",
  },
  amber: {
    bg: "rgba(245,158,11,0.14)",
    border: "rgba(245,158,11,0.35)",
    text: "#FCD34D",
  },
  // 'yellow' é alias de 'amber'
  yellow: {
    bg: "rgba(245,158,11,0.14)",
    border: "rgba(245,158,11,0.35)",
    text: "#FCD34D",
  },
  orange: {
    bg: "rgba(249,115,22,0.14)",
    border: "rgba(249,115,22,0.35)",
    text: "#FDB97D",
  },
};

export function PageBadge({ color = "purple", children }: PageBadgeProps) {
  const c = COLORS[color];

  return (
    <span
      style={{
        display: "inline-flex",
        padding: "0.35rem 0.75rem",
        borderRadius: 999,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: "0.75rem",
        fontWeight: 800,
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </span>
  );
}
