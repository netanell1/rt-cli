import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { findConfigFile } from './handler.mjs';
import chalk from 'chalk';
export function createReactApp(appName, options) {
    const configPath = findConfigFile(process.cwd());;
    let language = "ts";
    let styleExtension = 'css';
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        language = config.language == "ts" ? "ts" : "js";
        styleExtension = config.style || 'css';
    }

    if (options.ts) {
        language = "ts";
    }

    if (options.style) {
        styleExtension = options.style;
    }

    const command = `npm create vite@latest ${appName} -- --template react${language == "ts" ? "-ts" : ""}`


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
        console.log(chalk.green(`Renamed App.css to App.${styleExtension}`));
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

        console.log(chalk.green(`Renamed index.css to index.${styleExtension}`));

    }

}