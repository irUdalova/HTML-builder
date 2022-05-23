const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const outFilePath = path.join(__dirname, 'output.txt');
const output = fs.createWriteStream(outFilePath);

stdout.write('Hello, please enter your text\n');
process.on('SIGINT', () => {
  process.exit(); 
});
process.on('exit', () => stdout.write('The process is over, goodbye\n'));

stdin.on('data', data => {  
  if (data.toString().trim().toLocaleLowerCase() === 'exit') {
    process.exit();  
  } else {
    output.write(data);
  } 
});

