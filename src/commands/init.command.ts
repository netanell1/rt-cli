import { Command } from 'commander';
import { handleInit } from '../init.js';

export const initCommand = () => {
    const command = new Command('init')
        .description('Initialize configuration file for the CLI')
        .option('--ts', 'Create a TS file explicitly')
        .option('--style [styleType]', 'Create a styleType file explicitly')
        .option('--use-module-style', 'Create a style file with .module extension')
        .option('--no-use-module-style', 'Disable the use of .module extension for style files')
        .option('--function', 'Create a function component')
        .option('--const', 'Create a constant component')
        .option('--component-file-name [name]', 'Set the name for the component file')
        .option('--style-file-name [name]', 'Set the name for the style file')
        .option('--test-library [name]', 'Set the test library for the component')
        .option('--use-suffix', 'Append a suffix to the file name based on its type')
        .option('--no-use-suffix', 'Disable adding a suffix to the file name based on its type')
        .action((options) => {
            handleInit(options);
        });

    return command;
};
