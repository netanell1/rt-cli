import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { replaceSpecialCharacters } from '../utils/helpers.js';
import { handleSettingOptions } from '../utils/handleSettingOptions.js';
import { OptionsModel } from '../../models/interfaces/options.interface.js';


export function createHook(hookFullName: string, options: OptionsModel) {
  const folderArr = hookFullName.split(/[/\\]/);
  const folderPath = folderArr.slice(0, folderArr.length - 1).join('/');
  const hookName = folderArr[folderArr.length - 1];


  const hookNameCorrect = replaceSpecialCharacters(hookName, false)
  if (hookNameCorrect.slice(0, 3) != 'use') {
    console.log(chalk.red(`Error: Hook must start with use, try 'use${hookNameCorrect}' instead.`));
    process.exit(1);
  }
  if (hookNameCorrect != hookName) {
    console.log(chalk.red(`Error: Invalid hook name, try '${hookNameCorrect}' instead.`));
    process.exit(1);
  }
  let cwd = process.cwd()
  cwd = cwd.includes('src') || folderPath.includes('src') ? cwd : path.join(cwd, 'src')
  const hookDir = path.join(cwd, folderPath);

  if (!fs.existsSync(hookDir)) {
    fs.mkdirSync(hookDir, { recursive: true });
  }

  const { fileExtension, componentFileFormat, suffix } = handleSettingOptions(options, hookDir, ".hook");


  const hookPath = path.join(hookDir, `${hookName}${suffix}.${fileExtension}`);

  if (fs.existsSync(hookPath)) {
    console.log(chalk.red(`Error: File ${hookName} already exists.`));
    process.exit(1);
  }


  const hookContent = `import { useState, useEffect } from 'react';

${componentFileFormat == 'const' ? `
const  ${hookName} = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    console.log('Value changed:', value);
  }, [value]);

  return [value, setValue];
};

export default ${hookName};
` : `
export function ${hookName} (initialValue) {
    
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    console.log('Value changed:', value);
  }, [value]);

  return [value, setValue];
    }`}`;

  fs.writeFileSync(hookPath, hookContent.trim());

  const hookSize = fs.statSync(hookPath).size;

  console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), hookPath)} (${hookSize} bytes)`);

}
