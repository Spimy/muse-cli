import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import arg from 'arg';
import inquirer from 'inquirer';
import { promisify } from 'util';

import { createBot, generateComponent } from './generator';
import events from './components/events';

const NEW_OP = ['new', 'n'];
const GEN_OP = ['generate', 'g'];
const COMPONENTS = ['command', 'event'];
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

        name: args._[1], // if operation is new
        template: args._[2], // if operation is new

        component: args._[1], // if operation is generate
        componentName: args._[2], // if operation is generate

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

const promptMissingComponent = async (options) => {

    const questions = [];

    if (!options.component || !COMPONENTS.includes(options.component)) {
        questions.push({
            type: 'list',
            name: 'component',
            message: 'enter component:',
            choices: COMPONENTS
        });
    }

    const answer = await inquirer.prompt(questions);
    return answer.component || options.component;

}

const promptMissingOpts = async (options) => {

    const defaultName = 'muse';
    const defaultTemplate = 'typescript';

    const templates = ['typescript'];
    const pkgManagers = ['npm', 'yarn'];
    const questions = [];

    const operation = await promptMissingOperation(options);


    if (NEW_OP.includes(operation)) {

        if (!options.name) {
            questions.push({
                type: 'input',
                name: 'name',
                message: 'enter name:',
                default: defaultName,
                validate: function (input) {
                    const done = this.async();
                    const regex = /^[a-z_\-]+$/;

                    if (!regex.test(input)) {
                        done('Sorry, name cannot contain capital letters and name cannot contain special characters ("~\'!()*").');
                        return;
                    }

                    done(null, true);
                }
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
            return undefined;
        }

        const component = await promptMissingComponent(options);

        if (!options.componentName) {
            questions.push({
                type: 'input',
                name: 'componentName',
                message: 'enter component name:',
                validate: function (input) {
                    const done = this.async();
                    const regex = /^[a-zA-Z_/]+$/;

                    if (!regex.test(input)) {
                        done('Sorry, name cannot contain capital letters and name cannot contain special characters ("~\'!()*").');
                        return;
                    }

                    if (component === COMPONENTS[1] && !events.includes(input.split('/').pop())) {
                        done(`Please enter a valid event name from the list:\n${chalk.red.dim('>>')} [${events.join(', ')}]`);
                        return;
                    }

                    done(null, true);
                }
            });
        }

        const answers = await inquirer.prompt(questions);
        return {
            ...options,
            component: component,
            componentName: answers.componentName || options.componentName,
        };

    }


}

export const cli = async (args) => {

    let options = parseArgs(args);
    options = await promptMissingOpts(options);
    if (!options) return;

    if (NEW_OP.includes(options.operation)) {
        await createBot(options);
    } else {
        await generateComponent(options);
    }

};