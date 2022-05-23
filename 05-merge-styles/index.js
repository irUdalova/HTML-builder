const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleStyles(from, to) {  
  const dirents = await fs.promises.readdir(from, {withFileTypes: true});
  const files = dirents.filter(dir => {
    return dir.isFile() && path.extname(dir.name) === '.css';  
  });  
  const output = fs.createWriteStream(to);
  files.forEach((file, i) => {
    const input = fs.createReadStream(path.join(from, file.name), 'utf-8');
    const end = i === files.length - 1;
    input.pipe(output, {end});
  });
} 

bundleStyles(src, dest);

module.exports = bundleStyles;

