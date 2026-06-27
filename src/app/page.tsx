'use client';

import { useWizardStore } from '@/store/wizard-store';
import ToolSelector from '@/components/ToolSelector';
import PathSelector from '@/components/PathSelector';
import WizardStep from '@/components/WizardStep';
import PromptResult from '@/components/PromptResult';
import ProgressBar from '@/components/ProgressBar';

export default function Home() {
  const { selectedToolId, selectedPathId, currentStep, generatedPrompt } = useWizardStore();

  // Step 0: no tool selected
  if (!selectedToolId) return <ToolSelector />;

  // Step 0 still (path not selected yet)
  if (!selectedPathId) return <PathSelector />;

  // Prompt generated - show result
  if (generatedPrompt && currentStep === 999) return <PromptResult />;

  // Wizard in progress
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <ProgressBar />
      <WizardStep />
    </div>
  );
}
