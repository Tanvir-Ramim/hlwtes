const express = require("express");
const { getIp, updateIp } = require("../../../controller/setting/ipController");
const _ = express.Router();
_.get("/", getIp);
_.patch("/", updateIp);
module.exports = _;
