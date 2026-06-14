import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://github.com/login');
  await page.getByRole('textbox', { name: 'Username or email address' }).click();
  await page.getByRole('textbox', { name: 'Username or email address' }).fill('joedavis.123');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Iamavest9876');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  const errorMessage = await page.locator('#js-flash-container .flash-error').textContent();
  expect(errorMessage).toContain('Incorrect username or password.');
});
