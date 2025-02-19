import { execSync } from 'child_process';
import chalk from 'chalk';
// Function to upgrade the CLI tool to the latest version
export function upgradeCLI() {
    try {
        console.log(chalk.blue('Updating react-cli-rt to the latest version...'));
        execSync('npm uninstall -g react-cli-rt', { stdio: 'inherit' });
        // Execute the command to upgrade the package globally
        execSync('npm install -g react-cli-rt', { stdio: 'inherit' });
        console.log(chalk.green('Successfully upgraded react-cli-rt to the latest version!'));
    }
    catch (error) {
        console.error(chalk.red('Failed to upgrade react-cli-rt. Please try again.'));
        console.error(chalk.red(`Error: ${error.message}`));
    }
}
