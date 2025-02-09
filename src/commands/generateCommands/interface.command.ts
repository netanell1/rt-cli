import { Command } from 'commander';
import { createModel } from '../../actions/generate/model.action.js';
import chalk from 'chalk';

export const generateInterfaceCommand = () => {
    return new Command('interface')
        .aliases(["i"])
        .description('Generate a new interface')
        .argument('[name]', 'The name of the interface')
        .option('--use-suffix', 'Append a suffix to the file name based on its type')
        .option('--no-use-suffix', 'Disable adding a suffix to the file name based on its type')
        .action((name, options) => {
            if (!name) {
                console.log(chalk.red('Error: You must specify a name.'));
                process.exit(1);
            }
            try {
                createModel('interface', name, options, true);
            } catch (error) {
                console.log(chalk.red('Error: Failed to generate the interface.'));
                process.exit(1);
            }
        });
};
