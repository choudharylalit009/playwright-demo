import { test, expect } from '@playwright/test';
// 1. Load input data from external JSON source
import testData from '../testData.json'; 

// =========================================================================
// TEST 1: LOGIN (With Performance Tracking & External Data)
// =========================================================================
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
  console.log(`⏱️ Performance - Phase 1 (Login) took: ${(endTime - startTime) / 1000} seconds`);
});

// =========================================================================
// TEST 2: CHECKOUT (With Performance Tracking & External Data)
// =========================================================================
test('Demotest - Phase 2: Product Selection & Checkout Form', async ({ page }) => {
  // Capture start time
  const startTime = Date.now();

  // Quickly log back in using external credentials
  await page.goto(testData.urls.baseUrl);
  await page.locator('[data-test="username"]').fill(testData.loginUser);
  await page.locator('[data-test="password"]').fill(testData.loginPassword);
  await page.locator('[data-test="login-button"]').click();

  // Run the checkout process
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();

  // Use external customer details loaded from your JSON
  await page.locator('[data-test="firstName"]').fill(testData.checkoutData.firstName);
  await page.locator('[data-test="lastName"]').fill(testData.checkoutData.lastName);
  await page.locator('[data-test="postalCode"]').fill(testData.checkoutData.postalCode);
  
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();

  // Data Validation methodology - verify UI confirmation matches expectations
  const thankYouHeader = page.locator('[data-test="complete-header"]');
  await expect(thankYouHeader).toHaveText('Thank you for your order!');

  // Calculate and capture response time
  const endTime = Date.now();
  console.log(`⏱️ Performance - Phase 2 (Checkout) took: ${(endTime - startTime) / 1000} seconds`);
});

// =========================================================================
// TEST 3: LOGOUT (With Performance Tracking & External Data)
// =========================================================================
test('Demotest - Phase 3: User Session Logout', async ({ page }) => {
  // Capture start time
  const startTime = Date.now();

  // Quickly log back in using external credentials
  await page.goto(testData.urls.baseUrl);
  await page.locator('[data-test="username"]').fill(testData.loginUser);
  await page.locator('[data-test="password"]').fill(testData.loginPassword);
  await page.locator('[data-test="login-button"]').click();

  // Run the logout process
  await page.locator('#react-burger-menu-btn').click();
  await page.locator('[data-test="logout-sidebar-link"]').click();

  // Assert successful logout navigation back to the base page
  await expect(page).toHaveURL(testData.urls.baseUrl);

  // Calculate and capture response time
  const endTime = Date.now();
  console.log(`⏱️ Performance - Phase 3 (Logout) took: ${(endTime - startTime) / 1000} seconds`);
});