import process, { exitCode } from "process";

process.addListener("exit", (exitCode) => {
  console.info(`NodeJs exit with code ${exitCode}`);
});

console.info(process.version);
console.info(process.argv);
console.info(process.report);
console.info(process.env);

process.exit(1);

console.info("Not printed because already exit");
