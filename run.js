import fs from "node:fs";import path from "node:path";
import { spawn } from "node:child_process";
import * as cheerio from "cheerio";

const projectName = path.resolve(".").split(path.sep).pop();

const mode = process.argv[2];
const name = process.argv[3];

if (!mode) {
  throw new Error("Mode is required");
}
if (!name) {
  throw new Error("Name is required");
}

const slides = JSON.parse(
  fs.readFileSync("./slides/slides.json", "utf8")
).slides;
const index = slides.indexOf(name);
if (index === -1) {
  throw new Error("Slide not found");
}

const out = `/${projectName}/${name}`;
let command = "";
if (mode === "build") {
  fs.rmSync(`.${out}`, { recursive: true, force: true });
  fs.mkdirSync(`.${out}`);
  command = `pnpm build --out ..${out} --base ${out} ./slides/${name}.md`;
}
if (mode === "dev") {
  command = "pnpm dev ./slides/" + name + ".md";
}

const child = spawn(command, { shell: true, stdio: "inherit" });

child.on("close", (code) => {
  if (code !== 0) {
    console.error(`Command exited with code ${code}`);
    process.exit(code);
  } else {
    if (mode === "build") {
      const title = getTitleByLink(`./${out}/index.html`);
      replaceLineInFile(`./${projectName}/slide_list.md`, index+1, `${index + 1}. [${title}](./${name}/index.html)`);
    }
  }
});

function getTitleByLink(link) {
  const fileContent = fs.readFileSync(link, "utf8");
  const $ = cheerio.load(fileContent);
  const title = $("title").text();
  return title.replace(/ - Slidev$/, "");
}

function replaceLineInFile(filePath, lineNumber, newLine) {
  const fileContent = fs.readFileSync(filePath, "utf8").split("\n");
  fileContent[lineNumber - 1] = newLine;
  fs.writeFileSync(filePath, fileContent.join("\n"));
}
