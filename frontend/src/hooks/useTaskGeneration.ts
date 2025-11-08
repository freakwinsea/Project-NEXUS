import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateTasks } from '../api/tasks';
import type { Task } from '~shared/types';

export interface PromptHistoryItem {
  id: string;
  prompt: string;
  createdAt: string;
  status: 'success' | 'error' | 'pending';
  tasks?: Task[];
  errorMessage?: string;
}

const createHistoryItem = (prompt: string): PromptHistoryItem => ({
  id: `${Date.now()}`,
  prompt,
  createdAt: new Date().toISOString(),
  status: 'pending',
});

export const useTaskGeneration = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);

  const mutation = useMutation<Task[], Error, { prompt: string }, string>({
    mutationFn: generateTasks,
    onMutate: async (payload) => {
      const item = createHistoryItem(payload.prompt);
      setHistory((prev) => [item, ...prev].slice(0, 10));
      return item.id;
    },
    onSuccess: (data, payload, context) => {
      setTasks(data);
      setHistory((prev) =>
        prev.map((item) =>
          item.id === context
            ? { ...item, status: 'success', tasks: data }
            : item
        )
      );
    },
    onError: (error: Error, payload, context) => {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === context
            ? { ...item, status: 'error', errorMessage: error.message }
            : item
        )
      );
    },
  });

  const metrics = useMemo(() => {
    if (tasks.length === 0) {
      return null;
    }

    const confidenceAverage =
      tasks.reduce((sum, task) => sum + task.confidence, 0) / tasks.length;

    const byStatus = tasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    }, {});

    return { confidenceAverage, byStatus };
  }, [tasks]);

  return {
    tasks,
    history,
    metrics,
    generate: (prompt: string) => mutation.mutate({ prompt }),
    generateAsync: (prompt: string) => mutation.mutateAsync({ prompt }),
    isGenerating: mutation.isPending,
    error: mutation.error,
    clearHistory: () => setHistory([]),
  };
};
