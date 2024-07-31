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
    let componentType = options.const ? 'const' : 'function'; // Determine component type
    let componentFileName = options.componentFileName || componentName; // Default component file name
    let styleFileName = options.styleFileName || componentName; // Default style file name

    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        fileExtension = config.language === 'ts' ? 'tsx' : 'jsx';
        styleExtension = config.style || 'css'; // Default to CSS
        styleModule = config.moduleStyle ? '.module' : ''; // Determine if style should be a module
        componentType = config.componentType || 'function'; // Check config for component type
        componentFileName = config.componentFileName || componentName; // Check config for component file name
        styleFileName = config.styleFileName || componentName; // Check config for style file name
    }

    // Override with command line options if provided
    if (options.js) {
        fileExtension = 'jsx';
    } else if (options.ts) {
        fileExtension = 'tsx';
    }

    if (options.css) {
        styleExtension = 'css';
    } else if (options.scss) {
        styleExtension = 'scss';
    } else if (options.less) {
        styleExtension = 'less';
    } else if (options.stylus) {
        styleExtension = 'stylus';
    }

    if (options.moduleStyle) {
        styleModule = '.module';
    }

    if (options.function) {
        componentType = 'function';
    } else if (options.const) {
        componentType = 'const';
    }

    if (options.componentFileName) {
        componentFileName = options.componentFileName;
    }

    if (options.styleFileName) {
        styleFileName = options.styleFileName;
    }

    const indexPath = path.join(componentDir, `${componentFileName}.${fileExtension}`);
    const stylePath = path.join(componentDir, `${styleFileName}${styleModule}.${styleExtension}`);

    const functionName = componentName[0].toUpperCase() + componentName.slice(1, componentName.length)

    const indexContent = `
${styleModule ? `import styles from './${componentName}.module.${styleExtension}'`
            : `import './${componentName}.${styleExtension}'`
        };
${fileExtension == "tsx" ? `
interface ${componentName}Props {
    
} 
    `: ''}
    ${componentType == 'const' ? `
const ${functionName} = ({}${fileExtension == "tsx" ? `:${componentName}Props` : ''})=> {
  return (
    <p> ${componentName} works!</p>
  )
};

export default ${functionName};
`: `
export default function ${functionName} ({}${fileExtension == "tsx" ? `:${componentName}Props` : ''}) {
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
