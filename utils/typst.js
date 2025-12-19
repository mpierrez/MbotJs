const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const compile = (filename, source) => {
  const tempDir = path.resolve(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const inputPath = path.join(tempDir, `${filename}.typ`);
  const outputPath = path.join(tempDir, `${filename}.png`);

  const fullSource = `
#set page(width: auto, height: auto, margin: 1cm)
#set text(font: "Roboto", size: 12pt)
${source}
    `;

  fs.writeFileSync(inputPath, fullSource.trim());

  try {
    execSync(`npx typst compile "${inputPath}" "${outputPath}" --ppi 144`, {
      stdio: "pipe",
    });
    return outputPath;
  } catch (e) {
    console.error("Typst compilation error:", e.message);
    if (e.stderr) console.error(e.stderr.toString());
    return null;
  }
};

module.exports = { compile };
