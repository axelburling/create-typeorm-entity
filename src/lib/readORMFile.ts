import * as fs from 'fs';
import * as path from 'path';
import { ORMCONFIG } from 'src/types';


const ensureDirectoryExistence = (dir: string): void | boolean => {
    var dirname = path.dirname(dir);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }


export const readORMConfig = async (filename: string): Promise<ORMCONFIG> => {
    const ormConfig = await fs.readFileSync(path.resolve(process.cwd(), filename), {encoding: 'utf8'});
    if(filename.endsWith('.json')) {
        return JSON.parse(ormConfig);
    }
    return ormConfig as unknown as ORMCONFIG;
}