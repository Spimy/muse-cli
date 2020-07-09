import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import execa from 'execa';
import Listr from 'listr';

import { projectInstall } from 'pkg-install';
import { promisify } from 'util';

const access = promisify(fs.access);
const exists = promisify(fs.exists);
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);
const copy = promisify(ncp);

const generateProjectDefinition = async (options, directory) => {

    const projectDefinition = path.resolve(directory, 'muse.json');

    let data = JSON.parse(await read(projectDefinition, 'utf-8'));
    data = JSON.stringify({
        ...data,
        packageManager: options.packageManager,
        defaultProject: options.name
    }, 'utf-8', 4);

    await write(projectDefinition, data);

}

const generatePackage = async (options, directory) => {

    const packageJSON = path.resolve(directory, 'package.json');

    let data = JSON.parse(await read(packageJSON, 'utf-8'));
    data = JSON.stringify({ ...data, name: options.name }, 'utf-8', 4);

    await write(packageJSON, data);

}

const copyTemplateFiles = async (options) => {

    const projectDirectory = path.resolve(options.targetDirectory, options.name);

    copy(options.templateDirectory, projectDirectory, {
        clobber: false
    }).then(async () => {
        await generateProjectDefinition(options, projectDirectory);
        await generatePackage(options, projectDirectory);
    });

}

const gitInit = async (options, counter = 0) => {

    try {
        const projectDirectory = path.resolve(options.targetDirectory, options.name);

        const result = await execa('git', ['init'], {
            cwd: projectDirectory
        });

        if (result.failed) {
            return Promise.reject(new Error('Failed to initialise Git'));
        }
    } catch {
        if (counter < 3) {
            gitInit(options, counter + 1);
        } else {
            return Promise.reject(new Error('Failed to initalise git repository.'));
        }
    }

    return;
}


export const createBot = async (options) => {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    };

    const templateDirectory = path.resolve(
        __dirname,
        './templates',
        options.template.toLowerCase()
    );
    options.templateDirectory = templateDirectory;

    try {
        await access(templateDirectory, fs.constants.R_OK);
    } catch (err) {
        console.error(err)
        console.error(`${chalk.red.bold('ERROR')} Invalid template name`);
        process.exit(1);
    }

    console.log('Generating muse project files...');

    const tasks = new Listr([
        {
            title: 'Generating muse project files...',
            task: async () => await copyTemplateFiles(options)
        },
        {
            title: 'Initialising Git...',
            task: async () => await gitInit(options),
            enabled: () => options.git
        },
        {
            title: 'Installing dependencies...',
            task: () => projectInstall({
                cwd: path.resolve(options.targetDirectory, options.name),
                prefer: options.packageManager
            }),
            skip: () => options.skipInstall
        }
    ]);
    await tasks.run();

    console.log(`${chalk.yellow.bold('DONE')} New muse project has been generated.`);
    return true;
}

const createComponent = async (options, projectTemplate) => {

    const name = options.componentName.split('/').pop();
    const subfolderCounter = options.componentName.split('/').length;

    let data;
    if (options.component === 'command') {
        const { commandTemplate } = require(`./components/${projectTemplate}/command`);

        let category;
        if (subfolderCounter >= 2) {
            category = options.componentName.split('/')[options.componentName.split('/').length - 2];
        }

        data = commandTemplate(name, subfolderCounter, toTitleCase(category));
    } else {
        const { eventTemplate } = require(`./components/${projectTemplate}/event`);
        data = eventTemplate(name, subfolderCounter);
    }

    const extension = projectTemplate === 'typescript' ? 'ts' : 'js';
    const src = projectTemplate === 'typescript' ? 'src' : '';
    const componentName = `${camelToSnakeCase(options.componentName)}.${extension}`;

    const dir = path.resolve(options.projectDirectory, src, `${options.component}s`, componentName);

    if (await exists(dir)) {
        console.error(`${chalk.red.bold('ERROR')} ${options.component[0].toUpperCase() +
            options.component.substring(1)} '${options.componentName}' already exists.`);
        process.exit(1);
    }

    await writeFileSyncRecursive(dir, data, 'utf-8');

}

export const generateComponent = async (options) => {

    options = {
        ...options,
        projectDirectory: process.cwd()
    };

    const muse = require(`${options.projectDirectory}/muse.json`);

    const componentDirectory = path.resolve(
        __dirname,
        './components',
        muse.projectTemplate
    );
    options.componentDirectory = componentDirectory;

    await createComponent(options, muse.projectTemplate);

}


// Helper Functions
const writeFileSyncRecursive = async (filename, content, charset) => {
    const folders = filename.split(path.sep).slice(0, -1)
    if (folders.length) {
        // create folder path if it doesn't exist
        folders.reduce((last, folder) => {
            const folderPath = last ? last + path.sep + folder : folder
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath)
            }
            return folderPath
        })
    }
    fs.writeFileSync(filename, content, charset)
}

const toTitleCase = (string) => {
    let titled = string.toLowerCase().split(' ');

    for (var i = 0; i < titled.length; i++) {
        titled[i] = titled[i][0].toUpperCase() + titled[i].slice(1);
    }

    return titled.join(' ');
}

const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);