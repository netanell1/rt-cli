import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { appendToGitignore, findConfigFile } from './handler.js';

export function createComponentTemplate(options) {

    const componentTemplatePath = path.join(process.cwd(), 'component-rt.template');

    // Check if  file already exists
    if (fs.existsSync(componentTemplatePath)) {
        console.log(chalk.red('Error: Component template file component-rt.template already exists.'));
        return;
    }


    // Determine file extensions based on options or config
    const configPath = findConfigFile(process.cwd());
    let fileExtension = 'jsx';  // Default to JS if no options are specified
    let styleExtension = 'css'; // Default to CSS if no options are specified
    let styleModule = options.moduleStyle ? '.module' : ''; // Determine if style should be a module
    let componentFileFormat = options.const ? 'const' : 'function'; // Determine component type

    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        fileExtension = config.language === 'ts' ? 'tsx' : 'jsx';
        styleExtension = config.style || 'css'; // Default to CSS
        styleModule = config.moduleStyle ? '.module' : ''; // Determine if style should be a module
        componentFileFormat = config.componentFileFormat || 'function'; // Check config for component type
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






    const indexContent = `
${styleModule ? `import styles from './{{styleFileName}}.module.${styleExtension}'`
            : `import './{{styleFileName}}.${styleExtension}'`
        };
${fileExtension == "tsx" ? `
interface {{functionName}}Props {
    
} 
    `: ''}
    ${componentFileFormat == 'const' ? `
const {{functionName}} = ({}${fileExtension == "tsx" ? `:{{functionName}}Props` : ''})=> {
  return (
    <p> {{componentName}} works!</p>
  )
};

export default  {{functionName}};
`: `
export default function  {{functionName}} ({}${fileExtension == "tsx" ? `: {{functionName}}Props` : ''}) {
  return (
    <p> {{componentName}} works!</p>
  )
};
  `}`;



    fs.writeFileSync('component-rt.template', indexContent.trim());

    const componentTemplateSize = fs.statSync(componentTemplatePath).size;

    console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), componentTemplatePath)} (${componentTemplateSize} bytes)`);
    appendToGitignore(process.cwd(), 'component-rt.template')
}



export function createStyleTemplate() {

    const styleTemplatePath = path.join(process.cwd(), 'style-rt.template');

    // Check if  file already exists
    if (fs.existsSync(styleTemplatePath)) {
        console.log(chalk.red('Error: Style template file component-rt.template already exists.'));
        return;
    }



    fs.writeFileSync('style-rt.template', '');

    const styleTemplateSize = fs.statSync(styleTemplatePath).size;

    console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), styleTemplatePath)} (${styleTemplateSize} bytes)`);
    appendToGitignore(process.cwd(), 'style-rt.template')
}

