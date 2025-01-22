const express = require("express");
const {
  applyForLeave,
  getLeaveByEmployee,
  updateLeaveStatus,
  deleteLeaveApplication,
  getMonthlyLeaveRecord,
  getYearlyLeave
} = require("../../../controller/leave/applyLeaveController");
const { uploadCloudinary } = require("../../../../utils/cloudiNulter");
const { leaveValidate } = require("../../../../middleware/leaveCheck");
const _ = express.Router();
_.post(
  "/",
  uploadCloudinary.single("attachment"),
  leaveValidate,
  applyForLeave
);
_.get("/", getLeaveByEmployee); //? employee_id, employee_name
_.get("/yearly-leave", getYearlyLeave); 
_.get("/monthly", getMonthlyLeaveRecord); //? employee_id, month, year,
_.patch("/:id", updateLeaveStatus);
_.delete("/:id", deleteLeaveApplication);
module.exports = _;
