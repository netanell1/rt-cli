import { Command } from 'commander';
import { build } from '../../actions/runNpmScript.action.js';
export const buildCommand = () => {
    const command = new Command('build')
        .description('Run npm run build')
        .action(() => {
        build();
    });
    ;
    return command;
};
