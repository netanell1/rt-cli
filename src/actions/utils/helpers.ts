import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// print warning if ts not defined
export function checkTypeScriptConfigured(startPath: string) {
    const configPath = findConfigFile(startPath) as string
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (config.language !== 'ts') {
            console.log(chalk.yellow('Warning: TypeScript is not configured. Use `rt init --ts` to set TypeScript as the default language.'));
        }
    }
}


export function findPackageJsonFile(startPath: string) {
    let currentPath = startPath;

    while (currentPath !== path.parse(currentPath).root) {
        const configFilePath = path.join(currentPath, 'package.json');
        if (fs.existsSync(configFilePath)) {
            return configFilePath;
        }
        currentPath = path.dirname(currentPath); // Move up one directory level
    }

    return null; // Return null if not found
}

// Helper function to find rt.json in current or parent directories
export function findConfigFile(startPath: string) {
    let currentPath = startPath;

    while (currentPath !== path.parse(currentPath).root) {
        const configFilePath = path.join(currentPath, 'rt.json');
        if (fs.existsSync(configFilePath)) {
            return configFilePath;
        }
        currentPath = path.dirname(currentPath); // Move up one directory level
    }

    return null; // Return null if not found
};


export function findTemplateFile(fileType: string, startPath: string) {
    let currentPath = startPath;

    while (currentPath !== path.parse(currentPath).root) {
        const templateFilePath = path.join(currentPath, `${fileType}-rt.template`);
        if (fs.existsSync(templateFilePath)) {
            return templateFilePath;
        }
        currentPath = path.dirname(currentPath); // Move up one directory level
    }

    return null; // Return null if not found
};

// Helper function to find .gitignore in current or parent directories
export function appendToGitignore(startPath: string, entry: string) {
    let currentPath = startPath;
    let pathFolder = ''
    while (currentPath !== path.parse(currentPath).root) {
        const gitignorePath = path.join(currentPath, '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
            if (!gitignoreContent.includes(entry)) {
                fs.appendFileSync(gitignorePath, `\n${pathFolder}${entry}`);
                console.log(chalk.green(`ADDED`), `'${entry}' to ${path.relative(process.cwd(), gitignorePath)}`);
            }
            return
        }
        const foldersArr = currentPath.split('\\')
        pathFolder += `${foldersArr[foldersArr.length - 1]}/`
        currentPath = path.dirname(currentPath); // Move up one directory level
    }

    return null; // Return null if not found
};

export function replaceSpecialCharacters(str: string, toLower: boolean, allowedChars: string[] = []) {
    // Escape any special regex characters in the allowed characters array
    const escapedAllowedChars = allowedChars.map(char => `\\${char}`).join('');
    // Build a regex pattern that excludes allowed characters
    const regex = new RegExp(`[^a-zA-Z0-9${escapedAllowedChars}]`, 'g');
    let strReplace = str.replace(regex, '')
    if (toLower)
        strReplace = strReplace.toLowerCase()
    return strReplace;
}

