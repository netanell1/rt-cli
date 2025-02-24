import { Command } from 'commander';
import { preview } from '../../actions/runNpmScript.action.js';
export const previewCommand = () => {
    const command = new Command('preview')
        .description('Run npm run preview')
        .action(() => {
        preview();
    });
    ;
    return command;
};
