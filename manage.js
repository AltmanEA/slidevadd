import fs from "node:fs";

try {
  const mode = process.argv[2];
  const name = process.argv[3];

  if (!mode) {
    throw new Error("Mode is required");
  }
  if (!name) {
    throw new Error("Name is required");
  }

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

  const list_slides = current_slides.slides
    .map((name, index) => `${index + 1}. [${name}](./${name}/index.html)`)
    .join("\n");
  fs.writeFileSync(
    "./slides/slides.json",
    JSON.stringify(current_slides, null, 2)
  );
  fs.writeFileSync(`./${current_slides.name}/slides.md`, list_slides);
  console.log("Slide added:", name);
} catch (e) {
  console.log(e.message);
  process.exit(1);
}
