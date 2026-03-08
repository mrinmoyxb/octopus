import { JSONFile } from 'lowdb/node';
import { join } from "path";
import { cwd } from "process";

const DB_PATH = join(cwd(), 'octopus.json');
const adapter = new JSONFile(DB_PATH);

const defaultData = {
    collections: [],
    history: []
};

const db = new Low(adapter, defaultData);

export async function initDB(){
    await db.read()
    db.data ||= defaultData
    await db.write()
}

export { db }