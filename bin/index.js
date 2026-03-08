#!/usr/bin/env node

import { Command } from "commander";
import { getCommand, postCommand } from "../src/commands/request.js";
import { showBanner } from "../src/utils/banner.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const args = process.argv.slice(2);
const showingHelp = args.length === 0 || args.includes('--help') || args.includes('-h');
if(showingHelp){
    await showBanner(version);
}

const program = new Command();

program
    .name("octopus")
    .version("1.0.0")

program
    .command("get <url>")
    .description("Send a GET request")
    .option("-H, --header <header...>", 'Custom header e.g. "Authorization: Bearer token"')
    .option("-p, --param <param...>", "Query param e.g. page=1")
    .option("-t, --token <token>", "Bearer token shorthand")
    .action(getCommand);

program
    .command("post <url>")
    .description("Send a POST request")
    .option("-b, --body <json>", 'JSON body e.g. \'{"name":"John"}\'')
    .option("-H, --header <header...>", "Custom header")
    .option("-t, --token <token>", "Bearer token shorthand")
    .action(postCommand);

program.parse(process.argv);
