import process from "process";
import * as readline from "readline/promises";

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const answer = await input.question("siapa nama anda? :");

console.info(`nama saya ${answer}`);
