import inquirer from 'inquirer';
import { exec } from 'child_process';
import fs from 'fs';
import { findPackageJsonFile } from './handler.js';
const topics = {
    "Design & UI": ["bootstrap", "react-bootstrap", "@mui/material", "antd", "chakra-ui/react", "semantic-ui-react"],
    "API": ["axios", "@tanstack/react-query", "swr", "@apollo/client"],
    "State Management": ["@reduxjs/toolkit", "recoil", "mobx", "zustand"],
    "Form Handling": ["formik", "react-hook-form", "final-form"],
    "Styling": ["styled-components", "emotion", "css-modules", "sass"],
    "Routing": ["react-router-dom", "next"],
    "Animation": ["framer-motion", "react-spring", "react-transition-group", "gsap"],
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
    console.log(`Installing ${packageName}...`);
    exec(`npm install ${packageName}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error installing ${packageName}:`, stderr);
            return;
        }
        console.log(`${packageName} installed successfully!`);
        console.log(stdout);
        callback(); // Return to the topic menu after installing
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
            choices: [...packages, new inquirer.Separator(), 'Back to Main Menu'], // Add a "Back to Main Menu" option
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
            choices: [...Object.keys(topics), new inquirer.Separator(), 'Exit'], // Add an Exit option
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
