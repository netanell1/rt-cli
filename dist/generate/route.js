import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile, replaceSpecialCharacters } from '../helpers.js';
export function createRoute(routeFullName, options) {
    const folderArr = routeFullName.split(/[/\\]/);
    const folderPath = folderArr.slice(0, folderArr.length - 1).join('/');
    const routeName = folderArr[folderArr.length - 1];
    const routeNameCorrect = replaceSpecialCharacters(routeName, false);
    if (routeNameCorrect != routeName) {
        console.log(chalk.red(`Error: Invalid route name, try '${routeNameCorrect}' instead.`));
        process.exit(1);
    }
    let cwd = process.cwd();
    cwd = cwd.includes('src') || folderPath.includes('src') ? cwd : path.join(cwd, 'src');
    const routeDir = path.join(cwd, folderPath);
    if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
    }
    const configPath = findConfigFile(routeDir);
    let fileExtension = 'js';
    let suffix = "";
    let componentFileFormat = 'function';
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        fileExtension = config.language === 'ts' ? 'tsx' : 'jsx';
        componentFileFormat = config.componentFileFormat || 'function'; // Check config for component type
        suffix = config.useSuffix ? `.route` : "";
    }
    if (options.js) {
        fileExtension = 'jsx';
    }
    else if (options.ts) {
        fileExtension = 'tsx';
    }
    if ("useSuffix" in options && options.useSuffix == false) {
        suffix = ``;
    }
    else if (options.useSuffix) {
        suffix = `.route`;
    }
    if (options.function) {
        componentFileFormat = 'function';
    }
    else if (options.const) {
        componentFileFormat = 'const';
    }
    const routePath = path.join(routeDir, `${routeName}${suffix}.${fileExtension}`);
    if (fs.existsSync(routePath)) {
        console.log(chalk.red(`Error: File ${routeName} already exists.`));
        process.exit(1);
    }
    const routeUpperName = routeNameCorrect[0].toUpperCase() + routeNameCorrect.slice(1, routeNameCorrect.length) + 'Route';
    const routeContent = `
import { Route, Routes } from "react-router-dom";

${componentFileFormat == 'const' ? `
const  ${routeUpperName} = () => {
  return (
    <Routes>
      <Route path="/" element={<>home</>} />
    </Routes>
  )
};

export default ${routeUpperName};
` : `
export default function ${routeUpperName} () {
    return (
      <Routes>
        <Route path="/" element={<>home</>} />
      </Routes>
    )
  };`}`;
    fs.writeFileSync(routePath, routeContent.trim());
    const routeSize = fs.statSync(routePath).size;
    console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), routePath)} (${routeSize} bytes)`);
}
