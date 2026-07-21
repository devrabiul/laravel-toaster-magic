import type { ReactNode } from "react";

type CalloutKind = "info" | "tip" | "warning" | "danger";

const ICONS: Record<CalloutKind, string> = {
  info: "💡",
  tip: "✨",
  warning: "⚠️",
  danger: "🛑",
};

interface CalloutProps {
  kind?: CalloutKind;
  children: ReactNode;
}

export function Callout({ kind = "info", children }: CalloutProps) {
  return (
    <div className={`callout callout--${kind}`} role="note">
      <span className="callout__icon" aria-hidden="true">
        {ICONS[kind]}
      </span>
      <div className="callout__body">{children}</div>
    </div>
  );
}
