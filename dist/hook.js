import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile, replaceSpecialCharacters } from './handler.js';
export function createHook(hookFullName, options) {
    const folderArr = hookFullName.split('/');
    const folderPath = folderArr.slice(0, folderArr.length - 1).join('/');
    const hookName = folderArr[folderArr.length - 1];
    const hookNameCorrect = replaceSpecialCharacters(hookName, false);
    if (hookNameCorrect.slice(0, 3) != 'use') {
        console.log(chalk.red(`Error: Hook must start with use, try 'use${hookNameCorrect}' instead.`));
        process.exit(1);
    }
    if (hookNameCorrect != hookName) {
        console.log(chalk.red(`Error: Invalid hook name, try '${hookNameCorrect}' instead.`));
        process.exit(1);
    }
    const hookDir = path.join(process.cwd(), folderPath);
    if (!fs.existsSync(hookDir)) {
        fs.mkdirSync(hookDir, { recursive: true });
    }
    const configPath = findConfigFile(hookDir);
    let fileExtension = 'js';
    let modelSuffix = "";
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        fileExtension = config.language === 'ts' ? 'ts' : 'js';
        modelSuffix = config.modelSuffix ? `.hook` : "";
    }
    if (options.js) {
        fileExtension = 'js';
    }
    else if (options.ts) {
        fileExtension = 'ts';
    }
    if (options.modelSuffix) {
        modelSuffix = `.hook`;
    }
    const hookPath = path.join(hookDir, `${hookName}${modelSuffix}.${fileExtension}`);
    if (fs.existsSync(hookPath)) {
        console.log(chalk.red(`Error: File ${hookName} already exists.`));
        process.exit(1);
    }
    const hookContent = `import { useState, useEffect } from 'react';

    export function ${hookName}(initialValue) {

        const [value, setValue] = useState(initialValue);
    
        useEffect(() => {
            console.log('Value changed:', value);
        }, [value]);
    
        return [value, setValue];
    }
    `;
    fs.writeFileSync(hookPath, hookContent.trim());
    const hookSize = fs.statSync(hookPath).size;
    console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), hookPath)} (${hookSize} bytes)`);
}
