import chalk from "chalk";
import { execSync } from "child_process";
import figlet from "figlet";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function printVersion() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const packagePath = path.resolve(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const version = packageJson.version;

    // Display pretty react CLI
    console.log(chalk.cyan(`${figlet.textSync(' React CLI', { font: 'Star Wars' })}\n`));

    // Get Node.js version
    const nodeVersion = process.version;

    // Determine package manager and get its version
    let packageManager = 'npm';
    let packageManagerVersion;
    try {
        packageManagerVersion = execSync(`${packageManager} --version`, { encoding: 'utf-8' }).trim();
    } catch (error: any) {
        console.error(chalk.red(`Failed to get ${packageManager} version: ${error.message}`));
    }

    const os = `${process.platform} ${process.arch}`;
    // Display information
    console.log(chalk.cyan(`React CLI RT: ${version}`));
    console.log(chalk.cyan(`Node: ${nodeVersion}`));
    console.log(chalk.cyan(`Package Manager: ${packageManager} ${packageManagerVersion}`));
    console.log(chalk.cyan(`OS: ${os}`));
}