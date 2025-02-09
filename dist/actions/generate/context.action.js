import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { replaceSpecialCharacters } from '../utils/helpers.js';
import { handleSettingOptions } from '../utils/handleSettingOptions.js';
export function createContext(contextFullName, options) {
    const folderArr = contextFullName.split(/[/\\]/);
    const folderPath = folderArr.slice(0, folderArr.length - 1).join('/');
    const contextName = folderArr[folderArr.length - 1];
    const contextNameCorrect = replaceSpecialCharacters(contextName, false);
    if (contextNameCorrect != contextName) {
        console.log(chalk.red(`Error: Invalid context name, try '${contextNameCorrect}' instead.`));
        process.exit(1);
    }
    let cwd = process.cwd();
    cwd = cwd.includes('src') || folderPath.includes('src') ? cwd : path.join(cwd, 'src');
    const contextDir = path.join(cwd, folderPath);
    if (!fs.existsSync(contextDir)) {
        fs.mkdirSync(contextDir, { recursive: true });
    }
    const { fileExtension, suffix } = handleSettingOptions(options, contextDir, '.context');
    const contextPath = path.join(contextDir, `${contextName}${suffix}.${fileExtension}`);
    if (fs.existsSync(contextPath)) {
        console.log(chalk.red(`Error: File ${contextName} already exists.`));
        process.exit(1);
    }
    const contextUpperName = contextNameCorrect[0].toUpperCase() + contextNameCorrect.slice(1, contextNameCorrect.length) + 'Context';
    const contextContent = `import { createContext } from 'react'
${fileExtension == 'ts' ? `
interface ${contextUpperName}Model {
 
}
    ` : ''}
export const ${contextUpperName} = createContext${fileExtension == 'ts' ? `<${contextUpperName}Model>` : ''}(null)
    `;
    fs.writeFileSync(contextPath, contextContent.trim());
    const contextSize = fs.statSync(contextPath).size;
    console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), contextPath)} (${contextSize} bytes)`);
}
