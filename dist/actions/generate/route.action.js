import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { replaceSpecialCharacters } from '../utils/helpers.js';
import { handleSettingOptions } from '../utils/handleSettingOptions.js';
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
    const { fileExtension, componentFileFormat, suffix } = handleSettingOptions(options, routeDir, ".route");
    const routePath = path.join(routeDir, `${routeName}${suffix}.${fileExtension + "x"}`);
    if (fs.existsSync(routePath)) {
        console.log(chalk.red(`Error: File ${routeName} already exists.`));
        process.exit(1);
    }
    let routeUpperName = routeNameCorrect[0].toUpperCase() + routeNameCorrect.slice(1, routeNameCorrect.length);
    routeUpperName = routeUpperName.toLowerCase().includes("route") ? routeUpperName : routeUpperName + "Route";
    const routeContent = `
import { Route, Routes } from "react-router-dom";

${componentFileFormat == 'const' ? `
const ${routeUpperName} = () => {
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
