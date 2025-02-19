import { Command } from 'commander';
import chalk from 'chalk';
import { createRoute } from '../../actions/generate/route.action.js';

export const generateRouteCommand = () => {
    return new Command('route')
        .aliases(["r"])
        .description('Generate a new route')
        .argument('[name]', 'The name of the route')
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
                createRoute(name, options);
            } catch (error) {
                console.log(chalk.red('Error: Failed to generate the route.'));
                process.exit(1);
            }
        });
};
