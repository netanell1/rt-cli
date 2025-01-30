#!/usr/bin/env node

import { Command } from 'commander';
import { createComponent } from './generate/component.js';
import chalk from 'chalk';
import { printVersion } from './helpers.js';
import { createReactApp } from './new.js';
import updateCLI from './update.js';
import { dev, build, lint, preview } from './viteCommands.js';
import { createModel } from './generate/model.js';
import { showTopicMenu } from './install.js';
import { handleInit } from './init.js';
import { handleTemplate } from './template.js';
import { createHook } from './generate/hook.js';
import { createContext } from './generate/context.js';
import { createRoute } from './generate/route.js';

const program = new Command();



/********************************* */
// Command to create a new React application
program
  .command('new [appName]')
  .option('--js', 'Create a JS file explicitly')
  .option('--ts', 'Create a TS file explicitly')
  .option('--style [styleType]', 'Create a styleType file explicitly')
  .option('--useModuleStyle', 'Create a style file with .module extension')
  .option('--function', 'Create a function component')
  .option('--const', 'Create a constant component')
  .option('--componentFileName [name]', 'Set the name for the component file')
  .option('--styleFileName [name]', 'Set the name for the style file')
  .option('--testLibrary [name]', 'Set the test library for the component')
  .option('--useSuffix', 'Set suffix for the type file name as type')
  .description('Create a new React application using create-react-app')
  .action((appName, options) => {
    if (!appName) {
      console.error(chalk.red(`Error: appName missing. please try again`));
      process.exit(1);

    }
    try {
      createReactApp(appName, options);
      console.log(chalk.green(`React app ${appName} created successfully.`));
    } catch (error: any) {
      console.error(chalk.red(`Error: Failed to create React app ${appName ?? ""}.`));
    }
  });


/********************************* */
// Command to install packages
program
  .command('install').aliases(['i'])
  .description('Install packages by topic')
  .action(() => {
    showTopicMenu(); // Open the menu when the install command is called
  });


/********************************* */

// Command to initialize the configuration file
program
  .command('init')
  .description('Initialize configuration file for the CLI')
  .option('--js', 'Create a JS file explicitly')
  .option('--ts', 'Create a TS file explicitly')
  .option('--style [styleType]', 'Create a styleType file explicitly')
  .option('--useModuleStyle', 'Create a style file with .module extension')
  .option('--function', 'Create a function component')
  .option('--const', 'Create a constant component')
  .option('--componentFileName [name]', 'Set the name for the component file')
  .option('--styleFileName [name]', 'Set the name for the style file')
  .option('--testLibrary [name]', 'Set the test library for the component')
  .option('--useSuffix', 'Set suffix for the type file name as type')
  .action((options) => {
    handleInit(options);
  });

/********************************* */

// Command to update rt-cli
program
  .command('update').aliases(['u'])
  .description('Update the react-cli-rt to the latest version')
  .action(() => {
    updateCLI();
  });


/********************************* */

// Command to run dev
program
  .command('dev')
  .description('Run npm run dev')
  .action(() => {
    dev();
  });


/********************************* */

// Command to run build
program
  .command('build')
  .description('Run npm run build')
  .action(() => {
    build();
  });

/********************************* */

// Command to run lint
program
  .command('lint')
  .description('Run npm run lint')
  .action(() => {
    lint();
  });

/********************************* */

// Command to run preview
program
  .command('preview')
  .description('Run npm run preview')
  .action(() => {
    preview();
  });

/********************************* */

// Command to generate a new file
program
  .command('generate [type] [name]').aliases(['g'])
  .description('Generate a new file of a specified type')
  .option('--js', 'Create a JS file explicitly')
  .option('--ts', 'Create a TS file explicitly')
  .option('--style [styleType]', 'Create a styleType file explicitly')
  .option('--useModuleStyle', 'Create a style file with .module extension')
  .option('--function', 'Create a function component')
  .option('--const', 'Create a constant component')
  .option('--componentFileName [name]', 'Set the name for the component file')
  .option('--styleFileName [name]', 'Set the name for the style file')
  .option('--testLibrary [name]', 'Set the test library for the component')
  .option('--useSuffix', 'Set suffix for the type file name as type')
  .action((type, name, options) => {
    if (type === 'component' || type === 'c') {
      createComponent(name, options);

    }
    else if (type === 'class' || type === 'cl') {
      createModel('class', name, options);
    }
    else if (type === 'enum' || type === 'e') {
      createModel('enum', name, options, true);

    }
    else if (type === 'interface' || type === "i") {
      createModel('interface', name, options, true);
    }
    else if (type === 'hook' || type === "h") {
      createHook(name, options);
    }
    else if (type === 'context' || type === "co") {
      createContext(name, options);
    }
    else if (type === 'route' || type === "r") {
      createRoute(name, options);
    }
    else {
      console.log(chalk.red('Error: Invalid type specified.'));
      process.exit(1);
    }
  });


/********************************* */
// Command to check version
program
  .command('version').aliases(['v'])
  .description('Show version of the CLI tool')
  .action(() => {
    printVersion()

  });


/********************************* */
// Command to create template file
program
  .command('template [type]').aliases(['t'])
  .description('Generate a new file of a template type')
  .option('--js', 'Create a JS file explicitly')
  .option('--ts', 'Create a TS file explicitly')
  .option('--style [styleType]', 'Create a styleType file explicitly')
  .option('--useModuleStyle', 'Create a style file with .module extension')
  .option('--function', 'Create a function component')
  .option('--const', 'Create a constant component')
  .action((type, options) => {
    try {
      handleTemplate(type, options);
    } catch (error) {
      console.log(chalk.red('Error: Failed to create template file ', error.message));
    }

  })




program.parse(process.argv);
