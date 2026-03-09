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
            headers: requestOptions.header || [],
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

    dbLogs.data[uuid].reponse = {
        timestamp: Date.now(),
        status: responseOptions.status,
        statusText: responseOptions.statusText,
        duration: responseOptions.duration,
        body: responseOptions.data
    }

    await dbLogs.write();
}

export async function displayLogs(){
    await initDBForLogs();

    const logs = dbLogs.data;
    if(logs.length === 0){
        console.log(chalk.gray("\n No saved logs yet."));
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

    logs.forEach((log)=>{
        console.log(chalk.green("Request: "));
        console.log(chalk.yellow(`timestamp: ${log.request.timestamp}`));
        console.log(chalk.yellow(`method: ${log.request.method}`));
        console.log(chalk.yellow(`url: ${log.request.url}`));
        console.log(chalk.yellow(`params: ${log.request.params}`));
        console.log(chalk.yellow(`headers: ${log.request.headers}`));
        console.log(chalk.yellow(`token: ${log.request.token}`));
        console.log(chalk.yellow(`body: ${log.request.body}`));
        console.log();

        console.log(chalk.green("Response: "));
        console.log(chalk.yellow(`timestamp: ${log.response.timestamp}`));
        console.log(chalk.yellow(`method: ${log.request.method}`));
        console.log(chalk.yellow(`url: ${log.request.url}`));
        console.log(chalk.yellow(`params: ${log.request.params}`));
        console.log(chalk.yellow(`headers: ${log.request.headers}`));
        console.log(chalk.yellow(`token: ${log.request.token}`));
        console.log(chalk.yellow(`body: ${log.request.body}`));
    })

}