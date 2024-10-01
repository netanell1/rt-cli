import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { findConfigFile, replaceSpecialCharacters } from './handler.js';
import chalk from 'chalk';
import PromptSync from 'prompt-sync';
export function createReactApp(appName, options) {
    const appNameCorrect = replaceSpecialCharacters(appName, true, ["-"]);
    if (appNameCorrect != appName) {
        console.log(chalk.red(`Error: App name is incorrect, try '${appNameCorrect}' instead.`));
        process.exit(1);
    }
    console.log(chalk.blue(`Creating a new React app: ${appName}`));
    const configPath = findConfigFile(process.cwd());
    let language = 'js'; // Default to JS if no options are specified
    let styleExtension = 'css'; // Default to CSS if no options are specified
    let useModuleStyle = options.useModuleStyle ?? false; // Determine if style should be a module
    let componentFileFormat = options.const ? 'const' : 'function'; // Determine component type
    let componentFileName = options.componentFileName || null; // Default component file name
    let styleFileName = options.styleFileName || null; // Default style file name
    let testLibrary = options.testLibrary || null; // To hold the test library
    let useSuffix = options.useSuffix ?? false; // Default useSuffix as false
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        language = config.language === 'ts' ? 'ts' : 'js';
        styleExtension = config.style || 'css'; // Default to CSS
        useModuleStyle = config.useModuleStyle ?? false; // Determine if style should be a module
        componentFileFormat = config.componentFileFormat || 'function'; // Check config for component type
        componentFileName = config.componentFileName || null; // Check config for component file name
        styleFileName = config.styleFileName || null; // Check config for style file name
        testLibrary = config.testLibrary || null; // Check config for test library
        useSuffix = config.useSuffix ?? false; //  Check config for useSuffix
    }
    // Override with command line options if provided
    if (options.js) {
        language = 'js';
    }
    else if (options.ts) {
        language = 'ts';
    }
    if (options.style) {
        styleExtension = options.style;
    }
    if (options.useModuleStyle) {
        useModuleStyle = true;
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
    if (options.useSuffix) {
        useSuffix = true;
    }
    const command = `npm create vite@latest ${appName} -- --template react${language === "ts" ? "-ts" : ""}`;
    execSync(command, { stdio: 'inherit' });
    // Rename app.css to the desired style extension if necessary
    const appPath = path.join(process.cwd(), appName, 'src');
    const oldAppStyleFile = path.join(appPath, `App.css`);
    const newAppStyleFile = path.join(appPath, `App.${styleExtension}`);
    if (fs.existsSync(oldAppStyleFile) && styleExtension !== 'css') {
        fs.renameSync(oldAppStyleFile, newAppStyleFile);
        // Update the import statement in App.js or App.tsx
        const appFileJsx = path.join(appPath, 'App.jsx');
        const appFileTsx = path.join(appPath, 'App.tsx');
        const appFilePath = fs.existsSync(appFileJsx) ? appFileJsx : appFileTsx;
        if (fs.existsSync(appFilePath)) {
            let appFileContent = fs.readFileSync(appFilePath, 'utf8');
            appFileContent = appFileContent.replace(/\.\/App\.css/g, `./App.${styleExtension}`);
            fs.writeFileSync(appFilePath, appFileContent);
        }
        console.log(chalk.green(`RENAMED`), `App.css to App.${styleExtension}`);
    }
    // Rename index.css to the desired style extension if necessary
    const oldIndexStyleFile = path.join(appPath, `index.css`);
    const newIndexStyleFile = path.join(appPath, `index.${styleExtension}`);
    if (fs.existsSync(oldIndexStyleFile) && styleExtension !== 'css') {
        fs.renameSync(oldIndexStyleFile, newIndexStyleFile);
        // Update the import statement in App.js or App.tsx
        const mainFileJsx = path.join(appPath, 'main.jsx');
        const mainFileTsx = path.join(appPath, 'main.tsx');
        const mainFilePath = fs.existsSync(mainFileJsx) ? mainFileJsx : mainFileTsx;
        if (fs.existsSync(mainFilePath)) {
            let mainFileContent = fs.readFileSync(mainFilePath, 'utf8');
            mainFileContent = mainFileContent.replace(/\.\/index\.css/g, `./index.${styleExtension}`);
            fs.writeFileSync(mainFilePath, mainFileContent);
        }
        console.log(chalk.green(`RENAMED`), `index.css to index.${styleExtension}`);
        if (styleExtension === 'scss') {
            console.log(chalk.bgWhite(`Your style is scss`));
            console.log(chalk.bgWhite(`Run 'npm i sass'`));
        }
    }
    // Construct the rt init command with options
    // const rtOptions = Object.entries(options)
    //     .map(([key, value]) => (typeof value === 'boolean' && value ? `--${key}` : `--${key}=${value}`))
    //     .join(' ');
    let rtOptions = '';
    // Add options to the string based on the user's input
    rtOptions += language === 'ts' ? '--ts ' : '--js '; // Add either --js or --ts
    rtOptions += `--style ${styleExtension} `; // Add the style type (e.g., css, scss, etc.)
    rtOptions += useModuleStyle ? '--useModuleStyle ' : ''; // Add --useModuleStyle if true
    rtOptions += componentFileFormat === 'const' ? '--const ' : '--function '; // Add --const or --function
    rtOptions += componentFileName ? `--componentFileName ${componentFileName} ` : ''; // Add component file name option if provided
    rtOptions += styleFileName ? `--styleFileName ${styleFileName} ` : ''; // Add style file name option if provided
    rtOptions += testLibrary ? `--testLibrary ${testLibrary} ` : ''; // Add test library option if provided;
    rtOptions += useSuffix ? '--useSuffix ' : ''; // Add suffix option if applicable
    // Trim any trailing spaces
    rtOptions = rtOptions.trim();
    const initCommand = `rt init ${rtOptions}`;
    // Run 'rt init' command in the appName directory
    const appDir = path.join(process.cwd(), appName);
    try {
        execSync(initCommand, { stdio: 'inherit', cwd: appDir });
    }
    catch (error) {
        console.error(chalk.red('Error running rt init'), error);
    }
    handleInstallMore(appName);
}
function handleInstallMore(appName) {
    const prompt = PromptSync();
    const answer = prompt('Do you want to install more packages? (y/n): ')?.trim()?.toLowerCase();
    if (answer === 'y' || answer === 'yes') {
        const installCommand = `rt install`;
        // Run 'rt init' command in the appName directory
        const appDir = path.join(process.cwd(), appName);
        try {
            execSync(installCommand, { stdio: 'inherit', cwd: appDir });
        }
        catch (error) {
            console.error(chalk.red('Error running rt install'), error);
        }
    }
}
