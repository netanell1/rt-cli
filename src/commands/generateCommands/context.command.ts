import { Command } from 'commander';
import chalk from 'chalk';
import { createContext } from '../../actions/generate/context.js';

export const generateContextCommand = () => {
    return new Command('context')
        .aliases(["co"])
        .description('Generate a new context')
        .argument('[name]', 'The name of the context')
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
                createContext(name, options);
            } catch (error) {
                console.log(chalk.red('Error: Failed to generate the context.'));
                process.exit(1);
            }
        });
};
