import zlib from "zlib";
import fs from "fs/promises";

const source = await fs.readFile("22.zlib-compress.mjs");
console.info(source.toString());

const result = zlib.gzipSync(source);

console.info(result);
console.info(result.toString());

await fs.writeFile("zlib-compress.mjs.txt", result);
