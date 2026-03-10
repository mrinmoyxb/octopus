import chalk from "chalk";
import { db, initDB } from "../storage/requests.db.js";
import { sendGET, sendPOST, sendPATCH, sendPUT, sendDELETE } from "../core/http-client.js";
import { displayResponse, displayError, createSpinner } from "../utils/display.js";

const METHOD_MAP = {
    GET: sendGET,
    POST: sendPOST,
    PUT: sendPUT,
    PATCH: sendPATCH,
    DELETE: sendDELETE
}

export async function saveCommand(name, options){
    await initDB();
    const exists = db.data.collections.find(r => r.name === name);
    if(exists){
        console.log(chalk.yellow(`\n ⚠️  A request named "${name}" already exists. `));
        console.log(chalk.gray(` Use a different name or delete it first with: octopus delete-saved "${name}" `));
        return;
    }

    const request = {
        name,
        method: options.method.toUpperCase(),
        url: options.url,
        body: options.body || null,
        token: options.token || null,
        header: options.header || [],
        params: options.params || [],
        savedAt: new Date().toString()
    }

    db.data.collections.push(request);
    await db.write();

    console.log();
    console.log(chalk.green(` ✅ Saved ${name}`));
    console.log(chalk.gray(` ${request.method} ${request.url}`));
    console.log(chalk.gray(` Stored in octopus.json`));
}

export async function runCommand(name){
    await initDB();

    const request = db.data.collections.find(r => r.name === name);
    if(!request){
        console.log(chalk.red(`\n ❌ No saved request named "${name}`));
        console.log(chalk.gray(` Run octopus list to see all saved requests\n`));
        process.exit(1);
    }

    const sendFn = METHOD_MAP[request.method]
    if(!sendFn){
        console.log(chalk.red(` \n ❌ Unknown method "${request.method}"\n`));
        process.exit(1);
    }

    const options = {
        body: request.body,
        token: request.token,
        headers: request.headers,
        params: request.params
    }

    const spinner = createSpinner(request.method, request.url);
    try{
        const start = Date.now();
        const response = await sendFn(request.url, options);
        response.duration = Date.now() - start;
        spinner.succeed();
        displayResponse(response, request.method);
        await logToHistory(request, response);
    }catch(error){
        spinner.fail();
        displayError(error);
        process.exit(1);
    }
}

export async function listCommand(){
    await initDB();
    
    const collections = db.data.collections;
    if(collections.length === 0){
        console.log(chalk.gray("\n No saved requests yet."));
        console.log(chalk.gray(' Save one with: octopus save "name" --method GET --url <url>\n'));
        return;
    }

    const divider = chalk.gray('-'.repeat(60));
    const methodColor = {
        GET:    chalk.green,
        POST:   chalk.blue,
        PUT:    chalk.yellow,
        PATCH:  chalk.magenta,
        DELETE: chalk.red,
    }

    console.log();
    console.log(divider);
    console.log(
        ` ${chalk.bold("NAME").padEnd(20)}              ${chalk.bold("METHOD").padEnd(8)} ${chalk.bold("URL")}`
    )
    console.log(divider);

    collections.forEach((r, index)=>{
        const color = methodColor[r.method] || chalk.white
        const number = chalk.gray(`${index+1}.`.padEnd(4))
        const name = chalk.white(r.name.padEnd(20))
        const method = color.bold(r.method.padEnd(8))
        const url = chalk.gray(r.url)

        console.log(` ${number}${name} ${method} ${url}`)
    })

    console.log(divider)
    console.log(chalk.gray(`\n ${collections.length} saved request(s)\n`));
}

async function logToHistory(request, response){
    db.data.history.push({
        name: request.name,
        method: request.method,
        url: request.url,
        status: request.status,
        duration: request.duration,
        ranAt: new Date().toISOString()
    })
    if(db.data.history.length>50){
        db.data.history = db.data.history.slice(-50);
    }
    await db.write();
}