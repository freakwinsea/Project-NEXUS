import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Container,
  Divider,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import PromptForm from '../components/forms/PromptForm';
import TaskFilters, { CategoryFilter, StatusFilter, TaskMetrics } from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import AppLayout from '../components/layout/AppLayout';
import { useTaskGeneration } from '../hooks/useTaskGeneration';
import { Task, TaskStatus } from '~shared/types';

const Dashboard = () => {
  const { tasks, history, generate, isGenerating, error, clearHistory } = useTaskGeneration();
  const [taskState, setTaskState] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');
  const [activePrompt, setActivePrompt] = useState('');
  const toast = useToast();

  useEffect(() => {
    setTaskState(tasks);
  }, [tasks]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Unable to generate tasks',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const filteredTasks = useMemo(() => {
    return taskState.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      const matchesSearch =
        search.trim().length === 0 ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [taskState, statusFilter, categoryFilter, search]);

  const metrics: TaskMetrics | null = useMemo(() => {
    if (filteredTasks.length === 0) {
      return null;
    }
    const confidenceAverage =
      filteredTasks.reduce((sum, task) => sum + task.confidence, 0) / filteredTasks.length;
    const byStatus = filteredTasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    }, {});
    return { confidenceAverage, byStatus };
  }, [filteredTasks]);

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTaskState((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
  };

  const handleGenerate = (prompt: string) => {
    setActivePrompt(prompt);
    generate(prompt);
  };

  const handleRestorePrompt = (prompt: string) => {
    setActivePrompt(prompt);
    generate(prompt);
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSearch('');
  };

  return (
    <AppLayout
      historyItems={history}
      onRestorePrompt={handleRestorePrompt}
      onClearHistory={() => {
        clearHistory();
        toast({
          title: 'History cleared',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      }}
    >
      <Container maxW="7xl">
        <Stack spacing={10}>
          <Box textAlign="left">
            <Heading size="2xl" color="slate.100" mb={3}>
              Design your next sprint
            </Heading>
            <Text color="slate.300" fontSize="lg">
              Describe your product goal and let Project NEXUS craft a confident, prioritized plan.
            </Text>
          </Box>

          <PromptForm onSubmit={handleGenerate} isSubmitting={isGenerating} defaultPrompt={activePrompt} />

          {error && (
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Divider borderColor="slate.700" />

          <TaskFilters
            status={statusFilter}
            category={categoryFilter}
            search={search}
            metrics={metrics}
            onStatusChange={setStatusFilter}
            onCategoryChange={setCategoryFilter}
            onSearchChange={setSearch}
            onReset={handleResetFilters}
          />

          <Box>
            <HStack justify="space-between" mb={4}>
              <Heading size="md" color="slate.100">
                Generated tasks
              </Heading>
              <Text color="slate.400">{filteredTasks.length} items</Text>
            </HStack>
            {isGenerating ? (
              <Stack spacing={4}>
                {[...Array(3).keys()].map((index) => (
                  <Skeleton key={index} height="180px" borderRadius="xl" />
                ))}
              </Stack>
            ) : (
              <TaskList tasks={filteredTasks} onStatusChange={handleStatusChange} />
            )}
          </Box>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export default Dashboard;
