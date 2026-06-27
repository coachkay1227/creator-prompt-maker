'use client';

import { useWizardStore } from '@/store/wizard-store';

const PATHS: Record<string, Array<{id: string; label: string; description: string; steps: number}>> = {
  chatgpt: [
    { id: 'chatgpt-blueprint', label: 'Digital Product Blueprint', description: 'Get a full business blueprint HTML dashboard for any digital product', steps: 9 },
  ],
  claude: [
    { id: 'claude-ebook', label: 'Ebook / Guide / Lead Magnet', description: 'Write a complete written product in Artifacts mode', steps: 10 },
    { id: 'claude-template', label: 'Template / Spreadsheet / Planner', description: 'Create a ready-to-sell template or tracker', steps: 8 },
    { id: 'claude-promptpack', label: 'Prompt Pack / Swipe File', description: 'Generate a complete organized prompt pack', steps: 7 },
    { id: 'claude-course', label: 'Mini-Course / Email Course', description: 'Build a structured course curriculum and content', steps: 9 },
  ],
  gemini: [
    { id: 'gemini-product', label: 'Build a Digital Product', description: 'Create in Google Docs, Sheets, or Slides format', steps: 9 },
    { id: 'gemini-research', label: 'Market Research First', description: 'Deep research your niche before building', steps: 8 },
  ],
  notebooklm: [
    { id: 'nlm-course', label: 'Course Builder', description: 'Turn your documents into a full course with outlines, quizzes and sales copy', steps: 10 },
    { id: 'nlm-learning', label: 'Learning Tool', description: 'Create study guides, FAQs and concept maps from your sources', steps: 6 },
    { id: 'nlm-audio', label: 'Audio Product', description: 'Generate podcast-style audio overview from your content', steps: 7 },
    { id: 'nlm-research', label: 'Research + Validate', description: 'Research your market and validate your product idea', steps: 7 },
  ],
};

const TOOL_COLORS: Record<string, string> = {
  chatgpt: 'border-green-500 text-green-400',
  claude: 'border-orange-500 text-orange-400',
  gemini: 'border-blue-500 text-blue-400',
  notebooklm: 'border-purple-500 text-purple-400',
};

const TOOL_NAMES: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  notebooklm: 'NotebookLM',
};

export default function PathSelector() {
  const { selectedToolId, selectPath, startNewProject } = useWizardStore();
  const paths = PATHS[selectedToolId || ''] || [];
  const colorClass = TOOL_COLORS[selectedToolId || ''] || 'border-gray-500 text-gray-400';
  const toolName = TOOL_NAMES[selectedToolId || ''] || '';

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <button onClick={startNewProject} className="text-gray-500 hover:text-gray-300 text-sm mb-6 flex items-center gap-1">
          Back to tool selection
        </button>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">What are you building?</h2>
          <p className="text-gray-400">Select a path for <span className={colorClass.split(' ')[1]}>{toolName}</span></p>
        </div>
        <div className="flex flex-col gap-3">
          {paths.map((path) => (
            <button
              key={path.id}
              onClick={() => selectPath(path.id)}
              className={'option-card text-left ' + colorClass.split(' ')[0]}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">{path.label}</h3>
                  <p className="text-gray-400 text-sm">{path.description}</p>
                </div>
                <div className="text-gray-600 text-xs ml-4 whitespace-nowrap">{path.steps} questions</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
    }
