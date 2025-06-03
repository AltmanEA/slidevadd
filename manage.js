import fs from "node:fs";
import path from "node:path";
import * as cheerio from 'cheerio';

try {
  const projectName = path.resolve(".").split(path.sep).pop();
  const mode = process.argv[2];
  const name = process.argv[3];

  if (!mode) throw new Error("Mode is required");
  if (mode !== "up") if (!name) throw new Error("Name is required");

  // slides json edit
  const current_slides = JSON.parse(
    fs.readFileSync("./slides/slides.json", "utf8")
  );
  if (mode === "add") {
    if (current_slides.slides.includes(name)) {
      throw new Error("Slide already exists");
    }
    current_slides.slides.push(name);
    fs.writeFileSync(`./slides/${name}.md`, ``);
  }
  if (mode === "delete") {
    if (!current_slides.slides.includes(name)) {
      throw new Error("Slide not found");
    }
    current_slides.slides = current_slides.slides.filter((s) => s !== name);
    fs.unlinkSync(`./slides/${name}.md`);
  }
  fs.writeFileSync(
    "./slides/slides.json",
    JSON.stringify(current_slides, null, 2)
  );


  const titles = current_slides.slides.map((s) => {
    try {
      return getTitleByLink(`./${projectName}/${s}/index.html`);
    } catch (e) {
      return s;
    }
  });

  const list_slides = current_slides.slides
    .map((name, index) => `${index + 1}. [${titles[index]}](./${name}/index.html)`)
    .join("\n");
  fs.writeFileSync(`./${projectName}/slides.md`, list_slides);

  console.log("Done");
} catch (e) {
  console.log(e.message);
  process.exit(1);
}

function getTitleByLink(link) {
  const fileContent = fs.readFileSync(link, "utf8");
  const $ = cheerio.load(fileContent);
  const title = $("title").text();
  return title.replace(/ - Slidev$/, "");
}