import type { HTMLAttributes, ReactNode } from 'react';

export type SharedBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  color?: string;
};

export function SharedBadge({ children, color = '#ea580c', style, ...props }: SharedBadgeProps) {
  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '0.25rem 0.65rem',
    borderRadius: '999px',
    backgroundColor: `${color}15`,
    color: color,
    border: `1px solid ${color}30`,
    ...style,
  };

  return (
    <span style={badgeStyle} {...props}>
      {children}
    </span>
  );
}
