// Scirpt imports parseArgs function.
//
const { parseArgs } = require("node:util");
const fs = require("node:fs");
const readline = require("node:readline");

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
  ["duration-gt"]: {
    type: "string",
    short: "t",
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
// console.log(values);

// Scirpt creates read stream from input file.
const readStream = fs.createReadStream(values.input);

// Scirpt selects target stream.
const writeStream = values.output
  ? fs.createWriteStream(values.output)
  : process.stdout;

// Scirpt connects pipe.
//readStream.pipe(writeStream);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

// initializes counters.
let totallines = 0;
let matchedLines = 0;

rl.on("line", (line) => {
  totallines++;
  try {
    // parses string into object.
    const logEntry = JSON.parse(line);
    // checks status condition.
    if (values.status && logEntry.status !== Number(values.status)) {
      //stops execution for this line.
      return;
    }
    // checks durationMS

    // console.log(logEntry.durationMs);
    if (
      values["duration-gt"] &&
      logEntry.durationMs <= Number(values["duration-gt"])
    ) {
      return;
    }

    matchedLines++;
    writeStream.write(line + "\n");
  } catch (error) {
    // ignores broken JSON lines
  }
});

// listens for end of file.
rl.on("close", () => {
  //prints statistics to stderr.
  console.error(`Total read: ${totallines}. Matched: ${matchedLines}.`);
  process.exit(0);
});
