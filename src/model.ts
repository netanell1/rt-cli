import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { checkTypeScriptConfigured, findConfigFile, replaceSpecialCharacters } from './helpers.js';


export function createModel(modelType: string, modelFullName: string, options: any, checkTypeScript?: boolean) {
    const folderArr = modelFullName.split(/[/\\]/);
    const folderPath = folderArr.slice(0, folderArr.length - 1).join('/');
    const modelName = folderArr[folderArr.length - 1];


    const modelNameCorrect = replaceSpecialCharacters(modelName, false)
    if (modelNameCorrect != modelName) {
        console.log(chalk.red(`Error: Invalid ${modelType} name, try '${modelNameCorrect}' instead.`));
        process.exit(1);
    }
    let cwd = process.cwd()
    cwd = cwd.includes('src') || folderPath.includes('src') ? cwd : path.join(cwd, 'src')
    const modelDir = path.join(cwd, folderPath);

    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
    }

    const configPath = findConfigFile(modelDir) as string;
    let fileExtension = 'js';
    let suffix = "";
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        fileExtension = config.language === 'ts' ? 'ts' : 'js';
        suffix = config.useSuffix ? `.${modelType}` : "";
    }

    if (options.js) {
        fileExtension = 'js';
    } else if (options.ts) {
        fileExtension = 'ts';
    }

    if (options.useSuffix) {
        suffix = `.${modelType}`;
    }

    const modelPath = path.join(modelDir, `${modelName}${suffix}.${modelType == "class" ? fileExtension : 'ts'}`);

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

    const modelSize = fs.statSync(modelPath).size;

    console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), modelPath)} (${modelSize} bytes)`);
    if (checkTypeScript) checkTypeScriptConfigured(modelDir);

}
