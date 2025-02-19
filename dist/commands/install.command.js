import { Command } from 'commander';
import { showTopicMenu } from '../actions/install.action.js';
export const installCommand = () => {
    const command = new Command('install')
        .aliases(['i'])
        .description('Install packages by topic')
        .action(() => {
        showTopicMenu(); // Open the menu when the install command is called
    });
    return command;
};
