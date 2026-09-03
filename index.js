// Scirpt imports parseArgs function.
//
const { parseArgs } = require("node:util");
const fs = require("node:fs");
// Developer defines configuration for CLI flags.

const options = {
  input: {
    type: "string",
    short: "i",
  },
  output: {
    type: "string",
    short: "o",
  },
  status: {
    type: "string",
  },
};

// Scirpt parses terminal arguments.

const { values } = parseArgs({ options: options });

// script checks input presence.
if (!values.input) {
  console.error("Error: --input flags is required.");
  process.exit(1);
}

// Scirpt prints parsed object to terminal
console.log(values);

// Scirpt creates read stream from input file.
const readStream = fs.createReadStream(values.input);

// Scirpt selects target stream.
const writeStream = values.output
  ? fs.createWriteStream(values.output)
  : process.stdout;

// Scirpt connects pipe.
readStream.pipe(writeStream);
