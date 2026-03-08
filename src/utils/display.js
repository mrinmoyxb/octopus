import chalk, { colors } from "chalk";
import ora from "ora";

function colorStatus(status){
    if(status>=200 && status<300) return chalk.bgGreen.black.bold(`${status}`);
    if(status>=300 && status<400) return chalk.bgCyan.black.bold(`${status}`);
    if(status>=400 && status<500) return chalk.bgYellow.black.bold(`${status}`);
    return chalk.bgRed.white.bold(`${status}`);
}

function prettyJSON(data){
    const raw = JSON.stringify(data, null, 2);
    return raw
        .replace(/"([^"]+)":/g,        (_, k) => `${chalk.cyan('"' + k + '"')}:`)
        .replace(/: "([^"]+)"/g,       (_, v) => `: ${chalk.green('"' + v + '"')}`)
        .replace(/: (-?\d+\.?\d*)/g,   (_, n) => `: ${chalk.yellow(n)}`)
        .replace(/: (true|false)/g,    (_, b) => `: ${chalk.magenta(b)}`)
        .replace(/: (null)/g,          (_, n) => `: ${chalk.gray(n)}`)
}

export function createSpinner(method, url){
    const methodColor = {
        GET: chalk.green,
        POST: chalk.blue,
        DELETE: chalk.red
    }
    const color = methodColor[method] || chalk.white;
    return ora(`${color.bold(method)} ${chalk.gray(url)}`).start();
}

export function displayResponse(response, method){
    const divider = chalk.gray("-".repeat(52))
    const methodColor = { GET: chalk.green, POST: chalk.blue, DELETE: chalk.red }
    const color = methodColor[method] || chalk.white;

    console.log();
    console.log(divider);
    console.log(
        ` ${color.bold(method)} ${colorStatus(response.status)} ${chalk.gray(response.statusText)} ${chalk.gray(".")} ${chalk.yellow(response.duration + "ms")}`
    )
    console.log(divider);

    if(response.data && Object.keys(response.data).length > 0){
        console.log(chalk.bold("\n Body:\n"))
        prettyJSON(response.data)
            .split("\n")
            .forEach((line)=>console.log(" " + line));
    }else{
        console.log(chalk.gray("\n (empty body)\n"));
    }

    console.log();
    console.log(divider);
    console.log();
}

export function displayError(error){
    const divider = chalk.red("-".repeat(52));

    console.log();
    console.log(divider);
    console.log(` ${chalk.red.bold("✖ Request Failed")}`);
    console.log(divider);

    if(error.response){
        console.log(
            `\n ${chalk.bold("Status:")} ${colorStatus(error.response.status)} ${chalk.gray(error.response.statusText)}`
        );
        if(error.response.data){
            console.log(chalk.bold("\n Error Body:\n"));
            prettyJSON(error.response.data)
                .split("\n")
                .forEach((line)=>console.log(" " + line))
        }
    }else{
        console.log(`\n ${chalk.yellow(error.message)}`);
    }
    
    console.log();
    console.log(divider);
    console.log();
}