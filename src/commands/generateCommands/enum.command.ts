import { Command } from 'commander';
import { createModel } from '../../actions/generate/model.action.js';
import chalk from 'chalk';

export const generateEnumCommand = () => {
    return new Command('enum')
        .aliases(["e"])
        .description('Generate a new enum')
        .argument('[name]', 'The name of the enum')
        .option('--use-suffix', 'Append a suffix to the file name based on its type')
        .option('--no-use-suffix', 'Disable adding a suffix to the file name based on its type')
        .action((name, options) => {
            if (!name) {
                console.log(chalk.red('Error: You must specify a name.'));
                process.exit(1);
            }
            try {
                createModel('enum', name, options, true);
            } catch (error) {
                console.log(chalk.red('Error: Failed to generate the enum.'));
                process.exit(1);
            }
        });
};
