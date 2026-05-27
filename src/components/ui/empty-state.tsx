export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  cta?: {
    label: string;
    href: string;
  };
  children?: React.ReactNode;
}

export default function EmptyState({ title, description, icon, cta, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-secondary-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      {description && <p className="text-secondary-600 max-w-sm mb-6">{description}</p>}
      {cta && (
        <a
          href={cta.href}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {cta.label}
        </a>
      )}
      {children}
    </div>
  );
}
