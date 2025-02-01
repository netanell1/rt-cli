import { Command } from 'commander';
import chalk from 'chalk';
import { createReactApp } from '../actions/new.js';
import { showTopicMenu } from '../actions/install.js';

export const installCommand = () => {
    const command = new Command('install')
        .aliases(['i'])
        .description('Install packages by topic')
        .action(() => {
            showTopicMenu(); // Open the menu when the install command is called
        })

    return command;
};
