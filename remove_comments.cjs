const fs = require('fs');
const path = require('path');

function removeComments(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeComments(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove {/* ... */} and /* ... */ 
      content = content.replace(/\{?\/\*[\s\S]*?\*\/\}?\n?/g, '');
      
      // Remove // comments (start of line)
      content = content.replace(/^\s*\/\/.*$/gm, '');
      
      // Optional: remove multiple blank lines
      content = content.replace(/\n{3,}/g, '\n\n');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

removeComments('./src');
console.log('All comments removed.');
