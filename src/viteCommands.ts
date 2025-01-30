import { execSync } from 'child_process';
import chalk from 'chalk';
import { findPackageJsonFile } from './helpers.js';
import fs from 'fs';

// Function to run npm script
function runNpmScript(scriptName: string) {
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

  } catch (error: any) {
    console.error(chalk.red(`Error: Failed to run npm ${scriptName}.`));
    process.exit(0);
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