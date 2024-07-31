import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import figlet from 'figlet';
import PromptSync from 'prompt-sync';
import { initConfig } from './init.mjs';

export function handleInit(options) {
    const prompt = PromptSync();
    const configFilePath = findConfigFile(process.cwd());

    if (configFilePath) {
        const answer = prompt('rt.json already exists. Overwrite? (y/n): ').trim().toLowerCase();

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
export function checkTypeScriptConfigured() {
    const configPath = findConfigFile(process.cwd())
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


export function printVersion() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const packagePath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const version = packageJson.version;
    console.log(chalk.cyan(figlet.textSync('React CLI', { font: 'Star Wars' })));
    console.log(chalk.cyan(`Version: ${version}`));
}
