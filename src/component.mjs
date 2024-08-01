import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile } from './handler.mjs';

export function createComponent(componentFullName, options) {
    const folderArr = componentFullName.split('/');
    const folderPath = folderArr.join('/')
    const componentName = folderArr[folderArr.length - 1]
    const componentDir = path.join(process.cwd(), folderPath);

    if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir, { recursive: true });
    }
    else {
        console.log(chalk.red(`Error: Folder ${componentName} already exists.`));
        process.exit(1);
    }

    // Determine file extensions based on options or config
    const configPath = findConfigFile(process.cwd());
    let fileExtension = 'jsx';  // Default to JS if no options are specified
    let styleExtension = 'css'; // Default to CSS if no options are specified
    let styleModule = options.moduleStyle ? '.module' : ''; // Determine if style should be a module
    let componentFileFormat = options.const ? 'const' : 'function'; // Determine component type
    let defaultComponentName = options.defaultComponentName || componentName; // Default component file name
    let defaultStyleName = options.defaultStyleName || componentName; // Default style file name

    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        fileExtension = config.language === 'ts' ? 'tsx' : 'jsx';
        styleExtension = config.style || 'css'; // Default to CSS
        styleModule = config.moduleStyle ? '.module' : ''; // Determine if style should be a module
        componentFileFormat = config.componentFileFormat || 'function'; // Check config for component type
        defaultComponentName = config.defaultComponentName || componentName; // Check config for component file name
        defaultStyleName = config.defaultStyleName || componentName; // Check config for style file name
    }

    // Override with command line options if provided
    if (options.js) {
        fileExtension = 'jsx';
    } else if (options.ts) {
        fileExtension = 'tsx';
    }

    if (options.style) {
        styleExtension = options.style;
    }

    if (options.moduleStyle) {
        styleModule = '.module';
    }

    if (options.function) {
        componentFileFormat = 'function';
    } else if (options.const) {
        componentFileFormat = 'const';
    }

    if (options.defaultComponentName) {
        defaultComponentName = options.defaultComponentName;
    }

    if (options.defaultStyleName) {
        defaultStyleName = options.defaultStyleName;
    }

    const indexPath = path.join(componentDir, `${defaultComponentName}.${fileExtension}`);
    const stylePath = path.join(componentDir, `${defaultStyleName}${styleModule}.${styleExtension}`);

    const functionName = componentName[0].toUpperCase() + componentName.slice(1, componentName.length)

    const indexContent = `
${styleModule ? `import styles from './${defaultStyleName}.module.${styleExtension}'`
            : `import './${defaultStyleName}.${styleExtension}'`
        };
${fileExtension == "tsx" ? `
interface ${functionName}Props {
    
} 
    `: ''}
    ${componentFileFormat == 'const' ? `
const ${functionName} = ({}${fileExtension == "tsx" ? `:${functionName}Props` : ''})=> {
  return (
    <p> ${componentName} works!</p>
  )
};

export default ${functionName};
`: `
export default function ${functionName} ({}${fileExtension == "tsx" ? `:${functionName}Props` : ''}) {
  return (
    <p> ${componentName} works!</p>
  )
};
  `}`;

    //     const styleContent = 
    // .${componentName.toLowerCase()} {
    //   /* Add your styles here */
    // }
    //   `;

    fs.writeFileSync(indexPath, indexContent.trim());
    fs.writeFileSync(stylePath, '');

    console.log(chalk.green(`Component ${componentName} created successfully at ${componentDir}.`));
}
