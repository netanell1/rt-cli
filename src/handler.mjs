import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import figlet from 'figlet';
import PromptSync from 'prompt-sync';
import { initConfig } from './init.mjs';
import { execSync } from 'child_process';

export function handleInit(options) {
    const prompt = PromptSync();
    const configFilePath = findConfigFile(process.cwd());

    if (configFilePath) {
        const answer = prompt('rt.json already exists. Overwrite? (y/n): ')?.trim()?.toLowerCase();

        if (answer === 'y' || answer === 'yes') {
            fs.unlinkSync(configFilePath);
            initConfig(options); // Create new rt.json file
        } else {
            console.log(chalk.yellow('No changes made to rt.json.'));
        }
    } else {
        initConfig(options); // Create new rt.json file if it does not exist
    }
};

// print warning if ts not defined
export function checkTypeScriptConfigured(startPath) {
    const configPath = findConfigFile(startPath)
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (config.language !== 'ts') {
            console.log(chalk.yellow('Warning: TypeScript is not configured. Use `rt init --ts` to set TypeScript as the default language.'));
        }
    }
}


// Helper function to find rt.json in current or parent directories
export function findConfigFile(startPath) {
    let currentPath = startPath;

    while (currentPath !== path.parse(currentPath).root) {
        const configFilePath = path.join(currentPath, 'rt.json');
        if (fs.existsSync(configFilePath)) {
            return configFilePath;
        }
        currentPath = path.dirname(currentPath); // Move up one directory level
    }

    return null; // Return null if not found
};


// Helper function to find .gitignore in current or parent directories
export function appendToGitignore(startPath, entry) {
    let currentPath = startPath;
    let pathFolder = ''
    while (currentPath !== path.parse(currentPath).root) {
        const gitignorePath = path.join(currentPath, '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
            if (!gitignoreContent.includes(entry)) {
                fs.appendFileSync(gitignorePath, `${pathFolder}${entry}\n`);
                console.log(chalk.green(`ADDED`), `'${entry}' to ${path.relative(process.cwd(), gitignorePath)}`);
            }
            return
        }
        const foldersArr = currentPath.split('\\')
        pathFolder += `${foldersArr[foldersArr.length - 1]}/`
        currentPath = path.dirname(currentPath); // Move up one directory level
    }

    return null; // Return null if not found
};



export function printVersion() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const packagePath = path.resolve(__dirname, '../package.json');
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
    } catch (error) {
        console.error(chalk.red(`Failed to get ${packageManager} version: ${error.message}`));
    }

    const os = `${process.platform} ${process.arch}`;
    // Display information
    console.log(chalk.cyan(`React CLI RT: ${version}`));
    console.log(chalk.cyan(`Node: ${nodeVersion}`));
    console.log(chalk.cyan(`Package Manager: ${packageManager} ${packageManagerVersion}`));
    console.log(chalk.cyan(`OS: ${os}`));
}
