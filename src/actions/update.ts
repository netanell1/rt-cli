import { execSync } from 'child_process';
import chalk from 'chalk';

// Function to update the CLI tool to the latest version
function updateCLI() {
    try {
        console.log(chalk.blue('Updating react-cli-rt to the latest version...'));

        // Execute the command to update the package globally
        execSync('npm install -g react-cli-rt', { stdio: 'inherit' });

        console.log(chalk.green('Successfully updated react-cli-rt to the latest version!'));
    } catch (error: any) {
        console.error(chalk.red('Failed to update react-cli-rt. Please try again.'));
        console.error(chalk.red(`Error: ${error.message}`));
    }
}

export default updateCLI;