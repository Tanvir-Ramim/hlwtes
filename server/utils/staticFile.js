const fs = require("fs").promises;
const path = require("path");

const lib = {};
lib.storePath = path.join(__dirname, "/../.store");
lib.delete = async (file) => {
  if (!file) {
    return;
  }
  if (Array.isArray(file)) {
    for (const element of file) {
      await fs.unlink(path.join(lib.storePath, element));
    }
  } else {
    await fs.unlink(path.join(lib.storePath, file));
  }
};

module.exports = lib;
