import { Command } from 'commander';
import { dev } from '../../actions/runNpmScript.action.js';

export const devCommand = () => {
    const command = new Command('dev')
        .description('Run npm run dev')
        .action(() => {
            dev();
        });

    return command;
};
