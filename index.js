const fs = require('fs');
const path = require('path');
const { createREADME, model } = require('./ai');
const version = 0.1;
var readmeFileName = 'generatedFile.md';

//generating the file path for the AI generated readme file
var generatedFilePath = path.join(__dirname, readmeFileName);

//checks for command line arguments
if (process.argv.includes('--help') || process.argv.includes('--h')) {
  console.log(`
Usage: node index.js [options] [file]

Options:
--version, --v     Show the current version of the program.
--model, --m       Display the model being used for the README generation.
<filename> --o     Specify the output file name for the generated README.
--help, --h        Show help information.

Positional Arguments:
file               The file for which you want to generate the README. Make sure to specify the file path or put the file in this directory.

Examples:
node index.js example.js                  Generates a README for example.js.
node index.js --version                   Displays the current version.
node index.js --model                     Displays the current model.
node index.js example.js --o myReadme.md  Generates a README and saves it as myReadme.md.
node index.js --help                      Shows help information.
  `);
}

if (process.argv.includes('--version') || process.argv.includes('--v')) {
    console.log("version: " + version);
} 

if (process.argv.includes('--model') || process.argv.includes('--m')) {
  console.log("model: " + model);
} 

if (process.argv.includes('--o')) {
  const outputIndex = process.argv.indexOf('--o') + 1;

  if (outputIndex < process.argv.length) {
      readmeFileName = process.argv[outputIndex];
      generatedFilePath = path.join(__dirname, readmeFileName);
      console.log("Output file set to: " + readmeFileName);
  } else {
      console.error("Error: No file name specified after --o");
      process.exit(1);
  }
}

//finds the file name argument 
let fileNames = [];
let fileContents = [];
for (let i = 2; i < process.argv.length; i++) {
    if (!process.argv[i].startsWith('--') && process.argv[i-1] !== '--o') {
        fileNames.push(process.argv[i]);
        
    }
}

if (fileNames.length > 0) {

  for (let fileName of fileNames){
    let filePath = path.join(__dirname, fileName);

    //checks if the specified file on the command line exists
    if (fs.existsSync(filePath)) {
        console.log(`Running file: ${fileName}`);
        fileContents.push(fs.readFileSync(filePath, 'utf8'));
    }
    else{
      console.error(`Error: File ${fileName} not found`);
      process.exit(1);
    }

  }

  //calling createREADME from ai.js to generate a README file
  createREADME(fileContents, fileNames)
  .then((readmeContent) => {
    console.log("Successfully generated README, check " + readmeFileName + " in this directory for your new README file.");
    fs.writeFileSync(generatedFilePath, readmeContent, 'utf8');
  })
  .catch((error) => {
    console.error("Error generating README:", error);
  });
} 

if (process.argv.length == 2){
    console.log("Hi! Welcome to Auto-ReadMe. For help, run this command: node index.js --h. Enjoy!");
}
