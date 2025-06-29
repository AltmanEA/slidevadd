import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const projectName = path.resolve(".").split(path.sep).pop();

createIfNotExist(`./${projectName}`);
createIfNotExist("./slides");
createIfNotExist("./slides/components");
createIfNotExist("./.github");
createIfNotExist("./.github/workflows");

// slidevadd files
fs.writeFileSync("./slides/slides.json", JSON.stringify({ slides: [] }, null, 2));
fs.copyFileSync("./slidevadd/index.html", `./${projectName}/index.html`);
fs.copyFileSync("./slidevadd/Courser.vue", `./slides/components/Courser.vue`);
fs.copyFileSync("./slidevadd/global-top.vue", `./slides/global-top.vue`);

// github workflows
const syaml = fs.readFileSync("./slidevadd/static.yml", "utf8");
const lines = syaml.split("\n");
lines[39] = `          path: './${projectName}'`;
fs.writeFileSync("./.github/workflows/static.yml", lines.join("\n"));

// package.json
const data = JSON.parse(fs.readFileSync("./package.json", "utf8"));
data.scripts["s:add"] = "node ./slidevadd/manage.js add";
data.scripts["s:del"] = "node ./slidevadd/manage.js delete";
data.scripts["s:up"] = "node ./slidevadd/manage.js up";
data.scripts["s:build"] = "node ./slidevadd/run.js build";
data.scripts["s:dev"] = "node ./slidevadd/run.js dev";
fs.writeFileSync("./package.json", JSON.stringify(data, null, 2));

// install additional node module
console.log("install node module"); 
const child = spawn("pnpm install cheerio", { shell: true, stdio: "inherit" });
child.on("close", (code) => {
  console.log(`Install process exited with code ${code}`);
})


function createIfNotExist(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
