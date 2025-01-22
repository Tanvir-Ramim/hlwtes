const express = require("express");
const {
  myDayReport,
  getMonthlyAttendance,
  getMonthlyAttendanceForAll,
  delSingle,
  delMonthlyAll,
  delYearly,
  reportSave,
  updateDayReport,
  correction_request,
  createAdminAttendance,
  absent,
  getAbsent,
  updateAbsent,
} = require("../../../controller/attendance/attendController");
const { ifCache, setCache } = require("../../../../middleware/cache");
const _ = express.Router();
_.patch("/correction/:aid", correction_request);
_.patch("/absents/:leaveId", updateAbsent);
_.get("/absents", absent);
_.get("/absents/filter", getAbsent);
_.get("/monthly-all", ifCache, getMonthlyAttendanceForAll, setCache); //?month=,year=
_.get("/", myDayReport); //?id=single attendance, emp=last attendance, myAll=all my attendance, (cid && isCorrect === "a")=apply, (date, date_emp)=per date find
_.get("/monthly/:employee_id", getMonthlyAttendance); //?month=,year=
_.patch("/:employee_id", updateDayReport); //?req.body login_time, logout_time, date
// [  {
//   "login_time": "09:30",
//   "logout_time": "17:15",
//   "date": "2024-08-30"
// }]
_.delete("/monthly", delMonthlyAll); //?year= month=
_.delete("/yearly", delYearly); //?year=
_.delete("/:id", delSingle);
_.post("/new-attendance", createAdminAttendance); // create by admin
//######### save repo ######

_.post("/report/:employee_id", reportSave); // ?month= year= , req.body.leave_balance=
module.exports = _;
