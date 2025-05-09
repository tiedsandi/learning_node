const fs = require("fs");
const path = require("path");

module.exports = (relativePath) => {
  const fullPath = path.join(__dirname, "../../", relativePath);
  fs.unlink(fullPath, (err) => {
    if (err) console.error("Failed to delete file:", err);
  });
};
