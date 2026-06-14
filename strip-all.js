import fs from "fs";
import path from "path";
import strip from "strip-comments";

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.match(/\.(ts|tsx|js|jsx)$/)) {
      const content = fs.readFileSync(fullPath, "utf8");

      // Strip comments
      let stripped = strip(content);

      // Remove multiple empty lines that might be left after removing comments
      stripped = stripped.replace(/\n\s*\n/g, "\n\n");

      if (content !== stripped) {
        fs.writeFileSync(fullPath, stripped, "utf8");
        console.log(`Stripped comments from: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(process.cwd(), "src"));
console.log("Done stripping comments.");
