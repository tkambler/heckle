#!/usr/bin/env node
import { Command } from "commander";
import { runInit } from "./actions/init/index";
import { runUninit } from "./actions/uninit/index";
import { runWatch } from "./actions/watch/index";
import { parseName } from "#utils";

const program = new Command();

program.name("heckle").description("A CLI utility");

program
  .command("init")
  .requiredOption("-n, --name <name>", "project name", parseName)
  .action(runInit);

program
  .command("uninit")
  .requiredOption("-n, --name <name>", "project name", parseName)
  .action(runUninit);

program
  .command("watch")
  .requiredOption("-n, --name <name>", "project name", parseName)
  .option("-p, --persona <persona>", "comedian persona for roasts")
  .action(runWatch);

program.parse();
