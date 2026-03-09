import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { cwd } from "process";

const DB_PATH = join(cwd(), 'octopus_env.json');
const adapter = new JSONFile(DB_PATH);

const defaultData = {
    active: null,
    environments: {}
}

const dbEnv = new Low(adapter, defaultData);

export async function initDBForEnv(){
    await dbEnv.read();
    dbEnv ||= defaultData;
    await dbEnv.write();
}

export { dbEnv };