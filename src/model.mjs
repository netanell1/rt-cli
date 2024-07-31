import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile } from './handler.mjs';


export function createModel(modelType, modelFullName, options) {
    const folderArr = modelFullName.split('/');
    const folderPath = folderArr.slice(0, folderArr.length - 1).join('/');
    const modelName = folderArr[folderArr.length - 1];
    const modelDir = path.join(process.cwd(), folderPath);

    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
    }


    const configPath = findConfigFile(process.cwd());
    let fileExtension = 'js';
    let modelSuffix = "";
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        fileExtension = config.language === 'ts' ? 'ts' : 'js';
        modelSuffix = config.modelSuffix ? `.${modelType}` : "";
    }

    if (options.js) {
        fileExtension = 'js';
    } else if (options.ts) {
        fileExtension = 'ts';
    }

    if (options.modelSuffix) {
        modelSuffix = `.${modelType}`;
    }

    const modelPath = path.join(modelDir, `${modelName}${modelSuffix}.${modelType == "class" ? fileExtension : 'ts'}`);

    if (fs.existsSync(modelPath)) {
        console.log(chalk.red(`Error: File ${modelName} already exists.`));
        process.exit(1);
    }
    const modelCurrentName = modelName[0].toUpperCase() + modelName.slice(1, modelName.length)


    const modelContent = `
export ${modelType} ${modelCurrentName} {

}
  `;

    fs.writeFileSync(modelPath, modelContent.trim());

    console.log(chalk.green(`${modelType} ${modelName} created successfully at ${classPath}.`));
}
