import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { appendToGitignore, findConfigFile } from './handler.js';
import PromptSync from 'prompt-sync';
export function handleInit(options) {
    const prompt = PromptSync();
    const configFilePath = findConfigFile(process.cwd());
    if (configFilePath) {
        const answer = prompt('rt.json already exists. Overwrite? (y/n): ')?.trim()?.toLowerCase();
        if (answer === 'y' || answer === 'yes') {
            fs.unlinkSync(configFilePath);
            initConfig(options); // Create new rt.json file
        }
        else {
            console.log(chalk.yellow('No changes made to rt.json.'));
        }
    }
    else {
        initConfig(options); // Create new rt.json file if it does not exist
    }
}
;
function initConfig(options) {
    const configPath = path.join(process.cwd(), 'rt.json');
    // Default configuration
    const defaultConfig = {
        language: options.ts ? 'ts' : 'js', // Set default language based on options
        style: options.style || 'css', // Default to CSS
        moduleStyle: options.moduleStyle || false, // Default to false if not specified
        componentFileFormat: options.const ? 'const' : 'function', // Default to 'function'
        componentFileName: options.componentFileName || '', // Default component file name
        styleFileName: options.styleFileName || '', // Default style file name
        modelSuffix: options.modelSuffix ? true : false,
    };
    // Check if configuration file already exists
    if (fs.existsSync(configPath)) {
        console.log(chalk.red('Error: Configuration file rt.json already exists.'));
        return;
    }
    // Write the default configuration to rt.json
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    const configSize = fs.statSync(configPath).size;
    console.log(chalk.green(`CREATE CONFIGURATION`), `${path.relative(process.cwd(), configPath)} (${configSize} bytes)`);
    appendToGitignore(process.cwd(), 'rt.json');
    // console.log(chalk.green('Configuration file rt.json created with default settings.'));
}
