import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Keep concurrency to 1 worker when demoing to your manager so windows don't clash
  fullyParallel: false,
  workers: 1,

  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],

  use: {
    // 1. CHANGE TO FALSE: This forces the browser window to open up visually
    headless: false,
    
    // 2. ADD LAUNCH OPTIONS: This injects a pause between actions
    launchOptions: {
      // 1000 milliseconds = 1 second pause after every click, fill, or navigation
      slowMo: 1000, 
    },

    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});