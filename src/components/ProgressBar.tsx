'use client';

import { useWizardStore } from '@/store/wizard-store';

const TOOL_COLORS: Record<string, string> = {
  chatgpt: 'bg-green-500',
  claude: 'bg-orange-500',
  gemini: 'bg-blue-500',
  notebooklm: 'bg-purple-500',
};

export default function ProgressBar() {
  const { currentStep, totalSteps, selectedToolId, startNewProject, resetWizard } = useWizardStore();
  const pct = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
  const barColor = TOOL_COLORS[selectedToolId || ''] || 'bg-gray-500';

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        <button onClick={startNewProject} className="text-gray-500 hover:text-white text-sm shrink-0">
          Start Over
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{pct}% complete</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className={'h-1.5 rounded-full progress-fill ' + barColor}
              style={{ width: pct + '%' }}
            />
          </div>
        </div>
        <button onClick={resetWizard} className="text-gray-500 hover:text-white text-sm shrink-0">
          Reset
        </button>
      </div>
    </div>
  );
}
