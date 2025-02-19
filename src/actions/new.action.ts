import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { findConfigFile, replaceSpecialCharacters } from './utils/helpers.js';
import chalk from 'chalk';
import PromptSync from 'prompt-sync';
import { handleSettingOptions } from './utils/handleSettingOptions.js';
import { OptionsModel } from '../models/interfaces/options.interface.js';

export function createReactApp(appName: string, options: OptionsModel) {
    const appNameCorrect = replaceSpecialCharacters(appName, true, ["-"])
    if (appNameCorrect != appName) {
        console.log(chalk.red(`Error: App name is incorrect, try '${appNameCorrect}' instead.`));
        process.exit(1);
    }

    console.log(chalk.blue(`Creating a new React app: ${appName}`));

    const { fileExtension, styleExtension, styleModule, componentFileFormat, componentFileName, styleFileName, testLibrary, suffix } = handleSettingOptions(options, process.cwd(), ".suffix");

    const command = `npm create vite@latest ${appName} -- --template react${fileExtension === "ts" ? "-ts" : ""}`;

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


    let rtOptions = '';

    // Add options to the string based on the user's input
    rtOptions += fileExtension === 'ts' ? '--ts ' : '--js '; // Add either --js or --ts
    rtOptions += `--style ${styleExtension} `;// Add the style type (e.g., css, scss, etc.)
    rtOptions += styleModule ? '--use-module-style ' : ''; // Add --useModuleStyle if true
    rtOptions += componentFileFormat === 'const' ? '--const ' : '--function '; // Add --const or --function
    rtOptions += componentFileName ? `--component-file-name ${componentFileName} ` : '' // Add component file name option if provided
    rtOptions += styleFileName ? `--style-file-name ${styleFileName} ` : '';    // Add style file name option if provided
    rtOptions += testLibrary ? `--test-library ${testLibrary} ` : ''     // Add test library option if provided;
    rtOptions += suffix ? '--use-suffix ' : '';    // Add suffix option if applicable
    // Trim any trailing spaces
    rtOptions = rtOptions.trim();

    const initCommand = `rt init ${rtOptions}`;
    // Run 'rt init' command in the appName directory
    const appDir = path.join(process.cwd(), appName);
    try {
        execSync(initCommand, { stdio: 'inherit', cwd: appDir });

    } catch (error) {
        console.error(chalk.red('Error running rt init'), error);
    }

    handleInstallMore(appName)

}


function handleInstallMore(appName: string) {
    const prompt = PromptSync();

    const answer = prompt('Do you want to install more packages? (y/n): ')?.trim()?.toLowerCase();

    if (answer === 'y' || answer === 'yes') {

        const installCommand = `rt install`;
        // Run 'rt init' command in the appName directory
        const appDir = path.join(process.cwd(), appName)
        try {
            execSync(installCommand, { stdio: 'inherit', cwd: appDir });

        } catch (error) {
            console.error(chalk.red('Error running rt install'), error);
        }
    }
}
