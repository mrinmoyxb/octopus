import chalk from "chalk";
import { dbLogs, initDBForLogs } from "../storage/logs.requests.db.js";

export async function saveRequestToLogs(requestOptions){
    await initDBForLogs();
    const uuid = crypto.randomUUID();
    dbLogs.data[uuid] = {
        request : {
            timestamp: Date.now(),
            method: requestOptions.method.toUpperCase(),
            url: requestOptions.url,
            params: requestOptions.params || [],
            headers: requestOptions.headers || [],
            token: requestOptions.token || null,
            body: requestOptions.body || null
        },
        response: null
    }

    await dbLogs.write();
    return uuid;
}

export async function saveResponseToLogs(uuid, responseOptions){
    await initDBForLogs();

    if(!dbLogs.data[uuid]) return;

    dbLogs.data[uuid].response = {
        timestamp: Date.now(),
        status: responseOptions.status,
        statusText: responseOptions.statusText,
        duration: responseOptions.duration,
        body: responseOptions.data
    }

    await dbLogs.write();
}

export async function displayLogs(options = {}){
    await initDBForLogs();

    let logs = Object.values(dbLogs.data);
    if(options.method){
        logs = logs.filter(log => log.request.method === options.method.toUpperCase());
    }
    if(options.limit){
        logs = logs.slice(-parseInt(options.limit));
    }
    if(logs.length === 0){
        console.log(chalk.gray("\n No saved logs yet."));
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

    logs.forEach((log, index)=>{
        const color = methodColor[log.request.method] || chalk.white;
        
        console.log();
        console.log(divider);
        console.log(chalk.bold(` #${index + 1}`));
        console.log();

        console.log(chalk.bold('  Request:'))
        console.log(`    method:    ${color.bold(log.request.method)}`)
        console.log(`    url:       ${chalk.white(log.request.url)}`)
        console.log(`    timestamp: ${chalk.gray(new Date(log.request.timestamp).toLocaleString())}`)
        if (log.request.body)    console.log(`    body:      ${chalk.gray(JSON.stringify(log.request.body))}`)
        if (log.request.token)   console.log(`    token:     ${chalk.gray(log.request.token)}`)

        console.log()

        if (log.response) {
            console.log(chalk.bold('  Response:'))
            console.log(`    status:    ${chalk.green(log.response.status)} ${chalk.gray(log.response.statusText)}`)
            console.log(`    duration:  ${chalk.yellow(log.response.duration + 'ms')}`)
            console.log(`    timestamp: ${chalk.gray(new Date(log.response.timestamp).toLocaleString())}`)
        } else {
            console.log(chalk.red('  Response:  (request failed — no response received)'))
        }
    })

    console.log();
    console.log(divider);
    console.log(chalk.gray(`\n  ${logs.length} log(s) total\n`));
}