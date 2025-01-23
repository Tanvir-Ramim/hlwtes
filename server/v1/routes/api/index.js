const express = require("express");
const _ = express.Router();
const user = require("./user/userApi");
const auth = require("./user/authApi");
const setting = require("./setting/index");

const asset = require("./asset/assetApi");

const cloud = require("./cloud/cloudApi");
const local = require("./asset/assLocalApi");
const attend = require("./attendance/attendApi");
const report = require("./report/index");
const apply = require("./leave/applyApi");
const toil = require("./setting/toilApi");
const dept = require("./depT/depApi");
_.use("/auth", user);
_.use("/user", auth);
_.use("/asset", asset);
_.use("/asset-local", local);
_.use("/cloudinary", cloud);
_.use("/setting", setting);
_.use("/attendance", attend);
_.use("/report", report);
_.use("/leave-apply", apply);
_.use("/toil", toil);
_.use("/deprtment", dept);

module.exports = _;
