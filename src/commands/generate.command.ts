import { Command } from 'commander';
import { createComponent } from '../actions/generate/component.action.js';
import { createModel } from '../actions/generate/model.action.js';
import { createHook } from '../actions/generate/hook.action.js';
import { createContext } from '../actions/generate/context.action.js';
import { createRoute } from '../actions/generate/route.action.js';
import chalk from 'chalk';
import { generateComponentCommand } from './generateCommands/component.command.js';
import { generateClassCommand } from './generateCommands/class.command.js';
import { generateInterfaceCommand } from './generateCommands/interface.command.js';
import { generateEnumCommand } from './generateCommands/enum.command.js';
import { generateHookCommand } from './generateCommands/hook.command.js';
import { generateRouteCommand } from './generateCommands/route.command.js';
import { generateContextCommand } from './generateCommands/context.command.js';


export const generateCommand = () => {
    const command = new Command('generate')
        .aliases(['g'])
        .description('Generate a new file of a specified type');

    command.addCommand(generateComponentCommand());
    command.addCommand(generateClassCommand());
    command.addCommand(generateInterfaceCommand());
    command.addCommand(generateEnumCommand());
    command.addCommand(generateHookCommand());
    command.addCommand(generateContextCommand());
    command.addCommand(generateRouteCommand());


    return command;
};



// export const generateCommand2 = () => {
//     const command = new Command('generate')
//         .alias('g')
//         .description('Generate a new file of a specified type')
//         .argument('[type]', 'Type of the file to generate (component, class, interface, hook, etc.)')
//         .argument('[name]', 'The name of the file')
//         .option('--js', 'Create a JS file explicitly')
//         .option('--ts', 'Create a TS file explicitly')
//         .option('--style [styleType]', 'Create a styleType file explicitly')
//         .option('--use-module-style', 'Create a style file with .module extension')
//         .option('--no-use-module-style', 'Disable the use of .module extension for style files')
//         .option('--function', 'Create a function component')
//         .option('--const', 'Create a constant component')
//         .option('--component-file-name [name]', 'Set the name for the component file')
//         .option('--style-file-name [name]', 'Set the name for the style file')
//         .option('--test-library [name]', 'Set the test library for the component')
//         .option('--use-suffix', 'Append a suffix to the file name based on its type')
//         .option('--no-use-suffix', 'Disable adding a suffix to the file name based on its type')
//         .action((type, name, options) => {
//             if (!name) {
//                 console.log(chalk.red('Error: You must specify a name.'));
//                 process.exit(1);
//             }

//             switch (type) {
//                 case 'component':
//                 case 'c':
//                     try {
//                         createComponent(name, options);
//                     } catch (error) {
//                         console.log(chalk.red('Error: Failed to generate the component.'));
//                         process.exit(1);
//                     }
//                     break;

//                 case 'class':
//                 case 'cl':
//                     try {
//                         createModel('class', name, options);
//                     } catch (error) {
//                         console.log(chalk.red('Error: Failed to generate the class.'));
//                         process.exit(1);
//                     }
//                     break;

//                 case 'interface':
//                 case 'i':
//                     try {
//                         createModel('interface', name, options, true);
//                     } catch (error) {
//                         console.log(chalk.red('Error: Failed to generate the interface.'));
//                         process.exit(1);
//                     }
//                     break;

//                 case 'enum':
//                 case 'e':
//                     try {
//                         createModel('enum', name, options, true);
//                     } catch (error) {
//                         console.log(chalk.red('Error: Failed to generate the enum.'));
//                         process.exit(1);
//                     }
//                     break;

//                 case 'hook':
//                 case 'h':
//                     try {
//                         createHook(name, options);
//                     } catch (error) {
//                         console.log(chalk.red('Error: Failed to generate the hook.'));
//                         process.exit(1);
//                     }
//                     break;

//                 case 'context':
//                 case 'co':
//                     try {
//                         createContext(name, options);
//                     } catch (error) {
//                         console.log(chalk.red('Error: Failed to generate the context.'));
//                         process.exit(1);
//                     }
//                     break;

//                 case 'route':
//                 case 'r':
//                     try {
//                         createRoute(name, options);
//                     } catch (error) {
//                         console.log(chalk.red('Error: Failed to generate the route.'));
//                         process.exit(1);
//                     }
//                     break;

//                 default:
//                     console.log(chalk.red('Error: Invalid type specified.'));
//                     process.exit(1);
//             }
//         });

//     return command;
// };
