const express = require("express");
const { ifCache, setCache } = require("../../../../middleware/cache");
const {
  delAttendRepo,
  reportMonthlySingle,
  getDailyAttendanceReport
} = require("../../../controller/report/attendance/repoAttend");

const _ = express.Router();

_.get("/", reportMonthlySingle);
_.get("/daily-attendance", getDailyAttendanceReport); //query dpt=  
_.delete("/:employee_id/:month/:year", delAttendRepo);


module.exports = _;
