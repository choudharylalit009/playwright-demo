import { test, expect } from '@playwright/test';

test('Testing error in this website', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/inputs');
  
  // 1. Fill out the form using robust ID locators instead of generic roles
  await page.locator('#input-number').fill('9876543210');
  await page.locator('#input-text').fill('This is a Demo');
  await page.locator('#input-password').fill('Lalit@123');
  
  // Clean, targeted date entry
  await page.locator('#input-date').fill('2026-06-30');
  
  // 2. Click the Display Inputs button using its direct ID attribute
  await page.locator('#btn-display-inputs').click();

  // 3. Small pause to let the UI finish rendering the output container
  await page.waitForTimeout(1000);

  // 4. THE CONDITIONAL CHECK
  // We check if the orange output box container actually exists on the screen
  const isDateDisplayed = await page.locator('#output-date').isVisible();

  if (isDateDisplayed) {
    // If it is visible, it means the website improperly accepted a future date!
    // This line breaks execution immediately and reports a brilliant clear failure.
    throw new Error("FAIL: The website accepted a future Date of Birth without showing an error message!");
  } else {
    console.log("PASS: The website correctly rejected a future Date of Birth.");
  }
});