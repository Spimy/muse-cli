import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import execa from 'execa';
import Listr from 'listr';

import { projectInstall } from 'pkg-install';
import { promisify } from 'util';
import { exec } from 'child_process';

const access = promisify(fs.access);
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

export const generateComponent = async (options) => {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    };


}