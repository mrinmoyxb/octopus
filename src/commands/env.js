import chalk from "chalk";
import { dbEnv, initDBForEnv } from "../storage/env.db.js";

export async function envSet(key, value, options){
    await initDBForEnv();
    
    const envName = options.env || "default";

    if(!dbEnv.data.environments[envName]){
        dbEnv.data.environments[envName] = {}
    }

    dbEnv.data.environments[envName][key] = value;

    if(!dbEnv.data.active){
        dbEnv.data.active = envName
    }

    await dbEnv.write();

    console.log();
    console.log(chalk.green(`   ✅ Set ${chalk.bold(key)} in [${envName}]`));
    console.log(chalk.gray(`   ${key} = ${value}\n`));
}

export async function envUse(name){
    await initDBForEnv();

    if(!dbEnv.data.environments[name]){
        console.log(chalk.red(`\n  ❌ Environment "${name}" doesn't exist.`));
        console.log(chalk.gray(`  Create it first: octopus env set <key> <value> --env ${name}\n`))
        process.exit(1);
    }

    dbEnv.data.active = name;
    await dbEnv.write()

    console.log()
    console.log(chalk.green(`  ✅ Switched to [${chalk.bold(name)}]`))
    console.log(chalk.gray(`  All requests will now use "${name}" variables\n`))
}

export async function envList(){
    await initDBForEnv();

    const { active, environments } = dbEnv.data;
    const envNames = Object.keys(environments);

    if(envNames.length === 0){
        console.log(chalk.gray('\n  No environments yet.'));
        console.log(chalk.gray('  Create one: octopus env set base_url http://localhost:3000 --env development\n'));
        return;
    }

    const divider = chalk.gray('─'.repeat(60));

    console.log();
    console.log(divider);

    envNames.forEach(envName => {
        const isActive = envName === active;
        const indicator =  isActive ? chalk.green('● ') : chalk.gray('○ ');
        const label = isActive ? chalk.green.bold(envName) + chalk.green(' (active)') : chalk.white(envName);
        console.log(`  ${indicator}${label}`);

        const variables = environments[envName];
        Object.entries(variables).forEach(([key, value]) => {
            console.log(`      ${chalk.cyan(key)} = ${chalk.gray(value)}`);
        })
        console.log();
    })

    console.log(divider);
    console.log();
}

export async function getActiveVariables(){
    await initDBForEnv();

    const { active, environments } = dbEnv.data;
    if(!active || !environments[active]) return {};

    return environments[active];
}

export async function envDelete(options){
    await initDBForEnv();

    if(options.all){
        dbEnv.data.active = null;
        dbEnv.data.environments = {};
        await dbEnv.write();
        console.log(chalk.green(`  ✅ Deleted all environments`));
    }else{
        if(!dbEnv.data.environments[options.env]){
            console.log(chalk.gray('\n  No environments yet.'));
            console.log(chalk.gray('  Create one: octopus env set base_url http://localhost:3000 --env development\n'));
            return;
        }

        if(dbEnv.data.active === options.env){
            dbEnv.data.active = null;
        }

        delete dbEnv.data.environments[options.env];
        await dbEnv.write();
        console.log(chalk.green(`  ✅ Deleted env [${chalk.bold(options.env)}]`));
    }
}