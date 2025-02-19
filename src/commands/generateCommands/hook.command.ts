import { Command } from 'commander';
import chalk from 'chalk';
import { createHook } from '../../actions/generate/hook.action.js';

export const generateHookCommand = () => {
    return new Command('hook')
        .aliases(["h"])
        .description('Generate a new hook')
        .argument('[name]', 'The name of the hook')
        .option('--js', 'Create a JS file explicitly')
        .option('--ts', 'Create a TS file explicitly')
        .option('--function', 'Create a function component')
        .option('--const', 'Create a constant component')
        .option('--use-suffix', 'Append a suffix to the file name based on its type')
        .option('--no-use-suffix', 'Disable adding a suffix to the file name based on its type')
        .action((name, options) => {
            if (!name) {
                console.log(chalk.red('Error: You must specify a name.'));
                process.exit(1);
            }
            try {
                createHook(name, options);
            } catch (error) {
                console.log(chalk.red('Error: Failed to generate the hook.'));
                process.exit(1);
            }
        });
};
