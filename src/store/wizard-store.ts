import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PromptHistoryItem {
  id: string;
    createdAt: string;
      toolId: string;
        toolName: string;
          pathId: string;
            productType: string;
              niche: string;
                answers: Record<string, string | string[]>;
                  prompt: string;
                  }

                  export interface WizardState {
                    selectedToolId: string | null;
                      selectedPathId: string | null;
                        currentStep: number;
                          totalSteps: number;
                            answers: Record<string, string | string[]>;
                              generatedPrompt: string | null;
                                isGenerating: boolean;
                                  promptHistory: PromptHistoryItem[];
                                    selectTool: (toolId: string) => void;
                                      selectPath: (pathId: string) => void;
                                        setAnswer: (stepId: string, value: string | string[]) => void;
                                          toggleMultiAnswer: (stepId: string, value: string, max: number) => void;
                                            nextStep: () => void;
                                              prevStep: () => void;
                                                setTotalSteps: (n: number) => void;
                                                  setGeneratedPrompt: (prompt: string) => void;
                                                    setIsGenerating: (val: boolean) => void;
                                                      resetWizard: () => void;
                                                        startNewProject: () => void;
                                                          addToHistory: (item: PromptHistoryItem) => void;
                                                            loadFromHistory: (item: PromptHistoryItem) => void;
                                                            }

                                                            export const useWizardStore = create<WizardState>()(
                                                              persist(
                                                                  (set) => ({
                                                                        selectedToolId: null,
                                                                              selectedPathId: null,
                                                                                    currentStep: 0,
                                                                                          totalSteps: 0,
                                                                                                answers: {},
                                                                                                      generatedPrompt: null,
                                                                                                            isGenerating: false,
                                                                                                                  promptHistory: [],
                                                                                                                        selectTool: (toolId) => set({ selectedToolId: toolId, selectedPathId: null, currentStep: 0, answers: {}, generatedPrompt: null }),
                                                                                                                              selectPath: (pathId) => set({ selectedPathId: pathId, currentStep: 1, answers: {}, generatedPrompt: null }),
                                                                                                                                    setAnswer: (stepId, value) => set((s) => ({ answers: { ...s.answers, [stepId]: value } })),
                                                                                                                                          toggleMultiAnswer: (stepId, value, max) => set((s) => {
                                                                                                                                                  const cur = (s.answers[stepId] as string[]) || [];
                                                                                                                                                          const sel = cur.includes(value);
                                                                                                                                                                  const next = sel ? cur.filter(v => v !== value) : (cur.length >= max ? [...cur.slice(1), value] : [...cur, value]);
                                                                                                                                                                          return { answers: { ...s.answers, [stepId]: next } };
                                                                                                                                                                                }),
                                                                                                                                                                                      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
                                                                                                                                                                                            prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
                                                                                                                                                                                                  setTotalSteps: (n) => set({ totalSteps: n }),
                                                                                                                                                                                                        setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt }),
                                                                                                                                                                                                              setIsGenerating: (val) => set({ isGenerating: val }),
                                                                                                                                                                                                                    resetWizard: () => set({ selectedPathId: null, currentStep: 0, answers: {}, generatedPrompt: null, isGenerating: false }),
                                                                                                                                                                                                                          startNewProject: () => set({ selectedToolId: null, selectedPathId: null, currentStep: 0, answers: {}, generatedPrompt: null, isGenerating: false }),
                                                                                                                                                                                                                                addToHistory: (item) => set((s) => ({ promptHistory: [item, ...s.promptHistory].slice(0, 50) })),
                                                                                                                                                                                                                                      loadFromHistory: (item) => set({ selectedToolId: item.toolId, selectedPathId: item.pathId, answers: item.answers, generatedPrompt: item.prompt, currentStep: 999 }),
                                                                                                                                                                                                                                          }),
                                                                                                                                                                                                                                              { name: 'creator-prompt-maker-store', partialize: (s) => ({ promptHistory: s.promptHistory }) }
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                );
