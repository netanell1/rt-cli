import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findTemplateFile, replaceSpecialCharacters } from '../utils/helpers.js';
import { OptionsModel } from '../../models/interfaces/options.interface.js';
import { handleSettingOptions } from '../utils/handleSettingOptions.js';

export function createComponent(componentFullName: string, options: OptionsModel) {
  const folderArr = componentFullName.split(/[/\\]/);
  const folderPath = folderArr.join('/')
  const componentName = folderArr[folderArr.length - 1]
  let cwd = process.cwd()
  cwd = cwd.includes('src') || folderPath.includes('src') ? cwd : path.join(cwd, 'src')
  const componentDir = path.join(cwd, folderPath);

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

  const { fileExtension, styleExtension, styleModule, componentFileFormat, componentFileName, styleFileName, testLibrary } = handleSettingOptions(options, componentDir, "", componentName);

  const indexPath = path.join(componentDir, `${componentFileName}.${fileExtension + "x"}`);
  const stylePath = path.join(componentDir, `${styleFileName}${styleModule}.${styleExtension}`);
  const functionName = componentName[0].toUpperCase() + componentName.slice(1, componentName.length);

  const templateComponentPath = findTemplateFile('component', process.cwd());
  let templateComponentFile = '';
  if (templateComponentPath) {
    templateComponentFile = fs.readFileSync(templateComponentPath, 'utf-8');
    templateComponentFile = templateComponentFile.replace(/_\{\s*(functionName|styleFileName|componentName)\s*\}_/g,
      (match, p1) => {
        switch (p1) {
          case 'functionName':
            return functionName;
          case 'styleFileName':
            return styleFileName;
          case 'componentName':
            return componentName;
          default:
            return match;
        }
      });
  }

  const templateStylePath = findTemplateFile('style', process.cwd());
  let templateStyleFile = '';
  if (templateStylePath) {
    templateStyleFile = fs.readFileSync(templateStylePath, 'utf-8');
    templateStyleFile = templateStyleFile.replace(/_\{\s*(functionName|styleFileName|componentName)\s*\}_/g,
      (match, p1) => {
        switch (p1) {
          case 'functionName':
            return functionName;
          case 'styleFileName':
            return styleFileName;
          case 'componentName':
            return componentName;
          default:
            return match;
        }
      });
  }

  const indexContent = templateComponentFile ? templateComponentFile :
    `
${styleModule ? `import styles from './${styleFileName}.module.${styleExtension}'`
      : `import './${styleFileName}.${styleExtension}'`
    };
${fileExtension == "ts" ? `
interface ${functionName}Props {

} 
    ` : ''}
    ${componentFileFormat == 'const' ? `
const ${functionName} = ({ }${fileExtension == "ts" ? `:${functionName}Props` : ''}) => {
  return (
    <p> ${componentName} works!</p>
  )
};

export default ${functionName};
` : `
export default function ${functionName} ({ }${fileExtension == "ts" ? `:${functionName}Props` : ''}) {
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
    createTestFile(componentDir, componentFileName, componentName, functionName, fileExtension, testLibrary);
  }
}

function createTestFile(componentDir: string, componentFileName: string, componentName: string, functionName: string, fileExtension: string, testLibrary: string) {
  let testFilePath = path.join(componentDir, `${componentFileName}.test.${fileExtension + "x"}`);
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
    testFilePath = path.join(componentDir, `${componentFileName}.cy.${fileExtension + "x"}`);
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
