# React CLI RT

![rt_image](https://res.cloudinary.com/dao8x5rkh/image/upload/v1722766206/react-cli-rt/ilq6pzincdpgv4gcmdiu.png)

**React CLI RT** is a simple and easy-to-use command-line tool designed to streamline the creation of React components and interfaces. It provides a set of commands to generate components and interfaces quickly and efficiently, offering both full command names and abbreviations for convenience.

All you have to do is download it once globally, and you'll have built-in commands for both React and Vite apps.

## Installation

To install the React CLI RT globally on your system, use the following command:

```bash
npm install -g react-cli-rt
```

## Generate commands

### Generate Component

Create a new React component with the specified name.

- #### Full Command: `rt generate component <componentName>`
- #### Abbreviated Command: `rt g c <componentName>`

**example:**

```bash
rt generate component card
```

This command creates a folder named **card** with the component files inside it (`tsx` or `jsx` file, a style ile and and a test file - based on your configuration in **`rt.json`**.).

### Generate Class

Create a new React component with the specified name.

- #### Full Command: `rt generate class <className>`
- #### Abbreviated Command: `rt g cl <className>`

**example:**

```bash
rt generate class car
```

This command creates a class file named **car.js** or **car.class.js** based on your configuration in **`rt.json`**.

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

This command creates a enum file named **direction.ts** or **direction.enum.ts** based on your configuration in **`rt.json`**.

### Generate Hook

Create a new React hook with the specified name.

- #### Full Command: `rt generate hook <hookName>`
- #### Abbreviated Command: `rt g h <hookName>`

**example:**

```bash
rt generate hook useFetch
```

This command creates a hook file named **useFetch.js** or **useFetch.hook.js** based on your configuration in **`rt.json`**.

### Generate Context

Create a new React context with the specified name.

- #### Full Command: `rt generate context <contextName>`
- #### Abbreviated Command: `rt g co <contextName>`

**example:**

```bash
rt generate context theme
```

This command creates a context file named **theme.js** or **theme.context.js** based on your configuration in **`rt.json`**.

### Generate Route

Create a new react-router-dom route with the specified name.

- #### Full Command: `rt generate route <routeName>`
- #### Abbreviated Command: `rt g r <routeName>`

**example:**

```bash
rt generate route app
```

This command creates a context file named **app.js** or **app.route.js** based on your configuration in **`rt.json`**.

## Initialize Configuration

Initialize a configuration file (**`rt.json`**) in the current directory to set default options.

### Command

```bash
rt init
```

This command prompts you to confirm the creation of a new **`rt.json`** file if one already exists.

## Create New App

Create a new React application using **Vite**, and automatic change of the type of style in the files, based on your configuration in **`rt.json`**.

### Command

```bash
rt new <appName>
```

### Example

```bash
rt new my-app
```

## Update

Update the `react-cli-rt` to the latest version from npm.

### Command

```bash
rt update
```

or

```bash
rt u
```

## Version

Display the current version of the CLI tool with a stylized header.

### Command

```bash
rt version
```

**or**

```bash
rt v
```

## Vite Commands

### Dev

Run the development server using the `npm run dev` script.

#### Command:

```bash
rt dev
```

### Build

Build the project for production using the `npm run build` script.

#### Command:

```bash
rt build
```

### Lint

Lint the project using the npm run lint script.

#### Command:

```bash
rt lint
```

### Preview

Preview the production build using the `npm run preview` script.

#### Command:

```bash
rt preview
```

## Configuration (rt.json)

The **`rt.json`** file allows you to customize default behavior:

- **language** : Choose between **js** or **ts** for JavaScript or TypeScript.
- **style**: Choose between **css**, **scss**, or other styling languages.
- **useModuleStyle**: Boolean to determine if style files should be module-based.
- **componentFileFormat**: Choose between **function** or **const**.
- **componentFileName**: Default name for component files (e.g., index), If the field is null, the file name will be determined by the component name.
- **styleFileName**: Default name for style files (e.g., style), If the field is null, the file name will be determined by the component name.
- **testLibrary**: Specify the testing library to use. Choose between **testing-library** or **cypress**
  If the field is null, no test file will be created when creating the component.
- **useSuffix**: Boolean to add _.modelName_ to the model file name (e.g., **.interface** to interfaces file).

### Example Configuration:

Here is an example **`rt.json`** configuration:

```bash
{
  "language": "js",
  "style": "css",
  "useModuleStyle": false,
  "componentFileFormat": "function",
  "componentFileName": null,
  "styleFileName": null,
  "testLibrary": null,
  "useSuffix": false
}
```

## Installing Customized Packages by Topic

With the `rt install` command, you can easily add packages to your React project tailored to specific needs. This command presents a menu organized by topic, allowing you to select from a curated list of packages. Whether you're looking to enhance your UI, manage state, handle forms, or add routing and animations, you can choose packages relevant to your project.

command:

```bash
rt install
```

or

```bash
rt i
```

## Template files

For those who like full control, there are two template files that can be edited:

**`component-rt.template`**: content of the component file

command to create:

```bash
rt template component
```

or

```bash
rt t c
```

**`style-rt.template`**: content of the style file

command to create:

```bash
rt template style
```

or

```bash
rt t s
```

The detailed content of the template files will be created according to the settings in the **`rt.json`** file

There are three variables to be aware of when editing such files:

- **{{styleFileName}}** - the name of the style file
- **{{functionName}}** - the name of the component with a capital letter at the beginning
- **{{componentName}}** - the name of the component

The variables in the template file are identified by double curly brackets

By editing the template files you can define a custom template for the component file and for the style file

## Examples

**1. Generate a TypeScript Component with SCSS Modules:**

**_This can be achieved in two ways:_**

A. With **`rt.json`** set to keep the default configuration:

Configure **`rt.json`**:

```bash
{
  "language": "ts",
  "style": "scss",
  "useModuleStyle": true
}
```

Then run:

```bash
rt generate component myComponent
```

B. With a command that will change the component configuration once:

run:

```bash
rt generate component myComponent --ts --style scss --use-module-style
```

**2. Generate a Component inside a new or existing folder:**

run:

```bash
rt generate component components/myComponent
```

If the **components** folder does not exist, the program will create it. If it does exist, the program will insert the component into it. In either case, the component will be inserted into the folder.

**3. Editing template files using variables:**

In **`component-rt.template`** file add in the _p_ tag a className of the component name:

```bash
import './{{styleFileName}}.css';



export default function  {{functionName}} ({}) {
  return (
    <p className='{{componentName}}'> {{componentName}} works!</p>
  )
};
```

In **`style-rt.template`** file add a class of the component name - with a font size of 20 pixels:

```bash
.{{componentName}}{
    font-size: 20px;
}
```

Now create a new component:

```bash
rt generate component myComponent
```

In the component files you can see that a className named **_myComponent_** was added to the p tag, and in the style file you can see that a class called **_myComponent_** has been added.

<!-- now look at the file `myComponent.jsx`:
```bash
import './myComponent.css';



export default function  MyComponent ({}) {
  return (
    <p className='myComponent'> myComponent works!</p>
  )
};
```

look at the file `MyComponent.css`:
```bash
.myComponent{
    font-size: 20px;
}
``` -->

---

With **React CLI RT**, you can efficiently generate and manage your React components and interfaces, supporting both traditional React and modern Vite applications.
