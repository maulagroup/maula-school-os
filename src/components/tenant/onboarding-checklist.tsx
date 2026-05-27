import Card from '@/components/ui/card';
import SectionHeader from '@/components/ui/section-header';

export interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  href: string;
}

export interface OnboardingChecklistProps {
  steps: OnboardingStep[];
}

export default function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <SectionHeader title="Checklist Onboarding" />
        <span className="text-sm font-medium text-secondary-600">
          {completedSteps}/{totalSteps}
        </span>
      </div>

      <div className="w-full bg-secondary-200 rounded-full h-2 mb-6">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <a
            key={step.id}
            href={step.href}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              step.completed ? 'bg-success-50' : 'bg-secondary-50 hover:bg-secondary-100'
            }`}
          >
            <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              step.completed ? 'bg-success-500 text-white' : 'bg-secondary-200 text-secondary-500'
            }`}>
              {step.completed ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm font-medium">{steps.indexOf(step) + 1}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`font-medium ${step.completed ? 'text-success-700' : 'text-secondary-900'}`}>
                {step.label}
              </p>
              <p className="text-sm text-secondary-500">{step.description}</p>
            </div>
            {!step.completed && (
              <svg className="w-5 h-5 text-secondary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </a>
        ))}
      </div>
    </Card>
  );
}
