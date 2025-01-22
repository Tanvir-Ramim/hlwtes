const { default: isBoolean } = require("validator/lib/isBoolean");
const { IP } = require("../../../model/user/userModel");
const appStatus = require("../../../utils/appStatus");
const { tryCatch } = require("../../../utils/tryCatch");
const util = require("node:util");
const getIp = tryCatch(async (req, res, next) => {
  const get_ip = await IP.findById("66de9753f92efce44c4c0333");
  appStatus(200, get_ip, req, res, next);
});

const updateIp = tryCatch(async (req, res, next) => {
  const { ip, today_log, isStart } = req.body;

  const lib = {};
  if (util.isBoolean(isStart)) {
    lib.isStart = isStart;
  }
  if (ip && ip !== "") {
    lib.ip = ip;
  }
  if (today_log && today_log !== "") {
    lib.today_log = today_log;
  }
  await IP.findByIdAndUpdate(
    "66de9753f92efce44c4c0333",
    {
      $set: lib,
    },
    { new: true }
  );

  appStatus(204, "", req, res, next);
});
module.exports = {
  getIp,
  updateIp,
};
