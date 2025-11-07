
import React, { useState, useCallback } from 'react';
import { generateTaskList } from './services/geminiService';
import { Task } from './types';
import PromptInput from './components/PromptInput';
import TaskDashboard from './components/TaskDashboard';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setError("Please enter a development goal.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setTasks([]);

    try {
      const generatedTasks = await generateTaskList(prompt);
      setTasks(generatedTasks);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            Project NEXUS
          </h1>
          <p className="mt-2 text-lg text-gray-400">Autonomous Intent-Driven Development Agent</p>
        </header>

        <main>
          <PromptInput onSubmit={handleGenerate} isLoading={isLoading} />
          
          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {tasks.length > 0 ? (
            <TaskDashboard initialTasks={tasks} />
          ) : (
            !isLoading && !error && (
              <div className="text-center mt-12 py-16 px-6 bg-gray-800/50 rounded-lg border border-dashed border-gray-600">
                <SparklesIcon className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                <h2 className="text-2xl font-bold text-white">System Idle</h2>
                <p className="text-gray-400 mt-2">
                  Describe your application idea, and NEXUS will generate the development plan.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  e.g., "A modern blog platform with user authentication and markdown support."
                </p>
              </div>
            )
          )}
        </main>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>NEXUS simulation environment. Generated results are illustrative.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
