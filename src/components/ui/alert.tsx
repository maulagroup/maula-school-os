export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

export interface AlertProps {
  children: React.ReactNode;
  variant: AlertVariant;
  title?: string;
  className?: string;
}

export default function Alert({ children, variant, title, className = '' }: AlertProps) {
  const variantClasses = {
    success: 'bg-success-50 border-success-200 text-success-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    danger: 'bg-danger-50 border-danger-200 text-danger-800',
    info: 'bg-info-50 border-info-200 text-info-800',
  };

  return (
    <div className={`rounded-lg border p-4 ${variantClasses[variant]} ${className}`}>
      {title && <h4 className="font-semibold mb-1">{title}</h4>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
