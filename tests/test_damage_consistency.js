const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Helper to load game scripts into a context
function loadGameScript(filename, context) {
    const scriptPath = path.join(__dirname, '../src/scripts', filename);
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    vm.runInContext(scriptContent, context);
}

function runTests() {
    console.log("=== Running Damage Consistency Tests ===");

    // Create a sandbox context
    const sandbox = {
        console: console,
        Math: Math
    };
    vm.createContext(sandbox);

    // Load necessary classes into sandbox
    loadGameScript('hero.js', sandbox);
    loadGameScript('enemy.js', sandbox);

    // Define test logic inside the sandbox or run it here using sandbox variables
    // Easier to run a test script inside the sandbox

    const testScript = `
        let failures = 0;

        // Test Hero
        console.log("\\nTesting Hero Class:");
        // Defense 25 => Reduction 12.5. Damage 20 => Raw 7.5.
        const hero = new Hero(0, 'TestHero', 'Tank', 100, 10, 25);
        const heroReported = hero.takeDamage(20);
        const heroLoss = 100 - hero.health;

        console.log(\`Hero Reported Damage: \${heroReported}\`);
        console.log(\`Hero Actual Loss: \${heroLoss}\`);

        if (Math.abs(heroLoss - heroReported) > 0.0001) {
            console.log("❌ FAIL: Hero actual loss does not match reported damage");
            failures++;
        } else {
            console.log("✅ PASS: Hero actual loss matches reported damage");
        }

        // Test Enemy
        console.log("\\nTesting Enemy Class:");
        // Defense 25 => Reduction 12.5. Damage 20 => Raw 7.5.
        const enemy = new Enemy(0, 'TestEnemy', 100, 10, 25);
        const enemyReported = enemy.takeDamage(20);
        const enemyLoss = 100 - enemy.health;

        console.log(\`Enemy Reported Damage: \${enemyReported}\`);
        console.log(\`Enemy Actual Loss: \${enemyLoss}\`);

        if (Math.abs(enemyLoss - enemyReported) > 0.0001) {
            console.log("❌ FAIL: Enemy actual loss does not match reported damage");
            failures++;
        } else {
            console.log("✅ PASS: Enemy actual loss matches reported damage");
        }

        failures;
    `;

    const result = vm.runInContext(testScript, sandbox);

    if (result > 0) {
        console.log(`\n❌ Total Failures: ${result}`);
        process.exit(1);
    } else {
        console.log("\n✅ All Tests Passed!");
        process.exit(0);
    }
}

runTests();
