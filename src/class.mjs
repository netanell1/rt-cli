import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile } from './handler.mjs';

export function createClass(classFullName, options) {
    const folderArr = classFullName.split('/');
    const folderPath = folderArr.slice(0, folderArr.length - 1).join('/');
    const className = folderArr[folderArr.length - 1];
    const classDir = path.join(process.cwd(), folderPath);

    if (!fs.existsSync(classDir)) {
        fs.mkdirSync(classDir, { recursive: true });
    }


    const configPath = findConfigFile(process.cwd());
    let fileExtension = 'js';
    let classSuffix = "";
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        fileExtension = config.language === 'ts' ? 'ts' : 'js';
        classSuffix = config.modelSuffix ? ".class" : "";
    }

    if (options.js) {
        fileExtension = 'js';
    } else if (options.ts) {
        fileExtension = 'ts';
    }

    if (options.modelSuffix) {
        classSuffix = ".interface";
    }

    const classPath = path.join(classDir, `${className}${classSuffix}.${fileExtension}`);

    if (fs.existsSync(classPath)) {
        console.log(chalk.red(`Error: File ${className} already exists.`));
        process.exit(1);
    }
    const classCurrentName = className[0].toUpperCase() + className.slice(1, className.length)


    const classContent = `
export class ${classCurrentName} {

}
  `;

    fs.writeFileSync(classPath, classContent.trim());

    console.log(chalk.green(`Class ${className} created successfully at ${classPath}.`));
}
