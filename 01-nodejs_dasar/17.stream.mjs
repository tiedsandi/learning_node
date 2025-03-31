import fs from "fs";

// const writer = fs.createWriteStream("target.log");
// writer.write("fachran\n");
// writer.write("sandi");
// writer.write("joko");
// writer.end();

const reader = fs.createReadStream("target.log", { start: 0, end: 99 });
// reader.read();

reader.addListener("data", function (data) {
  console.info(data.toString());
  // reader.close();
});

reader.on("data", (chunk) => {
  console.log("Data:", chunk.toString());
});

reader.on("end", () => {
  console.log("Reading finished.");
});

reader.on("error", (err) => {
  console.error("Error:", err.message);
});
