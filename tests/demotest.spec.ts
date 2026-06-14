import { test, expect } from '@playwright/test';
// 1. Load input data from external JSON source (fixed case sensitivity)
import testData from '../testdata.json';
// ====================================================================
// TEST 1: LOGIN (With Performance Tracking & External Data)
// ====================================================================
test('Demotest - Phase 1: User Authentication / Login', async ({ page }) => {
  // Capture start time
  const startTime = Date.now();

  await page.goto(testData.urls.baseUrl);

  // Use external data
  await page.locator('[data-test="username"]').fill(testData.loginUser);
  await page.locator('[data-test="password"]').fill(testData.loginPassword);
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(testData.urls.inventoryUrl);

  // Calculate and capture response time
  const endTime = Date.now();
  console.log(`⏱️  Performance - Phase 1 (Login) took: ${(endTime - startTime) / 1000} seconds`);
});

// ====================================================================
// TEST 2: CHECKOUT FLOW (Using External Structured Data)
// ====================================================================
test('Demotest - Phase 2: Checkout Processing Pipeline', async ({ page }) => {
  // Login first to reach inventory
  await page.goto(testData.urls.baseUrl);
  await page.locator('[data-test="username"]').fill(testData.loginUser);
  await page.locator('[data-test="password"]').fill(testData.loginPassword);
  await page.locator('[data-test="login-button"]').click();

  const startTime = Date.now();

  // Add Item to Cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

  // Proceed to Checkout Form
  await page.locator('[data-test="checkout"]').click();

  // Fill Checkout Info from external JSON block
  await page.locator('[data-test="firstName"]').fill(testData.checkoutData.firstName);
  await page.locator('[data-test="lastName"]').fill(testData.checkoutData.lastName);
  await page.locator('[data-test="postalCode"]').fill(testData.checkoutData.postalCode);
  await page.locator('[data-test="continue"]').click();

  // Finish Order Execution
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');

  const endTime = Date.now();
  console.log(`⏱️  Performance - Phase 2 (Checkout) took: ${(endTime - startTime) / 1000} seconds`);
});

// ====================================================================
// TEST 3: LOGOUT (Session Terminating)
// ====================================================================
test('Demotest - Phase 3: Session Termination / Logout', async ({ page }) => {
  // Login first
  await page.goto(testData.urls.baseUrl);
  await page.locator('[data-test="username"]').fill(testData.loginUser);
  await page.locator('[data-test="password"]').fill(testData.loginPassword);
  await page.locator('[data-test="login-button"]').click();

  const startTime = Date.now();

  // Access sidebar and trigger logout
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();

  // Assert user is thrown back to login page screen
  await expect(page).toHaveURL(testData.urls.baseUrl);

  const endTime = Date.now();
  console.log(`⏱️  Performance - Phase 3 (Logout) took: ${(endTime - startTime) / 1000} seconds`);
});