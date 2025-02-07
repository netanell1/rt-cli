import fs from 'fs';
import { exec } from 'child_process';
import chalk from 'chalk';
import { findPackageJsonFile } from './helpers.js';
import ora from 'ora';
export function updateDependencies() {
    const packageJsonPath = findPackageJsonFile(process.cwd());
    if (fs.existsSync(packageJsonPath)) {
        const spinner = ora(`updating dependencies....`).start();
        exec('npm update --save', (error, stdout, stderr) => {
            if (error) {
                spinner.fail("Error updated dependencies");
                console.error(chalk.red(`Error: Project update failed.`));
                return;
            }
            if (stderr) {
                spinner.fail("Error updated dependencies");
                console.error(chalk.red(`Error: ${stderr}`));
                return;
            }
            spinner.succeed(`successfully updated dependencies!`);
            console.log(chalk.green(stdout));
        });
    }
    else {
        console.error(chalk.red('Error: No package.json found.'));
    }
}
