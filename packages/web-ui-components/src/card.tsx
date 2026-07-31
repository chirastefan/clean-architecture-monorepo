import type { HTMLAttributes, ReactNode } from 'react';

export type SharedCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  dark?: boolean;
};

export function SharedCard({
  children,
  dark = false,
  className = '',
  style,
  ...props
}: SharedCardProps) {
  const cardStyle: React.CSSProperties = {
    borderRadius: '20px',
    padding: '1.75rem',
    backgroundColor: dark ? '#172033' : '#ffffff',
    color: dark ? '#ffffff' : '#0f172a',
    border: dark ? '1px solid #1f293d' : '1px solid #e2ded5',
    boxShadow: dark ? '0 12px 30px rgba(0, 0, 0, 0.25)' : '0 10px 25px -5px rgba(0, 0, 0, 0.04)',
    ...style,
  };

  return (
    <div className={`shared-card ${className}`} style={cardStyle} {...props}>
      {children}
    </div>
  );
}
