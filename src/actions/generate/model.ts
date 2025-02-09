import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { checkTypeScriptConfigured, replaceSpecialCharacters } from '../utils/helpers.js';
import { handleSettingOptions } from '../utils/handleSettingOptions.js';
import { OptionsModel } from '../../models/interfaces/options.interface.js';


export function createModel(modelType: string, modelFullName: string, options: OptionsModel, checkTypeScript?: boolean) {
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

    const { fileExtension, suffix } = handleSettingOptions(options, modelDir, `.${modelType}`);

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
