import { Command } from 'commander';
import { createModel } from '../../actions/generate/model.js';
import chalk from 'chalk';
export const generateClassCommand = () => {
    return new Command('class')
        .aliases(["cl"])
        .description('Generate a new class')
        .argument('[name]', 'The name of the class')
        .option('--js', 'Create a JS file explicitly')
        .option('--ts', 'Create a TS file explicitly')
        .option('--use-suffix', 'Append a suffix to the file name based on its type')
        .option('--no-use-suffix', 'Disable adding a suffix to the file name based on its type')
        .action((name, options) => {
        if (!name) {
            console.log(chalk.red('Error: You must specify a name.'));
            process.exit(1);
        }
        try {
            createModel('class', name, options);
        }
        catch (error) {
            console.log(chalk.red('Error: Failed to generate the class.'));
            process.exit(1);
        }
    });
};
