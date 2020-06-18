import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import arg from 'arg';
import inquirer from 'inquirer';
import { promisify } from 'util';

import { createBot } from './generator';

const NEW_OP = ['new', 'n'];
const GEN_OP = ['generate', 'g'];
const DEFAULT_PKG_MANAGER = 'npm';
const exists = promisify(fs.exists);

const parseArgs = (rawArgs) => {
    const args = arg({
        '--skipInstall': Boolean,
        '--git': Boolean,
        '--packageManager': String,
        '--skip-install': '--skipInstall',
        '--package-manager': '--packageManager',
        '-g': '--git'
    }, {
        argv: rawArgs.slice(2)
    });

    return {
        operation: args._[0],
        name: args._[1],
        template: args._[2],
        skipInstall: args['--skipInstall'] || false,
        packageManager: args['--packageManager'] || DEFAULT_PKG_MANAGER,
        git: args['--git'] || false
    };

}

const promptMissingOperation = async (options) => {

    const operations = [...NEW_OP, ...GEN_OP];
    const questions = [];

    if (!options.operation || !operations.includes(options.operation)) {
        questions.push({
            type: 'list',
            name: 'operation',
            message: 'enter operation:',
            choices: operations.filter((op, index) => index % 2 === 0)
        });
    }

    const answer = await inquirer.prompt(questions);
    return answer.operation || options.operation;

}

const promptMissingOpts = async (options) => {

    const defaultName = 'muse';
    const defaultTemplate = 'typescript';

    const templates = ['javascript', 'typescript'];
    const pkgManagers = ['npm', 'yarn'];
    const questions = [];

    const operation = await promptMissingOperation(options);


    if (NEW_OP.includes(operation)) {

        if (!options.name) {
            questions.push({
                type: 'input',
                name: 'name',
                message: 'enter name:',
                default: defaultName
            });
        }

        if (!options.template || !templates.includes(options.template)) {
            questions.push({
                type: 'list',
                name: 'template',
                message: 'enter language template:',
                choices: templates,
                default: defaultTemplate
            });
        }

        if (!pkgManagers.includes(options.packageManager)) {
            questions.push({
                type: 'list',
                name: 'packageManager:',
                message: 'package manager:',
                choices: pkgManagers,
                default: DEFAULT_PKG_MANAGER
            });
        }

        const answers = await inquirer.prompt(questions);
        return {
            ...options,
            operation: operation,
            name: answers.name || options.name || defaultName,
            template: answers.template || options.template,
            packageManager: answers.packageManager || DEFAULT_PKG_MANAGER
        };

    } else {
        const museProject = await exists(path.resolve(process.cwd(), 'muse.json'));
        if (!museProject) {
            console.error(`${chalk.red.bold('The generate command requires to be run in a muse project, but a project definition could not be found.')}`)
        }
        return options;
    }


}

export const cli = async (args) => {

    let options = parseArgs(args);
    options = await promptMissingOpts(options);

    if (NEW_OP.includes(options.operation)) {
        await createBot(options);
    } else {
        console.log('test');
    }

};