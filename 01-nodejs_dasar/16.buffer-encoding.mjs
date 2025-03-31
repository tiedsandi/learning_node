import { Buffer } from "buffer";

const buffer = Buffer.from("sandi", "utf-8");

console.info(buffer.toString());
console.info(buffer.toString("hex"));
console.info(buffer.toString("base64"));

const buffer2 = Buffer.from("c2FuZGk=", "base64");
console.info(buffer2.toString("utf-8"));
console.info(buffer2);
