
import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskCategory } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { TestIcon } from './icons/TestIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ClockIcon } from './icons/ClockIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface TaskDashboardProps {
  initialTasks: Task[];
}

const statusConfig = {
    [TaskStatus.Pending]: { color: 'bg-gray-500', icon: <ClockIcon className="w-5 h-5" /> },
    [TaskStatus.AwaitingApproval]: { color: 'bg-yellow-500', icon: <ClockIcon className="w-5 h-5" /> },
    [TaskStatus.GeneratingCode]: { color: 'bg-blue-500', icon: <div className="w-4 h-4 rounded-full border-2 border-dashed border-white animate-spin"></div> },
    [TaskStatus.Testing]: { color: 'bg-purple-500', icon: <div className="w-4 h-4 rounded-full border-2 border-dashed border-white animate-spin"></div> },
    [TaskStatus.Completed]: { color: 'bg-green-500', icon: <CheckCircleIcon className="w-5 h-5" /> },
    [TaskStatus.Error]: { color: 'bg-red-500', icon: <XCircleIcon className="w-5 h-5" /> },
    [TaskStatus.Rejected]: { color: 'bg-red-700', icon: <XCircleIcon className="w-5 h-5" /> },
};

const categoryIcons = {
    [TaskCategory.Frontend]: <CodeIcon className="w-6 h-6 text-blue-400" />,
    [TaskCategory.Backend]: <CodeIcon className="w-6 h-6 text-purple-400" />,
    [TaskCategory.Database]: <DatabaseIcon className="w-6 h-6 text-green-400" />,
    [TaskCategory.Testing]: <TestIcon className="w-6 h-6 text-yellow-400" />,
    [TaskCategory.Deployment]: <SparklesIcon className="w-6 h-6 text-indigo-400" />,
    [TaskCategory.Authentication]: <SparklesIcon className="w-6 h-6 text-orange-400" />,
    [TaskCategory.General]: <SparklesIcon className="w-6 h-6 text-gray-400" />,
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const TaskItem: React.FC<{ task: Task, onUpdate: (id: string, status: TaskStatus) => void }> = ({ task, onUpdate }) => {
    const { color, icon } = statusConfig[task.status] || statusConfig[TaskStatus.Pending];
    return (
        <div className="bg-gray-800/70 border border-gray-700 p-4 rounded-lg flex items-start space-x-4 transition-all hover:bg-gray-800/90 hover:border-gray-600">
            <div className="flex-shrink-0 pt-1">{categoryIcons[task.category] || categoryIcons.General}</div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-white">{task.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    </div>
                    <div className={`flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full text-white ${color}`}>
                        {icon}
                        <span>{task.status}</span>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="text-xs text-gray-400 mb-1">Confidence</div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" style={{ width: `${task.confidence}%` }}></div>
                    </div>
                </div>
                 {task.status === TaskStatus.AwaitingApproval && (
                    <div className="mt-4 flex space-x-2">
                        <button onClick={() => onUpdate(task.id, TaskStatus.Pending)} className="px-3 py-1 text-xs font-semibold bg-green-600 hover:bg-green-500 rounded text-white">Accept</button>
                        <button onClick={() => onUpdate(task.id, TaskStatus.Rejected)} className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 rounded text-white">Reject</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const TaskDashboard: React.FC<TaskDashboardProps> = ({ initialTasks }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    
    const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
        setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status } : t));
    }, []);

    const processTask = useCallback(async (taskId: string) => {
        await sleep(1000);
        updateTaskStatus(taskId, TaskStatus.GeneratingCode);
        await sleep(2500);
        updateTaskStatus(taskId, TaskStatus.Testing);
        await sleep(2000);
        const success = Math.random() > 0.15; // 85% success rate
        updateTaskStatus(taskId, success ? TaskStatus.Completed : TaskStatus.Error);
        setIsProcessing(false);
    }, [updateTaskStatus]);

    useEffect(() => {
        const taskToProcess = tasks.find(t => t.status === TaskStatus.Pending);
        if (taskToProcess && !isProcessing) {
            setIsProcessing(true);
            processTask(taskToProcess.id);
        }
    }, [tasks, isProcessing, processTask]);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Generated Development Plan</h2>
            <div className="space-y-4">
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} onUpdate={updateTaskStatus} />
                ))}
            </div>
        </div>
    );
};

export default TaskDashboard;
