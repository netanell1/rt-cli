import { Command } from 'commander';
import chalk from 'chalk';
import updateCLI from '../update.js';
export const updateCommand = () => {
    const command = new Command('update')
        .aliases(['u'])
        .description('Update the react-cli-rt to the latest version')
        .action(() => {
        try {
            updateCLI();
        }
        catch (error) {
            console.error(chalk.red("Error: Update failed."));
        }
    });
    return command;
};
