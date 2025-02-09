import { Command } from 'commander';
import chalk from 'chalk';
import { handleTemplate } from '../../actions/template.action.js';
;
export const templateComponentCommand = () => {
    return new Command('component')
        .aliases(['c'])
        .description('Generate a component template file')
        .option('--js', 'Create a JS file explicitly')
        .option('--ts', 'Create a TS file explicitly')
        .option('--style [styleType]', 'Create a styleType file explicitly')
        .option('--function', 'Create a function component')
        .option('--const', 'Create a constant component')
        .option('--use-module-style', 'Create a style file with .module extension')
        .option('--no-use-module-style', 'Disable the use of .module extension for style files')
        .action((options) => {
        try {
            handleTemplate("component", options);
        }
        catch (error) {
            console.log(chalk.red('Error: Failed to create component template file.'));
        }
    });
};
