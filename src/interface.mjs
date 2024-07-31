
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile } from './handler.mjs';

export function createInterface(interfaceFullName, options) {
    const folderArr = interfaceFullName.split('/');
    const folderPath = folderArr.slice(0, folderArr.length - 1).join('/')
    const interfaceName = folderArr[folderArr.length - 1]
    const interfaceDir = path.join(process.cwd(), folderPath);

    if (!fs.existsSync(interfaceDir)) {
        fs.mkdirSync(interfaceDir, { recursive: true });
    }

    const configPath = findConfigFile(process.cwd());;
    let interfaceSuffix = "";
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        interfaceSuffix = config.modelSuffix ? ".interface" : "";
    }

    if (options.modelSuffix) {
        interfaceSuffix = ".interface";
    }

    const interfacePath = path.join(interfaceDir, `${interfaceName}${interfaceSuffix}.ts`);

    if (fs.existsSync(interfacePath)) {
        console.log(chalk.red(`Error: File ${interfaceName} already exists.`));
        process.exit(1);
    }

    const interfaceCurrentName = interfaceName[0].toUpperCase() + interfaceName.slice(1, interfaceName.length)


    const interfaceContent = `
export interface ${interfaceCurrentName} {

}
  `;

    fs.writeFileSync(interfacePath, interfaceContent.trim());

    console.log(chalk.green(`Interface ${interfaceName} created successfully at ${interfacePath}.`));
}
