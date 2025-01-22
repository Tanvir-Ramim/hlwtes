const express = require("express");
const {
  createHolidayPlan,
  getHolidayPlanByMonth,
  updateHolidayPlan,
  deleteHolidayPlan,
} = require("../../../controller/leave/leaveController");
const _ = express.Router();
_.post("/", createHolidayPlan);
_.get("/", getHolidayPlanByMonth); //?year= month = emp=_id
_.patch("/", updateHolidayPlan); //?year= month =
_.delete("/", deleteHolidayPlan); //?year= month =
module.exports = _;
