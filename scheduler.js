const { execSync } = require('child_process');

// ==========================================
// 1. SET YOUR TARGET RUN TIME HERE (24-Hour Format)
// ==========================================
const TARGET_HOUR = 15;
const TARGET_MINUTE = 32;

console.log(`Playwright scheduler active. Waiting quietly for ${TARGET_HOUR}:${TARGET_MINUTE}...`);

// 2. Start the clock monitoring loop
setInterval(() => {
    const now = new Date();
    const currentHour = now.getHours();      
    const currentMinute = now.getMinutes();  
    
    // 3. Check if the system clock matches our target time
    if (currentHour === TARGET_HOUR && currentMinute === TARGET_MINUTE) {
        console.log(`Target time reached (${TARGET_HOUR}:${TARGET_MINUTE})! Launching test suite...`);
        
        try {
            // FIXED: Changed demotest.spec.js to demotest.spec.ts so all 3 files execute!
            execSync('npx playwright test tests/demotest.spec.ts --headed --project=chromium', { stdio: 'inherit' });
            console.log("Scheduled test execution finished.");
        } catch (error) {
            console.log("Test execution completed with some failed test steps.");
        } finally {
            // 4. THE PERFECT REPORT & TRACE LAUNCHER
            // Opens your dashboard directly where your "View Trace" click buttons are located.
            // Uses --port 0 so it never crashes if an old report window is left open.
            console.log("Launching test history report dashboard with embedded Trace Viewer links...");
            try {
                execSync('npx playwright show-report --port 0', { stdio: 'inherit' });
            } catch (reportError) {
                console.log("Report viewer closed.");
            }
        }
    }
}, 10000);