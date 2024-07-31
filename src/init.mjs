import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export function initConfig(options) {
    const configPath = path.join(process.cwd(), 'rt.json');

    // Default configuration
    const defaultConfig = {
        language: options.ts ? 'ts' : 'js',    // Set default language based on options
        style: options.scss ? 'scss' : options.less ? 'less' : options.stylus ? 'styl' : 'css', // Default to CSS
        moduleStyle: options.moduleStyle || false, // Default to false if not specified
        componentType: options.const ? 'const' : 'function', // Default to 'function'
        componentFileName: options.componentFileName || '', // Default component file name
        styleFileName: options.styleFileName || '', // Default style file name
        modelSuffix: options.modelSuffix ? true : false,
        appTemplate: options.appTemplate || "react"
    };

    // Check if configuration file already exists
    if (fs.existsSync(configPath)) {
        console.log(chalk.yellow('Configuration file rt.json already exists.'));
        return;
    }

    // Write the default configuration to rt.json
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(chalk.green('Configuration file rt.json created with default settings.'));
}
