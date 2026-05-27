export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, children }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-secondary-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-secondary-600">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
