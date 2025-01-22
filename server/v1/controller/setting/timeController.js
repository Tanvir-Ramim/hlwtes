const { Attendance_period } = require("../../../model/attendance/attendModel");
const appStatus = require("../../../utils/appStatus");
const { tryCatch } = require("../../../utils/tryCatch");

const getTime = tryCatch(async (req, res, next) => {
  const get_time = await Attendance_period.findById("66debaa61e243f0ae560e559");

  appStatus(200, get_time, req, res, next);
});

const updateTime = tryCatch(async (req, res, next) => {
  const {
    in_time,
    late_time,
    half_day_leave,
    full_day_leave,
    office_hour,
    office_close,
    office_season,
  } = req.body;
  const lib = {};
  if (in_time && in_time !== "") {
    lib.in_time = in_time;
  }
  if (late_time && late_time !== "") {
    lib.late_time = late_time;
  }
  if (half_day_leave && half_day_leave !== "") {
    lib.half_day_leave = half_day_leave;
  }
  if (full_day_leave && full_day_leave !== "") {
    lib.full_day_leave = full_day_leave;
  }
  if (office_hour && Number(office_hour) > 0) {
    lib.office_hour = Number(office_hour);
  }
   if (office_close && office_close !== "") {
     lib.office_close = office_close;
   }
   if (office_season && office_season !== "") {
     lib.office_season = office_season;
   }
  await Attendance_period.findByIdAndUpdate(
    "66debaa61e243f0ae560e559",
    {
      $set: lib,
    },
    { new: true }
  );
  appStatus(204, "", req, res, next);
});

module.exports = {
  getTime,
  updateTime,
};
