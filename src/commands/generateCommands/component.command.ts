import { Command } from 'commander';
import { createComponent } from '../../actions/generate/component.js';
import chalk from 'chalk';
;

export const generateComponentCommand = () => {
    return new Command('component')
        .aliases(['c'])
        .description('Generate a new component')
        .argument('[name]', 'The name of the component')
        .option('--js', 'Create a JS file explicitly')
        .option('--ts', 'Create a TS file explicitly')
        .option('--style [styleType]', 'Create a style file explicitly')
        .option('--use-module-style', 'Create a style file with .module extension')
        .option('--function', 'Create a function component')
        .option('--const', 'Create a constant component')
        .option('--component-file-name [name]', 'Set the name for the component file')
        .option('--style-file-name [name]', 'Set the name for the style file')
        .option('--test-library [name]', 'Set the test library for the component')
        .option('--use-suffix', 'Append a suffix to the file name based on its type')
        .option('--no-use-suffix', 'Disable adding a suffix to the file name based on its type')
        .action((name, options) => {
            if (!name) {
                console.log(chalk.red('Error: You must specify a name.'));
                process.exit(1);
            }
            try {
                createComponent(name, options);
            } catch (error) {
                console.log(chalk.red('Error: Failed to generate the component.'));
                process.exit(1);
            }
        });
};
