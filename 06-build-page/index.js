const fs = require('fs');
const path = require('path');
// const copyDir = require('../04-copy-directory');
// const bundleStyles = require('../05-merge-styles');

let fileNames = [];

const srcComp = path.join(__dirname, 'components');
const srcTempl = path.join(__dirname, 'template.html');
const srcAssets = path.join(__dirname, 'assets');
const srcStyles = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist');
const destAssets = path.join(__dirname, 'project-dist','assets');
const destStyles = path.join(__dirname, 'project-dist', 'style.css');

//===================Build index.html from template.html=====================

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

//===================Read files from components folder=======================

async function readComp() {
  const dirents = await fs.promises.readdir(srcComp, {withFileTypes: true});
  const files = dirents.filter(dir => {
    return dir.isFile() && path.extname(dir.name) === '.html';  
  });    
  return files.map(file => file.name);
}

//===========================Copy assets folder==============================

async function copyDir(from, to) {
  try {
    await fs.promises.rm(to, { recursive: true });
  }
  catch (err) { 
    /* continue regardless of error */
  }

  await fs.promises.mkdir(to, { recursive: true });
  const dirents = await fs.promises.readdir(from, {withFileTypes: true});

  for(let dirent of dirents) {
    if (dirent.isDirectory())  {
      const subFrom = path.join(from, dirent.name);
      const subTo = path.join(to, dirent.name);
      await copyDir(subFrom, subTo);
    } else {
      await fs.promises.copyFile(path.join(from, dirent.name), path.join(to, dirent.name));  
    }    
  }
}

//===================Build styles.css from styles folder=====================

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


