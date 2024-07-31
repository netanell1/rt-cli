import { execSync } from 'child_process';
import chalk from 'chalk';

// Function to run npm script
function runNpmScript(scriptName) {
  try {
    console.log(chalk.blue(`Running npm ${scriptName}...`));

    // Execute the npm script
    execSync(`npm run ${scriptName}`, { stdio: 'inherit' });

    console.log(chalk.green(`Successfully ran npm ${scriptName}!`));
  } catch (error) {
    console.error(chalk.red(`Failed to run npm ${scriptName}. Please check if the script is defined in package.json.`));
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