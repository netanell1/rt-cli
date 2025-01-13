import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findConfigFile, findTemplateFile, replaceSpecialCharacters } from './helpers.js';

export function createComponent(componentFullName: string, options: any) {
  const folderArr = componentFullName.split(/[/\\]/);
  const folderPath = folderArr.join('/')
  const componentName = folderArr[folderArr.length - 1]
  const componentDir = path.join(process.cwd(), folderPath);

  const componentNameCorrect = replaceSpecialCharacters(componentName, false)
  if (componentNameCorrect != componentName) {
    console.error(chalk.red(`Error: Invalid component name, try '${componentNameCorrect}' instead.`));
    process.exit(1);
  }

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  } else {
    console.error(chalk.red(`Error: Folder ${componentName} already exists.`));
    process.exit(1);
  }

  // Determine file extensions based on options or config
  const configPath = findConfigFile(componentDir) as string;
  let fileExtension = 'jsx';  // Default to JS if no options are specified
  let styleExtension = 'css'; // Default to CSS if no options are specified
  let styleModule = options.useModuleStyle ? '.module' : ''; // Determine if style should be a module
  let componentFileFormat = options.const ? 'const' : 'function'; // Determine component type
  let componentFileName = options.componentFileName || componentName; // Default component file name
  let styleFileName = options.styleFileName || componentName; // Default style file name
  let testLibrary = options.testLibrary || ''; // To hold the test library

  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    fileExtension = config.language === 'ts' ? 'tsx' : 'jsx';
    styleExtension = config.style || 'css'; // Default to CSS
    styleModule = config.useModuleStyle ? '.module' : ''; // Determine if style should be a module
    componentFileFormat = config.componentFileFormat || 'function'; // Check config for component type
    componentFileName = config.componentFileName || componentName; // Check config for component file name
    styleFileName = config.styleFileName || componentName; // Check config for style file name
    testLibrary = config.testLibrary || ''; // Check config for test library
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

  if (options.useModuleStyle) {
    styleModule = '.module';
  }

  if (options.function) {
    componentFileFormat = 'function';
  } else if (options.const) {
    componentFileFormat = 'const';
  }

  if (options.componentFileName) {
    componentFileName = options.componentFileName;
  }

  if (options.styleFileName) {
    styleFileName = options.styleFileName;
  }

  if (options.testLibrary) {
    testLibrary = options.testLibrary
  }

  const indexPath = path.join(componentDir, `${componentFileName}.${fileExtension}`);
  const stylePath = path.join(componentDir, `${styleFileName}${styleModule}.${styleExtension}`);
  const functionName = componentName[0].toUpperCase() + componentName.slice(1, componentName.length);

  const templateComponentPath = findTemplateFile('component', process.cwd());
  let templateComponentFile = '';
  if (templateComponentPath) {
    templateComponentFile = fs.readFileSync(templateComponentPath, 'utf-8');
    templateComponentFile = templateComponentFile
      .replace(/{{functionName}}/g, functionName)
      .replace(/{{styleFileName}}/g, styleFileName)
      .replace(/{{componentName}}/g, componentName);
  }

  const templateStylePath = findTemplateFile('style', process.cwd());
  let templateStyleFile = '';
  if (templateStylePath) {
    templateStyleFile = fs.readFileSync(templateStylePath, 'utf-8');
    templateStyleFile = templateStyleFile
      .replace(/{{functionName}}/g, functionName)
      .replace(/{{styleFileName}}/g, styleFileName)
      .replace(/{{componentName}}/g, componentName);
  }

  const indexContent = templateComponentFile ? templateComponentFile :
    `
${styleModule ? `import styles from './${styleFileName}.module.${styleExtension}'`
      : `import './${styleFileName}.${styleExtension}'`
    };
${fileExtension == "tsx" ? `
interface ${functionName}Props {

} 
    ` : ''}
    ${componentFileFormat == 'const' ? `
const ${functionName} = ({}${fileExtension == "tsx" ? `:${functionName}Props` : ''}) => {
  return (
    <p> ${componentName} works!</p>
  )
};

export default ${functionName};
` : `
export default function ${functionName} ({}${fileExtension == "tsx" ? `:${functionName}Props` : ''}) {
  return (
    <p> ${componentName} works!</p>
  )
};
  `}`;

  fs.writeFileSync(indexPath, indexContent.trim());
  fs.writeFileSync(stylePath, templateStyleFile);

  const indexSize = fs.statSync(indexPath).size;
  const styleSize = fs.statSync(stylePath).size;

  console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), indexPath)} (${indexSize} bytes)`);
  console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), stylePath)} (${styleSize} bytes)`);

  // Add logic to create test file based on the selected testLibrary
  if (testLibrary) {
    let testFilePath = path.join(componentDir, `${componentFileName}.test.${fileExtension}`);
    let testContent = '';

    if (testLibrary === 'react-testing-library' || testLibrary === 'testing-library') {
      testContent = `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${functionName} from './${componentFileName}';

describe('${functionName}', () => {
  it('should create', () => {
    render(<${functionName} />);
    const element = screen.getByTestId('${componentName}');
    expect(element).toBeTruthy();
  });
});
            `;
    } else if (testLibrary === 'cypress') {
      testFilePath = path.join(componentDir, `${componentFileName}.cy.${fileExtension}`);
      testContent = `
describe('${functionName}', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render the component', () => {
    cy.get('[data-testid="${componentName}"]').should('exist');
  });
});
            `;
    }

    // Write the test file if a test library is selected
    if (testContent) {
      fs.writeFileSync(testFilePath, testContent.trim());
      const testFileSize = fs.statSync(testFilePath).size;
      console.log(chalk.green(`CREATE`), `${path.relative(process.cwd(), testFilePath)} (${testFileSize} bytes)`);
    }
  }
}
