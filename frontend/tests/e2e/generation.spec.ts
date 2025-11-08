import { test, expect } from '@playwright/test';

const mockTasks = [
  {
    id: '1',
    title: 'Bootstrap frontend shell',
    description: 'Create the initial React scaffolding with routing and state management.',
    status: 'Pending',
    category: 'Frontend',
    confidence: 85,
  },
  {
    id: '2',
    title: 'Integrate backend API',
    description: 'Connect to the task generation endpoint and handle responses.',
    status: 'Pending',
    category: 'Backend',
    confidence: 72,
  },
];

test('generates tasks from user prompt', async ({ page }) => {
  await page.route('**/api/generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockTasks),
    });
  });

  await page.goto('/');
  await page.fill('textarea', 'Plan a roadmap for a multi-tenant CRM.');
  await page.getByRole('button', { name: /generate tasks/i }).click();

  await expect(page.getByTestId('task-card')).toHaveCount(mockTasks.length);
  await expect(page.getByText(mockTasks[0].title)).toBeVisible();
  await expect(page.getByText(mockTasks[1].title)).toBeVisible();
});
