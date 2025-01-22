const express = require("express");
const {
  getTime,
  updateTime,
} = require("../../../controller/setting/timeController");
const _ = express.Router();
_.get("/", getTime);
_.patch("/", updateTime);
module.exports = _;
