import fs from 'fs';
import { findConfigFile } from "./helpers.js";
import chalk from 'chalk';
export function handleSettingOptions(options, dir, suffixName = "", componentName = "") {
    //  Determine file extensions based on options or config
    const configPath = findConfigFile(dir);
    let fileExtension = 'js'; // Default to JS if no options are specified
    let styleExtension = 'css'; // Default to CSS if no options are specified
    let styleModule = ''; // Determine if style should be a module
    let componentFileFormat = 'function'; // Determine component type
    let componentFileName = componentName; // Default component file name
    let styleFileName = componentName; // Default style file name
    let testLibrary = ''; // To hold the test library
    let suffix = "";
    if (fs.existsSync(configPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            fileExtension = config.language === 'ts' ? 'ts' : 'js';
            styleExtension = config.style || 'css'; // Default to CSS
            styleModule = config.useModuleStyle ? '.module' : ''; // Determine if style should be a module
            componentFileFormat = config.componentFileFormat || 'function'; // Check config for component type
            componentFileName = config.componentFileName || componentName; // Check config for component file name
            styleFileName = config.styleFileName || componentName; // Check config for style file name
            testLibrary = config.testLibrary || ''; // Check config for test library
            suffix = config.useSuffix ? suffixName : "";
        }
        catch (error) {
            console.warn(chalk.yellow("Warning: rt.json is broken."));
        }
    }
    // Override with command line options if provided
    if (options.js) {
        fileExtension = 'js';
    }
    else if (options.ts) {
        fileExtension = 'ts';
    }
    if (options.style) {
        styleExtension = options.style;
    }
    if ("useModuleStyle" in options && options.useModuleStyle == false) {
        styleModule = '';
    }
    else if (options.useModuleStyle) {
        styleModule = '.module';
    }
    if (options.function) {
        componentFileFormat = 'function';
    }
    else if (options.const) {
        componentFileFormat = 'const';
    }
    if (options.componentFileName) {
        componentFileName = options.componentFileName;
    }
    if (options.styleFileName) {
        styleFileName = options.styleFileName;
    }
    if (options.testLibrary) {
        testLibrary = options.testLibrary;
    }
    if ("useSuffix" in options && options.useSuffix == false) {
        suffix = ``;
    }
    else if (options.useSuffix) {
        suffix = suffixName;
    }
    return {
        fileExtension,
        styleExtension,
        styleModule,
        componentFileFormat,
        componentFileName,
        styleFileName,
        testLibrary,
        suffix
    };
}
