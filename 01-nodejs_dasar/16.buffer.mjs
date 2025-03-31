import { Buffer } from "buffer";

const buffer = Buffer.from("sandi");
console.info(buffer);
console.info(buffer.toString());

buffer.reverse();
console.info(buffer.toString());
