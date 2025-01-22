const express = require("express");
const ip = require("./ipApi");
const time = require("./timeApi");
const leaveType = require("./leaveType");
const holiday = require("./holidayApi");
const noti = require("./notifyApi");
const ann = require("./annApi");
const categories=require("./categoriesApi")
const _ = express.Router();
_.use("/ip", ip);
_.use("/time", time);
_.use("/leave-type", leaveType);
_.use("/holiday", holiday);
_.use("/leave-notification", noti);
_.use("/announcement", ann);
_.use("/categories", categories);
module.exports = _;
