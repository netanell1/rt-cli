import { Command } from 'commander';
import chalk from 'chalk';
import { upgradeCLI } from '../actions/upgrade.js';

export const upgradeCommand = () => {
    const command = new Command('upgrade')
        .aliases(['upg'])
        .description('Update the react-cli-rt to the latest version')
        .action(() => {
            try {
                upgradeCLI();
            } catch (error) {
                console.error(chalk.red("Error: Update failed."));
            }

        });

    return command;
};
