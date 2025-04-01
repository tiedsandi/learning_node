import util from "util";

const nama = "sandi";

console.info(util.format("nama : %s", nama));
console.info(`nama : ${nama}`);

const person = { firstName: "Fachran", lastName: "Sandi" };
console.info(util.format("Person : %j", person));
console.info(`Person : ${JSON.stringify(person)}`);
