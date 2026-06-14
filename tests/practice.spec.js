// JavaScript uses 'require' instead of 'import'
const { test, expect } = require('@playwright/test');

test('Verify user can log in and add backpack to cart', async ({ page }) => {
  
  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill('standard_user');

  await page.locator('[data-test="password"]').fill('secret_sauce');

  await page.locator('[data-test="login-button123"]').click();

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  const cartBadge = page.locator('[data-test="shopping-cart-badge"]');

  await expect(cartBadge).toHaveText('1');

});