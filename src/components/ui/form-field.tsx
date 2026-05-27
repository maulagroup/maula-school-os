export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export default function FormField({ label, error, helperText, children, required, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-2 text-sm text-danger-600">{error}</p>}
      {helperText && !error && <p className="mt-2 text-sm text-secondary-500">{helperText}</p>}
    </div>
  );
}
