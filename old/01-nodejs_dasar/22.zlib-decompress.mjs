import zlib from "zlib";
import fs from "fs/promises";

const source = await fs.readFile("zlib-compress.mjs.txt");
console.info(source.toString());

const result = zlib.unzipSync(source);
console.info(result.toString());
