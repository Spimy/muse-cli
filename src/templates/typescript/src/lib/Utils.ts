import fs from 'fs';
import path from 'path';

export class Utils {

    private findNested = (dir: string, pattern: string) => {

        let results: string[] = [];

        fs.readdirSync(dir).forEach(inner_dir => {

            inner_dir = path.resolve(dir, inner_dir);
            const stat = fs.statSync(inner_dir);

            if (stat.isDirectory()) {
                results = results.concat(this.findNested(inner_dir, pattern));
            }

            if (stat.isFile() && inner_dir.endsWith(pattern)) {
                results.push(inner_dir);
            }

        });

        return results;

    }

    loadModules = async (dir: string) => {

        const jsFiles = this.findNested(path.join(__dirname, `${path.sep}${dir}${path.sep}`), '.js');
        const folderName = dir.split(`.${path.sep}`)[dir.split(`.${path.sep}`).length - 1];
        if (jsFiles.length <= 0) return console.log(`There are no ${folderName} to load.`);

        console.log(`Loading ${jsFiles.length} ${folderName.substring(0, folderName.length - 1)}${jsFiles.length <= 1 ? '' : 's'}...`);
        jsFiles.forEach(file => {
            require(file);
        });

    }

    formatSeconds = (seconds: number) => {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    replaceStrChar = (str: string, index: number, replacement: string) => {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }

    truncateStr = (str: string, length: number) => {
        return (str.length > length) ? str.substr(0, length - 1) + '...' : str;
    }

}
