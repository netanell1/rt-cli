import { Command } from 'commander';
import { lint } from '../../actions/runNpmScript.action.js';
export const lintCommand = () => {
    const command = new Command('lint')
        .description('Run npm run lint')
        .action(() => {
        lint();
    });
    return command;
};
