export interface LoadingStateProps {
  text?: string;
  className?: string;
}

export default function LoadingState({ text = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="w-8 h-8 border-4 border-secondary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
      <p className="text-secondary-600">{text}</p>
    </div>
  );
}
