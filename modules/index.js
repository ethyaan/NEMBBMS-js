import path from 'path';
import fs from 'fs';
import os from "os";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesPath = path.join(__dirname, './');

const modules = (app) => {

    /**
     * load all submodules
     */
    fs.readdirSync(modulesPath).forEach(async (directory) => {
        if (directory === 'index.js') { return; }
        const modulePath = path.join((os.platform() === "win32" ? "file://" : ""), __dirname, directory, "route.js");
        const module = await import(modulePath);
        return module.default(app);
    });
};

export default modules;