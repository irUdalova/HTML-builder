const fs = require('fs');
const path = require('path');
const copyDir = require('../04-copy-directory');
const bundleStyles = require('../05-merge-styles');

let fileNames = [];

const srcComp = path.join(__dirname, 'components');
const srcTempl = path.join(__dirname, 'template.html');
const srcAssets = path.join(__dirname, 'assets');
const srcStyles = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist');
const destAssets = path.join(__dirname, 'project-dist','assets');
const destStyles = path.join(__dirname, 'project-dist', 'style.css');

(async function buildPage() {
  let dataTempl = await fs.promises.readFile(srcTempl, 'utf8');

  fileNames = await readComp();

  for(let elem of fileNames) {
    const templTag = `{{${elem.split('.')[0]}}}`;
    if (dataTempl.includes(templTag)) {
      const file = await fs.promises.readFile(path.join(srcComp , elem), 'utf8');
      dataTempl = dataTempl.replace(templTag, file);
    }
  }
  await fs.promises.mkdir(dest, { recursive: true });
  await fs.promises.writeFile( path.join(dest, 'index.html'), dataTempl);

  copyDir(srcAssets, destAssets);
  bundleStyles(srcStyles, destStyles);
})();

async function readComp() {
  const dirents = await fs.promises.readdir(srcComp, {withFileTypes: true});
  const files = dirents.filter(dir => {
    return dir.isFile() && path.extname(dir.name) === '.html';  
  });    
  return files.map(file => file.name);
}
