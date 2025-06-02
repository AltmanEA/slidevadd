import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const projectName = path.resolve(".").split(path.sep).pop();

const mode = process.argv[2];
const name = process.argv[3];

if (!mode) {
  throw new Error("Mode is required");
}
if (!name) {
  throw new Error("Name is required");
}

const slidesJson = JSON.parse(fs.readFileSync("./slides/slides.json", "utf8"));
const slides = slidesJson.slides;
if (!slides.includes(name)) {
  throw new Error("Slide not found");
}

let command = "";
if (mode === "build") {
  const out = `/${projectName}/${name}`;
  fs.rmSync(`.${out}`, { recursive: true, force: true });
  fs.mkdirSync(`.${out}`);  
  // command = `pnpm build --out .${out} --base ./ ./slides/${name}.md`;
  command = `pnpm build --out ..${out} --base ${out} ./slides/${name}.md`;
}
if (mode === "dev") {
  command = "pnpm dev ./slides/" + name + ".md";
}

spawn(command, { shell: true, stdio: "inherit" });
