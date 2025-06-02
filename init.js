import fs from "node:fs";
import path from "node:path";

const name = path.resolve(".").split(path.sep).pop();

createIfNotExist(`./${name}`);
createIfNotExist("./slides");
createIfNotExist("./.github");
createIfNotExist("./.github/workflows");

fs.writeFileSync(
  "./slides/slides.json",
  JSON.stringify({ slides: [] }, null, 2)
);
fs.copyFileSync("./slidevadd/index.html", `./${name}/index.html`);

// github workflows
const syaml = fs.readFileSync("./slidevadd/static.yml", "utf8");
const lines = syaml.split("\n");
lines[39] = `          path: './${name}'`;
fs.writeFileSync("./.github/workflows/static.yml", lines.join("\n"));


const data = JSON.parse(fs.readFileSync("./package.json", "utf8"));
data.scripts["s:add"] = "node ./slidevadd/manage.js add";
data.scripts["s:del"] = "node ./slidevadd/manage.js delete";
data.scripts["s:build"] = "node ./slidevadd/run.js build";
data.scripts["s:dev"] = "node ./slidevadd/run.js dev";
fs.writeFileSync("./package.json", JSON.stringify(data, null, 2));

function createIfNotExist(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
