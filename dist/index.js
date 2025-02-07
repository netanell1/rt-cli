#!/usr/bin/env node
import { Command } from 'commander';
import { newCommand } from './commands/new.command.js';
import { initCommand } from './commands/init.command.js';
import { installCommand } from './commands/install.command.js';
import { updateCommand } from './commands/update.command.js';
import { devCommand } from './commands/viteCommand/dev.command.js';
import { buildCommand } from './commands/viteCommand/build.command.js';
import { lintCommand } from './commands/viteCommand/lint.command.js';
import { previewCommand } from './commands/viteCommand/preview.command.js';
import { generateCommand } from './commands/generate.command.js';
import { versionCommand } from './commands/version.command.js';
import { templateCommand } from './commands/template.command.js';
import { upgradeCommand } from './commands/upgrade.command.js';
const program = new Command();
/********************************* */
// Command to create a new React application
program.addCommand(newCommand());
/********************************* */
// Command to initialize the configuration file
program.addCommand(initCommand());
/********************************* */
// Command to install packages
program.addCommand(installCommand());
/********************************* */
// Command to update dependencies 
program.addCommand(updateCommand());
/********************************* */
// Command to upgrade CLI
program.addCommand(upgradeCommand());
/********************************* */
// Command to run dev
program.addCommand(devCommand());
/********************************* */
// Command to run build
program.addCommand(buildCommand());
/********************************* */
// Command to run lint
program.addCommand(lintCommand());
/********************************* */
// Command to run preview
program.addCommand(previewCommand());
/********************************* */
// Command to generate a new file
program.addCommand(generateCommand());
/********************************* */
// Command to check version
program.addCommand(versionCommand());
/********************************* */
// Command to create template file
program.addCommand(templateCommand());
program.parse(process.argv);
