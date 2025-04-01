import { Console } from "console";
import fs from "fs";

const logFile = fs.createWriteStream("application.log");

const log = new Console({
  stdout: logFile,
  stderr: logFile,
});

log.info("hello world!");
log.error("ups");

const person = {
  firstName: "fachran",
  lastName: "sandi",
};

log.table(person);
