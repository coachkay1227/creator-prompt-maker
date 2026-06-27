'use client';

import { useState } from 'react';
import { useWizardStore } from '@/store/wizard-store';
import { getInstructions } from '@/lib/prompt-assembler';

const TOOL_LINKS: Record<string, { label: string; url: string }> = {
  chatgpt: { label: 'Open ChatGPT Canvas', url: 'https://chatgpt.com' },
  claude: { label: 'Open Claude', url: 'https://claude.ai' },
  gemini: { label: 'Open Gemini', url: 'https://gemini.google.com' },
  notebooklm: { label: 'Open NotebookLM', url: 'https://notebooklm.google.com' },
};

const TOOL_COLORS: Record<string, string> = {
  chatgpt: 'text-green-400 bg-green-600 hover:bg-green-500',
  claude: 'text-orange-400 bg-orange-600 hover:bg-orange-500',
  gemini: 'text-blue-400 bg-blue-600 hover:bg-blue-500',
  notebooklm: 'text-purple-400 bg-purple-600 hover:bg-purple-500',
};

export default function PromptResult() {
  const { generatedPrompt, selectedToolId, answers, startNewProject, resetWizard, promptHistory } = useWizardStore();
  const [copied, setCopied] = useState(false);

  const toolLink = TOOL_LINKS[selectedToolId || ''] || TOOL_LINKS.chatgpt;
  const toolColor = TOOL_COLORS[selectedToolId || ''] || TOOL_COLORS.chatgpt;
  const instructions = getInstructions(selectedToolId || '', answers['output-format'] as string);

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!generatedPrompt) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="w-full bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <button onClick={startNewProject} className="text-gray-500 hover:text-white text-sm">
          Start Over
        </button>
        <span className="text-gray-400 text-sm font-medium">Your Prompt is Ready</span>
        <button onClick={resetWizard} className="text-gray-500 hover:text-white text-sm">
          Edit Answers
        </button>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Your Custom Prompt</h2>
          <p className="text-gray-500 text-sm">Copy this prompt and paste it into your chosen AI tool</p>
        </div>

        <div className="mb-4 flex gap-3">
          <button
            onClick={handleCopy}
            className={'flex-1 py-3 rounded-lg font-semibold text-white transition-all ' + (copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-500')}
          >
            {copied ? 'Copied to clipboard!' : 'Copy Full Prompt'}
          </button>
          <a
            href={toolLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className={'px-4 py-3 rounded-lg font-semibold text-white transition-all text-center ' + toolColor.split(' ').slice(1).join(' ')}
          >
            {toolLink.label}
          </a>
        </div>

        <div className="prompt-output mb-6 text-sm leading-relaxed">
          {generatedPrompt}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-white mb-3">How to use this prompt</h3>
          <ol className="space-y-2">
            {instructions.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {promptHistory.length > 1 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Recent Prompts</h3>
            <div className="space-y-2">
              {promptHistory.slice(1, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{item.toolName} — {item.productType || item.pathId}</span>
                  <span className="text-gray-600 text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
