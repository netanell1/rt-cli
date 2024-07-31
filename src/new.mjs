import fs from 'fs';
import { execSync } from 'child_process';
import { findConfigFile } from './handler.mjs';
export function createReactApp(appName, options) {
    const configPath = findConfigFile(process.cwd());;
    let language = "ts";
    let appTemplate = "react";
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        language = config.language == "ts" ? "ts" : "js";
        appTemplate = config.appTemplate || 'react'
    }

    if (options.ts) {
        language = "ts";
    }
    if (options.appTemplate) {
        appTemplate = options.appTemplate
    }

    const command = appTemplate == "vite" ? `npm create vite@latest ${appName} -- --template react${language == "ts" ? "-ts" : ""}`
        : `npx create-react-app ${appName} ${language == "ts" ? "--template typescript" : ""}`

    execSync(command, { stdio: 'inherit' });
}