import * as fs from 'fs';
import * as path from 'path';


const ensureDirectoryExistence = (dir: string): void | boolean => {
    var dirname = path.dirname(dir);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

export const writeToFile = ({dir, filename}: {dir: string, filename: string}, template: string) => {
    const exists = ensureDirectoryExistence(dir);
    if(exists) {
    const filePath = path.join(dir, filename);
    fs.writeFile(filePath, template, {encoding: 'utf8'}, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File has been created');
    });
} else {
    console.log('Error creating directory');
}
}