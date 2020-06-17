import fs from 'fs';
import path from 'path';
import MuseClient from './client';

export class Utils {

    private client: MuseClient;

    constructor(client: MuseClient) {
        this.client = client;
    }

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

        const jsFiles = this.findNested(path.join(__dirname, `${path.sep}${dir}${path.sep}`), ".js");
        const folderName = dir.split('../')[dir.split('../').length - 1];
        if (jsFiles.length <= 0) return console.log(`There are no ${folderName} to load.`);

        console.log(`Loading ${jsFiles.length} ${folderName.substring(0, folderName.length - 1)}${jsFiles.length <= 1 ? "" : "s"}...`);
        jsFiles.forEach(file => {
            require(file);
        });

    }

}