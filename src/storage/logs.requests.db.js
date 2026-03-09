import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { cwd } from "process";

const DB_PATH = join(cwd(), 'octopus_logs.json');
const adapter = new JSONFile(DB_PATH);
const dbLogs = new Low(adapter, {});

export async function initDBForLogs(){
    await dbLogs.read()
    dbLogs.data ||= logs
    await dbLogs.write()
}

export { dbLogs }