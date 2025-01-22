const express = require("express");
const {
  createLeaveNotice,
  getLeaveNotices,
  updateLeaveNotice,
  deleteLeaveNotice,
} = require("../../../controller/leave/leaveController");
const _ = express.Router();

_.post("/", createLeaveNotice);
_.get("/", getLeaveNotices);
_.patch("/:id", updateLeaveNotice);
_.delete("/:id", deleteLeaveNotice);
module.exports = _;
