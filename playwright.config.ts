import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Enterprise Cross-Environment Configuration File.
 * This setup dynamically adapts between local manager demonstrations
 * and headless cloud execution platforms like GitHub Actions.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* 
     * DYNAMIC ENVIRONMENT SWITCHES:
     * process.env.CI is automatically provided by GitHub Actions.
     * 1. Headless: Runs hidden 'true' in the cloud to prevent crashing, but pops open a browser window 'false' on your laptop.
     * 2. SlowMo: Runs at instant cloud speed '0' in CI, but introduces a clean 1-second '1000' typing delay for your manager POC.
     */
    headless: process.env.CI ? true : false,
    slowMo: process.env.CI ? 0 : 1000,
    
    /* Collect trace when retrying a failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});