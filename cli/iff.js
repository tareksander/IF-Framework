// @ts-check

import * as fs from 'node:fs/promises';
import { exit, stdin, stdout, cwd } from 'node:process';
import * as readline from 'node:readline/promises';

import simpleGit from "simple-git";
import chalk from 'chalk';
import { Command } from "commander";
import { rimraf } from "rimraf";
import path from 'node:path';

const rl = readline.createInterface(stdin, stdout);
const git = simpleGit(cwd());
const program = new Command();
let noCommand = true;

program.name("iff")
        .description("CLI for @if-framework packages.")
        .version("0.1.0", "-v", "--version");

program.command("new")
    .description("Creates a new IF Framework project from the template repository.")
    .option("-r --repo <URL>", "Custom template repo to use")
    .argument("<dir>", "Directory to create the project in. Can only contain letters, numbers dashes or underscores")
    .action( /** @type {function(string, { repo: string|undefined }): Promise<void>} */ async (dir, options) => {
        if (dir.match("^[a-zA-Z-_]*$") === null) {
            console.log(chalk.red("Directory can only contain letters, numbers dashes or underscores."));
            exit(1);
        }
        noCommand = false;
        console.log("Checking for git...");
        if (! (await git.version()).installed) {
            console.log(chalk.red("Git not found!"));
            console.log(chalk.red("Check if you have git installed: https://git-scm.com/downloads"));
            exit(1);
        } else {
            console.log(chalk.green("Git found!"));
        }
        try {
            await fs.stat(dir);
            console.log(chalk.red("Directory name exists already!"));
            exit(1);
        } catch {}
        try {
            fs.access(process.cwd(), fs.constants.R_OK | fs.constants.W_OK | fs.constants.W_OK);
        } catch {
            console.log(chalk.red("Not enough permissions in current directory!"));
            exit(1);
        }
        try {
            console.log("Cloning repo...");
            if (options.repo === undefined) {
                await git.clone("https://github.com/tareksander/IF-Framework-Template.git", dir);
                await simpleGit(path.join(cwd(), dir)).removeRemote("origin");
            } else {
                await git.clone(options.repo, dir);
            }
            console.log("Repo cloned.");
            let name = (await rl.question("Story name: ")).replace(/"/g, "\\\"");
            let desc = await rl.question("Story description: ".replace(/"/g, "\\\""));
            
            const packagePath = path.join(dir, "package.json");
            const webpackPath = path.join(dir, "webpack.config.js");
            
            await fs.writeFile(packagePath, (await fs.readFile(packagePath, { encoding: "utf8" }))
                .replace(/@@@DIR@@@/g, dir)
                .replace(/@@@DESC@@@/g, desc), { encoding: "utf8" });
            await fs.writeFile(webpackPath, (await fs.readFile(webpackPath, { encoding: "utf8" }))
                .replace(/@@@TITLE@@@/g, name)
                .replace(/@@@DESC@@@/g, desc), { encoding: "utf8" });
        } catch {
            rimraf(dir)
        }
        exit(0);
});



program.parse();

if (noCommand) program.help();
