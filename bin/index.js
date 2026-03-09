#!/usr/bin/env node

import { Command } from "commander";
import { deleteCommand, getCommand, patchCommand, postCommand, putCommand } from "../src/commands/request.js";
import { showBanner } from "../src/utils/banner.js";
import { createRequire } from "module";
import { listCommand, runCommand, saveCommand } from "../src/commands/collection.js";

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
    .option("-p, --param <param...>",   "Query param e.g. page=1")
    .option("-t, --token <token>",      "Bearer token shorthand")
    .action(getCommand);

program
    .command("post <url>")
    .description("Send a POST request")
    .option("-b, --body <json>",         'JSON body e.g. \'{"name":"John"}\'')
    .option("-H, --header <header...>",  "Custom header")
    .option("-t, --token <token>",       "Bearer token shorthand")
    .action(postCommand);

program
    .command("delete <url>")
    .description("Send a DELETE request")
    .option('-H, --header <header...>', 'Custom header')
    .option('-t, --token <token>',      'Bearer token shorthand')
    .option('-b, --body <json>',        'Optional JSON body for bulk deletes')
    .action(deleteCommand);

program
    .command("put <url>")
    .description("Send a PUT request (full update)")
    .option('-b, --body <json>',        "JSON body e.g. '{\name\":\"John\"}'")
    .option('-H, --header <header...>', 'Custom header')
    .option('-t, --token <token>',      'Bearer token shorthand')
    .action(putCommand)

program
    .command("patch <url>")
    .description('Send a PATCH request (partial update)')
    .option('-b, --body <json>',        "JSON body e.g. '{\"name\":\"John\"}'")
    .option('-H, --header <header...>', 'Custom header')
    .option('-t, --token <token>',      'Bearer token shorthand')
    .action(patchCommand)

program
    .command("save <name>")
    .description('Save a request to your collection')
    .requiredOption('-m, --method <method>', 'HTTP method: GET, POST, PUT, PATCH, DELETE')
    .requiredOption('-u, --url <url>',       'Request URL')
    .option('-b, --body <json>',             'JSON body')
    .option('-H, --header <header...>',      'Custom headers')
    .option('-t, --token <token>',           'Bearer token')
    .option('-p, --param <param...>',        'Query params')
    .action(saveCommand)

program
    .command("run <save>")
    .description("Run a saved request")
    .action(runCommand)

program
    .command("list")
    .description("Show all saved requests")
    .action(listCommand)

program.parse(process.argv);
