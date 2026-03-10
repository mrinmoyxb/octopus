import figlet from "figlet";
import chalk from "chalk";

async function renderAscii(text, font="ANSI Shadow"){
    return new Promise((resolve, reject)=>{
        figlet.text(text, { font }, (err, result)=>{
            if(err) reject(err);
            else resolve(result);
        })
    })
}

function centerLine(line){
    const terminalWidth = process.stdout.columns || 80
    const visibleLength = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    const padding = Math.max(0, Math.floor((terminalWidth - visibleLength)/2));
    return ' '.repeat(padding) + line;
}

function centerBlock(text){
    return text
        .split("\n")
        .map(line => centerLine(line))
        .join("\n")
}

export async function showBanner(version = '1.0.0'){
    const ascii = await renderAscii(" OCTOPUS ")

    const coloredAscii = centerBlock(
        ascii.split("\n").map(line => chalk.red.bold(line)).join("\n")
    )
    
    const terminalWidth = process.stdout.columns || 80
    const divider = chalk.cyan('─'.repeat(Math.min(terminalWidth - 4, 70)))

    const tagline   = centerLine(`🐙  ${chalk.white.bold('The API client for developers who live in the terminal')}`)
    const meta      = centerLine(`${chalk.gray('v' + version)}  ${chalk.gray('|')}  ${chalk.gray('MIT License')}  ${chalk.gray('|')}  ${chalk.gray("https://github.com/mrinmoyxb/octopus")}`)
    const helpHint  = centerLine(`Run ${chalk.cyan.bold('octopus --help')} for detailed info`)

    console.log()
    console.log(coloredAscii)
    console.log()
    console.log(centerLine(divider))
    console.log()
    console.log(tagline)
    console.log(meta)
    console.log()
    console.log(centerLine(divider))
    console.log()
    console.log(helpHint)
    console.log()
}