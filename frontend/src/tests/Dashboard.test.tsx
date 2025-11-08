import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import theme from '../theme';
import { TaskCategory, TaskStatus } from '~shared/types';

describe('Dashboard', () => {
  const user = userEvent.setup();
  const mockTasks = [
    {
      id: '1',
      title: 'Implement authentication',
      description: 'Add OAuth support with refresh tokens',
      status: TaskStatus.Pending,
      category: TaskCategory.Authentication,
      confidence: 88,
    },
    {
      id: '2',
      title: 'Create landing page',
      description: 'Design and build the marketing landing page',
      status: TaskStatus.Pending,
      category: TaskCategory.Frontend,
      confidence: 75,
    },
  ];

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => mockTasks,
    })) as unknown as typeof fetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const renderDashboard = () => {
    const queryClient = new QueryClient();
    return render(
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </QueryClientProvider>
      </ChakraProvider>
    );
  };

  it('submits a prompt and renders tasks from the backend', async () => {
    renderDashboard();

    const promptField = screen.getByPlaceholderText(/generate a roadmap/i);
    await user.type(promptField, 'Create an AI enabled task planner');

    await user.click(screen.getByRole('button', { name: /generate tasks/i }));

    await waitFor(() => expect(screen.getAllByTestId('task-card')).toHaveLength(mockTasks.length));

    expect(screen.getByText(/implement authentication/i)).toBeInTheDocument();
    expect(screen.getByText(/create landing page/i)).toBeInTheDocument();
  });
});
