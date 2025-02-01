import { Command } from 'commander';
import { dev } from '../../actions/runNpmScript.js';

export const devCommand = () => {
    const command = new Command('dev')
        .description('Run npm run dev')
        .action(() => {
            dev();
        });

    return command;
};
