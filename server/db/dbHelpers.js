import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'db.json')

export async function readDb() {
    const fileContent  = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileContent )
}

export async function writeDb(data) {
   const content = JSON.stringify(data, null, 2)
   await fs.writeFile(dbPath, content); 
}
