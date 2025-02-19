import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile, findTemplateFile } from './utils/helpers.js';
import PromptSync from 'prompt-sync';


export function handleTemplate(fileType: string, options: any) {
    const prompt = PromptSync();
    const templateFilePath = findTemplateFile(fileType, process.cwd());

    if (templateFilePath) {
        const answer = prompt(`${fileType}-rt.template already exists. Overwrite? (y/n): `)?.trim()?.toLowerCase();
        if (answer === 'y' || answer === 'yes') {
            const templateFileSize = fs.statSync(templateFilePath).size;
            console.log(chalk.gray(`DELETE File`), `${path.relative(process.cwd(), templateFilePath)} (${templateFileSize} bytes)`);
            fs.unlinkSync(templateFilePath);
            if (fileType == 'component' || fileType == 'c') {
                createComponentTemplate(options);
            }
            else if (fileType == 'style' || fileType == 's') {
                createStyleTemplate()
            }

        } else {
            console.log(chalk.yellow(`No changes made to ${fileType}-rt.template.`));
        }
    } else {
        // Create new template file if it does not exist
        if (fileType == 'component' || fileType == 'c') {
            createComponentTemplate(options);
        }
        else if (fileType == 'style' || fileType == 's') {
            createStyleTemplate()
        }

    }
};




function createComponentTemplate(options: any) {

    const componentTemplatePath = path.join(process.cwd(), 'component-rt.template');

    // Check if  file already exists
    if (fs.existsSync(componentTemplatePath)) {
        console.log(chalk.red('Error: Component template file component-rt.template already exists.'));
        return;
    }


    // Determine file extensions based on options or config
    const configPath = findConfigFile(process.cwd()) as string;
    let fileExtension = 'jsx';  // Default to JS if no options are specified
    let styleExtension = 'css'; // Default to CSS if no options are specified
    let styleModule = options.useModuleStyle ? '.module' : ''; // Determine if style should be a module
    let componentFileFormat = options.const ? 'const' : 'function'; // Determine component type

    if (fs.existsSync(configPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            fileExtension = config.language === 'ts' ? 'tsx' : 'jsx';
            styleExtension = config.style || 'css'; // Default to CSS
            styleModule = config.useModuleStyle ? '.module' : ''; // Determine if style should be a module
            componentFileFormat = config.componentFileFormat || 'function'; // Check config for component type
        } catch (error) {
            console.warn(chalk.yellow("Warning: rt.json is broken."))
        }
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

    if ("useModuleStyle" in options && options.useModuleStyle == false) {
        styleModule = '.module';
    }
    else if (options.useModuleStyle) {
        styleModule = '.module';
    }

    if (options.function) {
        componentFileFormat = 'function';
    } else if (options.const) {
        componentFileFormat = 'const';
    }


    const indexContent = `
${styleModule ? `import styles from './_{styleFileName}_.module.${styleExtension}'`
            : `import './_{styleFileName}_.${styleExtension}'`
        };
${fileExtension == "tsx" ? `
interface _{functionName}_Props {
    
} 
    `: ''}
    ${componentFileFormat == 'const' ? `
const _{functionName}_ = ({ }${fileExtension == "tsx" ? `:_{functionName}_Props` : ''})=> {
  return (
    <p> _{componentName}_ works!</p>
  )
};

export default  _{functionName}_;
`: `
export default function  _{functionName}_ ({ }${fileExtension == "tsx" ? `: _{functionName}_Props` : ''}) {
  return (
    <p> _{componentName}_ works!</p>
  )
};
  `}`;


    fs.writeFileSync('component-rt.template', indexContent.trim());

    const componentTemplateSize = fs.statSync(componentTemplatePath).size;

    console.log(chalk.green(`CREATE COMPONENT TEMPLATE`), `${path.relative(process.cwd(), componentTemplatePath)} (${componentTemplateSize} bytes)`);
    // appendToGitignore(process.cwd(), 'component-rt.template')
}



function createStyleTemplate() {

    const styleTemplatePath = path.join(process.cwd(), 'style-rt.template');

    // Check if  file already exists
    if (fs.existsSync(styleTemplatePath)) {
        console.log(chalk.red('Error: Style template file component-rt.template already exists.'));
        return;
    }



    fs.writeFileSync('style-rt.template', '');

    const styleTemplateSize = fs.statSync(styleTemplatePath).size;

    console.log(chalk.green(`CREATE STYLE TEMPLATE`), `${path.relative(process.cwd(), styleTemplatePath)} (${styleTemplateSize} bytes)`);
    // appendToGitignore(process.cwd(), 'style-rt.template')
}

