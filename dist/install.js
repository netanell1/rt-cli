import inquirer from 'inquirer';
import { exec } from 'child_process';
import fs from 'fs';
import { findPackageJsonFile } from './handler.js';
import ora from 'ora';
import chalk from 'chalk';
const topics = {
    "Design & UI": [
        "bootstrap",
        "react-bootstrap",
        "@mui/material",
        "antd",
        "chakra-ui/react",
        "semantic-ui-react",
        "tailwindcss", // For utility-first CSS framework
        "styled-components", // For styled-components CSS-in-JS library
        "emotion" // For another CSS-in-JS library
    ],
    "API": [
        "axios",
        "@tanstack/react-query",
        "swr",
        "@apollo/client",
        "graphql", // For working with GraphQL queries
        "react-query-devtools" // For React Query DevTools
    ],
    "State Management": [
        "@reduxjs/toolkit",
        "recoil",
        "mobx",
        "zustand",
        "xstate" // For state machines and statecharts
    ],
    "Form Handling": [
        "formik",
        "react-hook-form",
        "final-form",
        "yup" // For schema validation with Formik or React Hook Form
    ],
    "Styling": [
        "styled-components",
        "emotion",
        "css-modules",
        "sass",
        "postcss", // For advanced CSS transformations and optimizations
        "autoprefixer" // For adding vendor prefixes to CSS
    ],
    "Routing": [
        "react-router-dom",
        "next",
        "react-router" // For routing in non-React apps or older versions
    ],
    "Animation": [
        "framer-motion",
        "react-spring",
        "react-transition-group",
        "gsap",
        "animejs" // For lightweight animations
    ],
    "Utilities": [
        "lodash", // For utility functions
        "date-fns", // For date manipulation
        "moment", // For date and time manipulation
        "uuid" // For generating unique IDs
    ],
    "Testing": [
        "jest", // For unit testing
        "react-testing-library", // For testing React components
        "cypress" // For end-to-end testing
    ],
    "Development": [
        "eslint", // For linting JavaScript/TypeScript
        "prettier" // For code formatting
    ]
};
// Function to get the installed packages from package.json
function getInstalledPackages() {
    const packageJsonPath = findPackageJsonFile(process.cwd());
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};
        return new Set([...Object.keys(dependencies), ...Object.keys(devDependencies)]);
    }
    catch (error) {
        // console.error('Error reading package.json:', error);
        return new Set();
    }
}
// Function to check if a package is installed
function isPackageInstalled(packageName, installedPackages) {
    return installedPackages.has(packageName);
}
// Function to install the selected package
function installPackage(packageName, callback) {
    const spinner = ora(`Installing ${packageName}...`).start();
    exec(`npm install ${packageName}`, (err, stdout, stderr) => {
        if (err) {
            spinner.fail(`Error installing ${packageName}: ${stderr}`);
            console.error(chalk.red(`Error installing ${packageName}:`, stderr));
            return;
        }
        spinner.succeed(`${packageName} successfully installed!`);
        console.log(chalk.green(stdout));
        callback(); // Return to the topic menu after installation
    });
}
// Function to show the package selection menu
function showPackageMenu(topic) {
    const installedPackages = getInstalledPackages();
    const packages = topics[topic].map(pkg => ({
        name: isPackageInstalled(pkg, installedPackages) ? `${pkg} (already installed)` : pkg,
        value: pkg,
        disabled: isPackageInstalled(pkg, installedPackages) // Disable already installed packages
    }));
    const questions = [
        {
            type: 'list',
            name: 'package',
            message: `Select a package to install from ${topic}:`,
            choices: [...packages, new inquirer.Separator(), 'Back to Main Menu', new inquirer.Separator(),], // Add a "Back to Main Menu" option
        },
    ];
    inquirer
        .prompt(questions)
        .then((answer) => {
        if (answer.package === 'Back to Main Menu') {
            returnToMainMenu();
        }
        else {
            installPackage(answer.package, () => showPackageMenu(topic)); // Return to the topic menu after installation
        }
    });
}
// Function to show the topic selection menu
function showTopicMenu() {
    const questions = [
        {
            type: 'list',
            name: 'topic',
            message: 'Select a topic:',
            choices: [...Object.keys(topics), new inquirer.Separator(), 'Exit', new inquirer.Separator()], // Add an Exit option
        },
    ];
    inquirer
        .prompt(questions)
        .then((answer) => {
        if (answer.topic === 'Exit') {
            console.log('Exiting...');
            process.exit(0); // Exit the CLI
        }
        else {
            showPackageMenu(answer.topic);
        }
    });
}
// Function to return to the main menu
function returnToMainMenu() {
    console.log('Returning to main menu...');
    showTopicMenu();
}
// Export the function for use in your CLI tool
export { showTopicMenu };
