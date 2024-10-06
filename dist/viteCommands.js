import { execSync } from 'child_process';
import chalk from 'chalk';
import { findPackageJsonFile } from './handler.js';
import fs from 'fs';
// Function to run npm script
function runNpmScript(scriptName) {
    const packageJsonPath = findPackageJsonFile(process.cwd());
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (!packageJson.scripts[scriptName]) {
            console.error(chalk.red(`Error: Script ${scriptName} not found in package.json.`));
            console.error(chalk.red(`Please make sure you are running the command within a Vite & React workspace.`));
            process.exit(0);
        }
        console.log(chalk.blue(`Running npm ${scriptName}...`));
        execSync(`npm run ${scriptName}`, { stdio: 'inherit' });
        console.log(chalk.green(`Successfully ran npm ${scriptName}!`));
    }
    catch (error) {
        console.error(chalk.red(`Error: This command is not available when running the React CLI RT outside a workspace of React & Vite.`));
        process.exit(0);
        // console.error(chalk.red(`Failed to run npm ${scriptName}. Please check if the script is defined in package.json.`));
        console.error(chalk.red(`Error: ${error.message}`));
    }
}
export function dev() {
    runNpmScript('dev');
}
export function build() {
    runNpmScript('build');
}
export function lint() {
    runNpmScript('lint');
}
export function preview() {
    runNpmScript('preview');
}