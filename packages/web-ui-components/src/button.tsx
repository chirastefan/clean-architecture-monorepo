import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type SharedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'light' | 'danger';
  fullWidth?: boolean;
};

export function SharedButton({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  style,
  ...props
}: SharedButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.9rem',
    borderRadius: '12px',
    padding: '0.75rem 1.25rem',
    border: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.6 : 1,
    transition: 'all 0.15s ease',
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#ea580c',
      color: '#ffffff',
    },
    light: {
      backgroundColor: '#f1f5f9',
      color: '#0f172a',
      border: '1px solid #e2e8f0',
    },
    danger: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fecaca',
    },
  };

  return (
    <button
      className={`shared-btn ${className}`}
      style={{ ...baseStyles, ...variantStyles[variant] }}
      {...props}
    >
      {children}
    </button>
  );
}
