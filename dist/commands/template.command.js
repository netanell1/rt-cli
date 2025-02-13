import { Command } from 'commander';
import { templateComponentCommand } from './templateCommands/component.command.js';
import { templateStyleCommand } from './templateCommands/style.command.js';
export const templateCommand = () => {
    const command = new Command('template')
        .aliases(['t'])
        .description('Generate a new file of a template type');
    command.addCommand(templateComponentCommand());
    command.addCommand(templateStyleCommand());
    return command;
};
