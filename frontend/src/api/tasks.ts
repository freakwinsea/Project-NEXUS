import { Task, TaskStatus } from '~shared/types';

export interface GenerateTasksPayload {
  prompt: string;
}

export const generateTasks = async (payload: GenerateTasksPayload): Promise<Task[]> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to generate tasks');
  }

  const tasks: Task[] = await response.json();

  return tasks.map((task) => ({
    ...task,
    status: task.status ?? TaskStatus.Pending,
  }));
};
