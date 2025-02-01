import { Command } from 'commander';
import { build } from '../runNpmScript.js';
import { printVersion } from '../helpers.js';

export const versionCommand = () => {
    const command = new Command('version')
        .aliases(['v'])
        .description('Show version of the CLI tool')
        .action(() => {
            printVersion()

        });

    return command;
};
