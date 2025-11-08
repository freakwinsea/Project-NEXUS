import { SimpleGrid, Text, VStack } from '@chakra-ui/react';
import TaskCard from './TaskCard';
import { Task, TaskStatus } from '~shared/types';

export interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const TaskList = ({ tasks, onStatusChange }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <VStack spacing={3} py={16} borderWidth="1px" borderColor="slate.700" borderRadius="2xl" bg="slate.800">
        <Text fontSize="lg" color="slate.200" fontWeight="semibold">
          No tasks match the selected filters.
        </Text>
        <Text color="slate.400">Try adjusting your filters or generate a new plan.</Text>
      </VStack>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6} mt={6} data-testid="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
      ))}
    </SimpleGrid>
  );
};

export default TaskList;
