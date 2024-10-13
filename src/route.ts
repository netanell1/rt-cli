import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile, replaceSpecialCharacters } from './helpers.js';


export function createRoute(routeFullName: string, options: any) {
    const folderArr = routeFullName.split('/');
    const folderPath = folderArr.slice(0, folderArr.length - 1).join('/');
    const routeName = folderArr[folderArr.length - 1];


    const routeNameCorrect = replaceSpecialCharacters(routeName, false)
    if (routeNameCorrect != routeName) {
        console.log(chalk.red(`Error: Invalid route name, try '${routeNameCorrect}' instead.`));
        process.exit(1);
    }

    const routeDir = path.join(process.cwd(), folderPath);

    if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
    }


    const configPath = findConfigFile(routeDir) as string;
    let fileExtension = 'js';
    let suffix = "";
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        fileExtension = config.language === 'ts' ? 'tsx' : 'jsx';
        suffix = config.useSuffix ? `.route` : "";
    }

    if (options.js) {
        fileExtension = 'jsx';
    } else if (options.ts) {
        fileExtension = 'tsx';
    }

    if (options.useSuffix) {
        suffix = `.route`;
    }

    const routePath = path.join(routeDir, `${routeName}${suffix}.${fileExtension}`);

    if (fs.existsSync(routePath)) {
        console.log(chalk.red(`Error: File ${routeName} already exists.`));
        process.exit(1);
    }

    const routeUpperName = routeNameCorrect[0].toUpperCase() + routeNameCorrect.slice(1, routeNameCorrect.length) + 'route'

    const routeContent = `import { createroute } from 'react'
${fileExtension == 'ts' ? `
interface ${routeUpperName}Model {
 
}
    ` : ''}
export const ${routeUpperName} = createroute${fileExtension == 'ts' ? `<${routeUpperName}Model>` : ''}(null)
    `;

    fs.writeFileSync(routePath, routeContent.trim());

    const routeSize = fs.statSync(routePath).size;

    console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), routePath)} (${routeSize} bytes)`);

}
