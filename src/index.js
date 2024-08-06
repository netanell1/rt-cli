#!/usr/bin/env node

import { Command } from 'commander';
import { createComponent } from './component.js';
import chalk from 'chalk';
import { checkTypeScriptConfigured, handleInit, printVersion } from './handler.js';;
import { createReactApp } from './new.js';
import updateCLI from './update.js';
import { dev, build, lint, preview } from './viteCommand.js';
import { createModel } from './model.js';

const program = new Command();



/********************************* */

// Command to create a new React application
program
  .command('new <appName>')
  .option('--ts', 'Create a TS app explicitly')
  .option('--style <styleType>', 'Create a styleType file explicitly')
  .description('Create a new React application using create-react-app')
  .action((appName, options) => {
    try {
      createReactApp(appName, options);
      console.log(chalk.green(`React app ${appName} created successfully.`));
    } catch (error) {
      console.error(chalk.red(`Failed to create React app ${appName}.`), error.message);
    }
  });

/********************************* */

// Command to initialize the configuration file
program
  .command('init')
  .description('Initialize configuration file for the CLI')
  .option('--ts', 'Set TypeScript as the default language')
  .option('--style <styleType>', 'Create a styleType file explicitly')
  .option('--moduleStyle', 'Set default style files to use .module')
  .option('--function', 'Set default component type to function')
  .option('--const', 'Set default component type to const')
  .option('--modelSuffix', 'Set suffix for the type file name as type')
  .option('--componentFileName <name>', 'Set default name for the component file')
  .option('--styleFileName <name>', 'Set default name for the style file')
  .action((options) => {
    handleInit(options);
  });

/********************************* */

// Command to update rt-cli
program
  .command('update').alias(['u'])
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
  .command('generate <type> <name>').aliases(['g'])
  .description('Generate a new file of a specified type')
  .option('--js', 'Create a JS file explicitly')
  .option('--ts', 'Create a TS file explicitly')
  .option('--style <styleType>', 'Create a styleType file explicitly')
  .option('--moduleStyle', 'Create a style file with .module extension')
  .option('--function', 'Create a function component')
  .option('--const', 'Create a constant component')
  .option('--modelSuffix', 'Set suffix for the type file name as type')
  .option('--componentFileName <name>', 'Set the name for the component file')
  .option('--styleFileName <name>', 'Set the name for the style file')
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
    else {
      console.log(chalk.red('Error: Invalid type specified.'));
      process.exit(1);
    }
  });

// Command to check version
program
  .command('version').aliases(['v'])
  .description('Show version of the CLI tool')
  .action(() => {
    printVersion()

  });




program.parse(process.argv);
