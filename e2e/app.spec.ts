import { test, expect } from '@playwright/test';

test('should display the application', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/WorkoutAi/);
});
