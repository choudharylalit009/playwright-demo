import { test, expect } from '@playwright/test';
import readline from 'readline';

// Interface structure to organize our user credentials cleanly
interface UserCredential {
  username: string;
  password: string;
}

// 1. Terminal collector that gathers pairs of usernames and passwords upfront
const collectCredentialsFromUser = async (): Promise<UserCredential[]> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const credentials: UserCredential[] = [];
  let counter = 1;

  console.log('\n======================================================');
  console.log('LIVE MULTI-INPUT INITIALIZATION (USERNAME & PASSWORD)');
  console.log('Enter your test combinations below.');
  console.log('Type "exit" in the username prompt to launch the browser sequence!');
  console.log('======================================================\n');

  const ask = () => new Promise<void>((resolve) => {
    rl.question(`[Input Entry #${counter}] Enter USERNAME: `, (usernameAns) => {
      const cleanUsername = usernameAns.trim();

      // Check if the user wants to break out of the input gathering stage
      if (cleanUsername.toLowerCase() === 'exit') {
        rl.close();
        resolve();
      } else {
        // If they entered a username, immediately ask them for the corresponding password
        rl.question(`[Input Entry #${counter}] Enter PASSWORD: `, (passwordAns) => {
          credentials.push({
            username: cleanUsername,
            password: passwordAns.trim()
          });
          counter++;
          console.log('------------------------------------------------------');
          resolve(ask()); // Recursive loop to fetch the next combo pair
        });
      }
    });
  });

  await ask();
  return credentials;
};

let collectedCredentials: UserCredential[] = [];

test.describe('Dynamic Multi-Input Authentication Suite', () => {
  
  // Terminal prompts run safely here before the browser runner engages its hard timers
  test.beforeAll(async () => {
    collectedCredentials = await collectCredentialsFromUser();
    if (collectedCredentials.length === 0) {
      console.log('No inputs provided. Injecting standard fallback credentials.');
      collectedCredentials.push({ username: 'standard_user', password: 'secret_sauce' });
    }
  });

  test('Single-Session Comprehensive Login Pipeline', async ({ page }) => {
    // Open the target webpage once at the start
    await page.goto('https://www.saucedemo.com/');

    let caseIndex = 1;

    // Loop through every username/password object pair you typed into your terminal
    for (const credential of collectedCredentials) {

      await test.step(`Login Attempt #${caseIndex}: User="${credential.username}" | Pass="${credential.password}"`, async () => {
        // Clear previous input values out of the web elements entirely
        await page.locator('[data-test="username"]').clear();
        await page.locator('[data-test="password"]').clear();

        // Fill out both web fields dynamically with your custom credential variables
        await page.locator('[data-test="username"]').fill(credential.username);
        await page.locator('[data-test="password"]').fill(credential.password);
        
        // Execute the login submit action
        await page.locator('[data-test="login-button"]').click();
        await page.waitForTimeout(1500); // Visual slow-mo tracker delay

        const currentURL = page.url();

        if (currentURL.includes('inventory.html')) {
          console.log(`[Case #${caseIndex}] -> SUCCESS PATH (Green Check)`);
          
          // Reset the webpage view back to the login wall for the next entry loop step
          await page.locator('#react-burger-menu-btn').click();
          await page.locator('[data-test="logout-sidebar-link"]').click();
          await page.waitForTimeout(1000);
        } else {
          console.log(`[Case #${caseIndex}] -> FAILURE PATH (Red Cross)`);
          
          // Clear the UI error message banners so the form elements stay clean
          const errorButton = page.locator('.error-button');
          if (await errorButton.isVisible()) {
            await errorButton.click();
          }

          // Trigger an explicit error to turn this specific step card Red inside your dashboard view
          throw new Error(`Web Access Rejected: Access denied for credentials matching "${credential.username}:${credential.password}"`);
        }
      });

      caseIndex++;
    }
  });
});