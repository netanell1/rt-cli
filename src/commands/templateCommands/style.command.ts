import { Command } from 'commander';
import chalk from 'chalk';
import { handleTemplate } from '../../actions/template.js';

export const templateStyleCommand = () => {
    return new Command('style')
        .aliases(['s'])
        .description('Generate a style template file')
        .action((options) => {
            try {
                handleTemplate("style", options);
            } catch (error) {
                console.log(chalk.red('Error: Failed to create style template file.'));
            }
        });
};
