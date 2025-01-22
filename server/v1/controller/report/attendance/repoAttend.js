const { NotFoundError } = require("../../../../error/customError");
const moment = require("moment-timezone");
const {
  Attendance_report,
  Attendance,
} = require("../../../../model/attendance/attendModel");
const appStatus = require("../../../../utils/appStatus");
const { tryCatch } = require("../../../../utils/tryCatch");
const { User } = require("../../../../model/user/userModel");

const reportMonthlySingle = tryCatch(async (req, res, next) => {
  const { employee_id, month, year, page, limit } = req.query;
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  };
  const lib = {};
  if (employee_id && employee_id.trim() !== "") {
    lib.employee_id = employee_id;
  }
  if (month && month.trim() !== "") {
    lib.month = month;
  }
  if (year && year.trim() !== "") {
    lib.year = year;
  }

  const res_data = await Attendance_report.paginate(lib, options);
  if (res_data.docs.length < 1) {
    return next(new NotFoundError("Info Not Found"));
  }

  //#####Pagination data#####
  let data = res_data.docs;
  let pagination = {
    totalDocs: res_data.totalDocs,
    limit: res_data.limit,
    totalPages: res_data.totalPages,
    page: res_data.page,
    pagingCounter: res_data.pagingCounter,
    hasPrevPage: res_data.hasPrevPage,
    hasNextPage: res_data.hasNextPage,
    prevPage: res_data.prevPage,
    nextPage: res_data.nextPage,
  };

  appStatus(202, { pagination, responseData: data }, req, res, next);
});
//##### delete
const delAttendRepo = tryCatch(async (req, res, next) => {
  const { employee_id, month, year } = req.params;
  const checkRepo = await Attendance_report.findOneAndDelete({
    employee_id,
    month,
    year,
  });

  if (!checkRepo) {
    return next(new BadRequestError("Not Deleted"));
  }

  appStatus(204, "", req, res, next);
});

// get daily attendance report
const getDailyAttendanceReport = tryCatch(async (req, res, next) => {
  const { dpt } = req.query;
  const now = moment().tz("Asia/Dhaka");

  const match_date = new Date();
  match_date.setUTCHours(0, 0, 0, 0);
  const next_day = new Date(match_date);
  next_day.setUTCDate(match_date.getUTCDate() + 1);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const matchUser = await User.find({
    department: dpt,
    login_access: true,
    join_date: { $lte: today },
  }).select("name employee_id");

  const employeeIds = matchUser.map((user) => user.employee_id);

  const attendanceRecords = await Attendance.find({
    employee_id: { $in: employeeIds },
    date: {
      $gte: match_date,
      $lt: next_day,
    },
  }).select("employee_id employee_name login_time logout_time logged");

  const absentRecord = await Attendance.find({
    $or: [
      { employee_id: { $nin: employeeIds } }, // Employee IDs not in the provided list
      {
        date: {
          $lt: match_date, // Date is before match_date
          $gte: next_day, // OR date is after or on next_day
        },
      },
    ],
  }).select("employee_id employee_name login_time logout_time logged");

  // Send the response with status 200
  appStatus(200, { attendanceRecords, matchUser }, req, res, next);
});

module.exports = {
  reportMonthlySingle,
  delAttendRepo,
  getDailyAttendanceReport,
};
