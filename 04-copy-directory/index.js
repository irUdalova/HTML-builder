const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

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

copyDir(src, dest);

module.exports = copyDir;