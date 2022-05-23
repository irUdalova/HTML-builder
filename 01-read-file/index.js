const path = require('path');
const fs = require('fs');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

stream.on('data', chunk => console.log(chunk.trim()));
stream.on('error', error => console.log('Error', error.message));