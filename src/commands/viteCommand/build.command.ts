import { Command } from 'commander';
import { build } from '../../runNpmScript.js';

export const buildCommand = () => {
    const command = new Command('build')
        .description('Run npm run build')
        .action(() => {
            build();
        });
    ;

    return command;
};
