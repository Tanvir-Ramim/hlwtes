const express = require("express");
const { getLeaveTypes, updateLeaveType,addLeaveType, deleteLeaveType} = require("../../../controller/leave/leaveController");
const _ = express.Router();

_.post("/", addLeaveType);
_.patch("/:id", updateLeaveType);
_.delete("/:id", deleteLeaveType);
_.get("/", getLeaveTypes);
module.exports = _;
