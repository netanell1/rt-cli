import { Command } from 'commander';
import chalk from 'chalk';
import { handleTemplate } from '../actions/template.js';
export const templateCommand = () => {
    const command = new Command('template')
        .aliases(['t'])
        .description('Generate a new file of a template type')
        .argument('[type]', 'The type of the file (component, style)')
        .option('--js', 'Create a JS file explicitly')
        .option('--ts', 'Create a TS file explicitly')
        .option('--style [styleType]', 'Create a styleType file explicitly')
        .option('--use-module-style', 'Create a style file with .module extension')
        .option('--no-use-module-style', 'Disable the use of .module extension for style files')
        .option('--function', 'Create a function component')
        .option('--const', 'Create a constant component')
        .action((type, options) => {
        try {
            handleTemplate(type, options);
        }
        catch (error) {
            console.log(chalk.red('Error: Failed to create template file.'));
        }
    });
    return command;
};
