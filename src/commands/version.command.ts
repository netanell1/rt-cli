import { Command } from 'commander';
import { printVersion } from '../actions/utils/helpers.js';

export const versionCommand = () => {
    const command = new Command('version')
        .aliases(['v'])
        .description('Show version of the CLI tool')
        .action(() => {
            printVersion()

        });

    return command;
};
