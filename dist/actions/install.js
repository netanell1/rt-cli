import inquirer from 'inquirer';
import { exec } from 'child_process';
import fs from 'fs';
import { findPackageJsonFile } from './utils/helpers.js';
import ora from 'ora';
import chalk from 'chalk';
// Organized package list with `isDev` key
const topics = {
    "Design & UI": [
        { name: "@mui/material", isDev: false },
        { name: "react-bootstrap", isDev: false },
        { name: "antd", isDev: false },
        { name: "chakra-ui/react", isDev: false },
        { name: "semantic-ui-react", isDev: false },
        { name: "react-icons", isDev: false }
    ],
    "Styling": [
        { name: "tailwindcss", isDev: false },
        { name: "bootstrap", isDev: false },
        { name: "sass", isDev: true },
        { name: "styled-components", isDev: false },
        { name: "emotion", isDev: false },
        { name: "css-modules", isDev: false },
        { name: "postcss", isDev: true },
        { name: "autoprefixer", isDev: true }
    ],
    "State Management": [
        { name: "@reduxjs/toolkit", isDev: false },
        { name: "zustand", isDev: false },
        { name: "recoil", isDev: false },
        { name: "xstate", isDev: false },
        { name: "mobx", isDev: false }
    ],
    "Form Handling": [
        { name: "react-hook-form", isDev: false },
        { name: "formik", isDev: false },
        { name: "yup", isDev: false },
        { name: "final-form", isDev: false }
    ],
    "API": [
        { name: "axios", isDev: false },
        { name: "@tanstack/react-query", isDev: false },
        { name: "swr", isDev: false },
        { name: "@apollo/client", isDev: false },
        { name: "graphql", isDev: false },
        { name: "react-query-devtools", isDev: true }
    ],
    "Animation": [
        { name: "framer-motion", isDev: false },
        { name: "react-transition-group", isDev: false },
        { name: "react-spring", isDev: false },
        { name: "gsap", isDev: false },
        { name: "animejs", isDev: false }
    ],
    "Routing": [
        { name: "react-router-dom", isDev: false },
        { name: "react-router", isDev: false }
    ],
    "Testing": [
        { name: "jest", isDev: true },
        { name: "react-testing-library", isDev: true },
        { name: "@testing-library/dom", isDev: true },
        { name: "cypress", isDev: false },
        { name: "@testing-library/jest-dom", isDev: true }
    ],
    "Utilities": [
        { name: "lodash", isDev: false },
        { name: "uuid", isDev: false },
        { name: "date-fns", isDev: false },
        { name: "moment", isDev: false }
    ],
    "Development": [
        { name: "eslint", isDev: true },
        { name: "prettier", isDev: true }
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
        return new Set();
    }
}
// Function to check if a package is installed
function isPackageInstalled(packageName, installedPackages) {
    return installedPackages.has(packageName);
}
// Function to install the selected package
function installPackage(packageName, isDev, callback) {
    const spinner = ora(`Installing ${packageName}...`).start();
    const command = isDev ? `npm install ${packageName} --save-dev` : `npm install ${packageName}`;
    exec(command, (err, stdout, stderr) => {
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
        name: isPackageInstalled(pkg.name, installedPackages) ? `${pkg.name} (already installed)` : pkg.name,
        value: pkg.name,
        isDev: pkg.isDev,
        disabled: isPackageInstalled(pkg.name, installedPackages) // Disable already installed packages
    }));
    const questions = [
        {
            type: 'list',
            name: 'package',
            message: `Select a package to install from ${topic}:`,
            choices: [...packages, new inquirer.Separator(), 'Back to Main Menu', new inquirer.Separator()],
        },
    ];
    inquirer
        .prompt(questions)
        .then((answer) => {
        if (answer.package === 'Back to Main Menu') {
            returnToMainMenu();
        }
        else {
            const selectedPackage = packages.find(pkg => pkg.value === answer.package);
            installPackage(selectedPackage.value, selectedPackage.isDev, () => showPackageMenu(topic)); // Return to the topic menu after installation
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
            choices: [...Object.keys(topics), new inquirer.Separator(), 'Exit', new inquirer.Separator()],
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
