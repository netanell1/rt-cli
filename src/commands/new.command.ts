import { Command } from 'commander';
import chalk from 'chalk';
import { createReactApp } from '../actions/new.js';

export const newCommand = () => {
    const command = new Command('new')
        .description('Initialize configuration file for the CLI')
        .argument('[app-name]', 'Type of the file to generate (component, class, interface, hook, etc.)')
        .option('--js', 'Create a JS file explicitly')
        .option('--ts', 'Create a TS file explicitly')
        .option('--style [styleType]', 'Create a styleType file explicitly')
        .option('--use-module-style', 'Create a style file with .module extension')
        .option('--no-use-module-style', 'Disable the use of .module extension for style files')
        .option('--function', 'Create a function component')
        .option('--const', 'Create a constant component')
        .option('--component-file-name [name]', 'Set the name for the component file')
        .option('--style-file-name [name]', 'Set the name for the style file')
        .option('--test-library [name]', 'Set the test library for the component')
        .option('--use-suffix', 'Append a suffix to the file name based on its type')
        .option('--no-use-suffix', 'Disable adding a suffix to the file name based on its type')
        .description('Create a new React application using create-react-app')
        .action((appName, options) => {
            if (!appName) {
                console.error(chalk.red(`Error: app-name missing. please try again`));
                process.exit(1);

            }
            try {
                createReactApp(appName, options);
                console.log(chalk.green(`React app ${appName} created successfully.`));
            } catch (error: any) {
                console.error(chalk.red(`Error: Failed to create React app ${appName ?? ""}.`));
            }
        });

    return command;
};
