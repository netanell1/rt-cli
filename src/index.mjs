#!/usr/bin/env node

import { Command } from 'commander';
import { createComponent } from './component.mjs';
import { initConfig } from './init.mjs';
import { createInterface } from './interface.mjs';
import chalk from 'chalk';
import fs from 'fs';
import { createClass } from './class.mjs';
import { checkTypeScriptConfigured, findConfigFile, printVersion } from './handler.mjs';
import PromptSync from 'prompt-sync';
import { createEnum } from './enum.mjs';
import { createReactApp } from './new.mjs';

const program = new Command();
const prompt = PromptSync();

function handleInit(options) {
  const configFilePath = findConfigFile(process.cwd());

  if (configFilePath) {
    const answer = prompt('rt.json already exists. Overwrite? (y/n): ').trim().toLowerCase();

    if (answer === 'y' || answer === 'yes') {
      fs.unlinkSync(configFilePath);
      initConfig(options); // Create new rt.json file
    } else {
      console.log(chalk.yellow('No changes made to rt.json.'));
    }
  } else {
    initConfig(options); // Create new rt.json file if it does not exist
  }
};



// Command to create a new React application
program
  .command('new <appName>')
  .option('--ts', 'Create a TS app explicitly')
  .option('--appTemplate <name>', 'Set default app template for new app')
  .description('Create a new React application using create-react-app')
  .action((appName, options) => {
    try {
      console.log(chalk.blue(`Creating a new React app: ${appName}`));
      createReactApp(appName, options);
      console.log(chalk.green(`React app ${appName} created successfully.`));
    } catch (error) {
      console.error(chalk.red(`Failed to create React app ${appName}.`), error.message);
    }
  });

// Command to initialize the configuration file
program
  .command('init')
  .description('Initialize configuration file for the CLI')
  .option('--ts', 'Set TypeScript as the default language')
  .option('--scss', 'Set SCSS as the default style language')
  .option('--less', 'Set Less as the default style language')
  .option('--stylus', 'Set Stylus as the default style language')
  .option('--moduleStyle', 'Set default style files to use .module')
  .option('--function', 'Set default component type to function')
  .option('--const', 'Set default component type to const')
  .option('--modelSuffix', 'Set suffix for the type file name as type')
  .option('--componentFileName <name>', 'Set default name for the component file')
  .option('--styleFileName <name>', 'Set default name for the style file')
  .option('--appTemplate <name>', 'Set default app template for new app')
  .action((options) => {
    handleInit(options);
  });

// Command to generate a new component
program
  .command('generate <type> <name>')
  .description('Generate a new file of a specified type')
  .option('--js', 'Create a JS file explicitly')
  .option('--ts', 'Create a TS file explicitly')
  .option('--css', 'Create a CSS file explicitly')
  .option('--scss', 'Create an SCSS file explicitly')
  .option('--less', 'Create a Less file explicitly')
  .option('--stylus', 'Create a Stylus file explicitly')
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
      createClass(name, options);
    }
    else if (type === 'enum' || type === 'e') {
      createEnum(name, options);
      checkTypeScriptConfigured();
    }
    else if (type === 'interface' || type === "i") {
      createInterface(name, options)
      checkTypeScriptConfigured();
    }
    else {
      console.log(chalk.red('Error: Invalid type specified.'));
      process.exit(1);
    }
  });

// Short form: rt g <type> <name>
program
  .command('g <type> <name>')
  .description('Generate a new file of a specified type')
  .option('--js', 'Create a JS file explicitly')
  .option('--ts', 'Create a TS file explicitly')
  .option('--css', 'Create a CSS file explicitly')
  .option('--scss', 'Create an SCSS file explicitly')
  .option('--less', 'Create a Less file explicitly')
  .option('--stylus', 'Create a Stylus file explicitly')
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
      createClass(name, options);
    }
    else if (type === 'enum' || type === 'e') {
      createEnum(name, options);
      checkTypeScriptConfigured();
    }
    else if (type === 'interface' || type === "i") {
      createInterface(name, options)
      checkTypeScriptConfigured();
    }
    else {
      console.log(chalk.red('Error: Invalid type specified.'));
      process.exit(1);
    }
  });

program
  .command('version')
  .description('Show version of the CLI tool')
  .action(() => {
    printVersion()

  });

program
  .command('v')
  .description('Show version of the CLI tool')
  .action(() => {
    printVersion()

  });



program.parse(process.argv);
