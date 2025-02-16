import { Command } from 'commander';
import chalk from 'chalk';
import { updateDependencies } from '../actions/update.js';

export const updateCommand = () => {
    const command = new Command('update')
        // .aliases(['upd'])
        .description('Update the react-cli-rt to the latest version')
        .action(() => {
            try {
                updateDependencies();
            } catch (error) {
                console.error(chalk.red("Error: Update failed."));
            }

        });

    return command;
};
