'use client';

import { useWizardStore } from '@/store/wizard-store';

const TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT', icon: 'GPT', color: 'text-green-400', border: 'border-green-500', description: 'Build a full interactive HTML blueprint dashboard in Canvas mode', badge: 'Best for: Product Business Blueprints' },
  { id: 'claude', name: 'Claude', icon: 'CLD', color: 'text-orange-400', border: 'border-orange-500', description: 'Write complete ebooks, guides, templates and prompt packs in Artifacts mode', badge: 'Best for: Written Digital Products' },
  { id: 'gemini', name: 'Gemini', icon: 'GEM', color: 'text-blue-400', border: 'border-blue-500', description: 'Create Google Docs, Sheets and Slides or run deep market research first', badge: 'Best for: Google Workspace + Research' },
  { id: 'notebooklm', name: 'NotebookLM', icon: 'NLM', color: 'text-purple-400', border: 'border-purple-500', description: 'Turn your documents into courses, audio products and research insights', badge: 'Best for: Course Creation + Audio' },
];

export default function ToolSelector() {
  const { selectTool } = useWizardStore();
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Creator Prompt Maker</h1>
          <p className="text-gray-400 text-lg">Choose your AI tool to generate a custom mega-prompt for building and selling digital products</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <button key={tool.id} onClick={() => selectTool(tool.id)} className={'option-card text-left ' + tool.border}>
              <div className="flex items-start gap-4">
                <span className={'text-xl font-bold ' + tool.color}>{tool.icon}</span>
                <div className="flex-1">
                  <h2 className={'text-xl font-semibold ' + tool.color + ' mb-1'}>{tool.name}</h2>
                  <p className="text-gray-300 text-sm mb-2">{tool.description}</p>
                  <span className="text-xs text-gray-500 bg-gray-800 rounded px-2 py-0.5">{tool.badge}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
    }
