import fs from "node:fs";

function createIfNotExist(path) {
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}

createIfNotExist('./docs');
createIfNotExist("./slides");

fs.writeFileSync("./slides/slides.json", JSON.stringify({slides: []}, null, 2));
fs.copyFileSync('./utils/index.html', './docs/index.html');

const data = JSON.parse(fs.readFileSync("./package.json", "utf8"));
data.scripts["s:add"] = "node ./utils/update.js add"
data.scripts["s:del"] = "node ./utils/update.js delete"
data.scripts["s:build"] = "node ./utils/run.js build"
data.scripts["s:dev"] = "node ./utils/run.js dev"
fs.writeFileSync("./package.json", JSON.stringify(data, null, 2));