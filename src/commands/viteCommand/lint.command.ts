import { Command } from 'commander';
import { lint } from '../../actions/runNpmScript.js';

export const lintCommand = () => {
    const command = new Command('lint')
        .description('Run npm run lint')
        .action(() => {
            lint();
        })

    return command;
};
