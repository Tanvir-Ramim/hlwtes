const express = require("express");
const att = require("./attendApi");
const _ = express.Router();
_.use("/attendance", att);

module.exports = _;
