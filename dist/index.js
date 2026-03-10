#!/usr/bin/env node
import { Command } from "commander";
import { runInit } from "./actions/init/index.js";
import { runWatch } from "./actions/watch/index.js";
import { parseName } from "./utils.js";
const program = new Command();
program.name("heckle").description("A CLI utility");
program
    .command("init")
    .requiredOption("-n, --name <name>", "project name", parseName)
    .action(runInit);
program
    .command("watch")
    .requiredOption("-n, --name <name>", "project name", parseName)
    .option("-p, --persona <persona>", "comedian persona for roasts")
    .action(runWatch);
program.parse();
//# sourceMappingURL=index.js.map