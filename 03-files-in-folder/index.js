const path = require('path');
const fs = require('fs');
const dirPath = path.join(__dirname, 'secret-folder');

fs.promises.readdir(dirPath, {withFileTypes: true})
  .then(dirents => {
    const files = dirents.filter(dir => dir.isFile());
    files.forEach(elem => {
      const [name, ext] = elem.name.split('.');
      fs.stat(path.join(__dirname, 'secret-folder', elem.name), (err, stats) => {
        console.log(`${name}-${ext}-${(stats.size/1024).toFixed(4)}kb`);
      });      
    });    
  })  
  .catch(err => {
    console.log(err);
  });