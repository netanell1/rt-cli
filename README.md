# React CLI RT

![rt_image](./rt-image.png)

**React CLI RT** is a simple and easy-to-use command-line tool designed to streamline the creation of React components and interfaces. It provides a set of commands to generate components and interfaces quickly and efficiently, offering both full command names and abbreviations for convenience.

## Installation

To install the React CLI RT globally on your system, use the following command:

```bash
npm install -g react-cli-rt
```

## Commands

### Generate Component

Create a new React component with the specified name.

- #### Full Command: `rt generate component <componentName>`
- #### Abbreviated Command: `rt g c <componentName>`

**example:**

```bash
rt generate component button
```

This command creates a folder named **button** with the component files inside it.

### Generate Class

Create a new React component with the specified name.

- #### Full Command: `rt generate class <className>`
- #### Abbreviated Command: `rt g cl <className>`

**example:**

```bash
rt generate class car
```

This command creates a class file named **car.ts** or **car.class.ts** based on your configuration in **`rt.json`**.

### Generate Interface

Create a new React component with the specified name.

- #### Full Command: `rt generate interface <interfaceName>`
- #### Abbreviated Command: `rt g i <interfaceName>`

**example:**

```bash
rt generate interface user
```

This command creates an interface file named **user.ts** or **user.interface.ts** based on your configuration in **`rt.json`**.

### Generate Enum

Create a new React component with the specified name.

- #### Full Command: `rt generate enum <enumName>`
- #### Abbreviated Command: `rt g e <enumName>`

**example:**

```bash
rt generate enum direction
```

This command creates a enum file named **direction.ts** or **direction.interface.ts** based on your configuration in **`rt.json`**.

## Initialize Configuration

Initialize a configuration file (**`rt.json`**) in the current directory to set default options.

### Command

```bash
rt init
```

This command prompts you to confirm the creation of a new **`rt.json`** file if one already exists.

## Version

Display the current version of the CLI tool with a stylized header.

### Command

```bash
rt version
rt v
```

## Create New App

Create a new React application using either Create React App (CRA) or Vite, based on your configuration in **`rt.json`**.

### Command

```bash
rt new <appName>
```

### Example

```bash
rt new my-app
```

## Configuration (rt.json)

The **`rt.json`** file allows you to customize default behavior:

- **language** : Choose between **js** or **ts** for JavaScript or TypeScript.
- **style**: Choose between **css**, **scss**, or other styling languages.
- **moduleStyle**: Boolean to determine if style files should be module-based.
- **componentFileFormat**: Choose between **function** or **const**.
- **defaultComponentName**: Default name for component files (e.g., index), If the field is empty, the file name will be determined by the component name.
- **defaultStyleName**: Default name for style files (e.g., style), If the field is empty, the file name will be determined by the component name.
- **modelSuffix**: Boolean to add _.modelName_ to the model file name (e.g., **.interface** to interfaces file).
