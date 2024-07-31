
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile } from './handler.mjs';

export function createEnum(enumFullName, options) {
    const folderArr = enumFullName.split('/');
    const folderPath = folderArr.slice(0, folderArr.length - 1).join('/')
    const enumName = folderArr[folderArr.length - 1]
    const enumDir = path.join(process.cwd(), folderPath);

    if (!fs.existsSync(enumDir)) {
        fs.mkdirSync(enumDir, { recursive: true });
    }

    const configPath = findConfigFile(process.cwd());;
    let enumSuffix = "";
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        enumSuffix = config.modelSuffix ? ".enum" : "";
    }

    if (options.modelSuffix) {
        enumSuffix = ".enum";
    }

    const enumPath = path.join(enumDir, `${enumName}${enumSuffix}.ts`);

    if (fs.existsSync(enumPath)) {
        console.log(chalk.red(`Error: File ${enumName} already exists.`));
        process.exit(1);
    }

    const enumCurrentName = enumName[0].toUpperCase() + enumName.slice(1, enumName.length)

    const enumContent = `
export enum ${enumCurrentName} {

}
  `;

    fs.writeFileSync(enumPath, enumContent.trim());

    console.log(chalk.green(`Enum ${enumName} created successfully at ${enumPath}.`));
}
