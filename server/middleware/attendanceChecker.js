const moment = require("moment-timezone");
const { tryCatch } = require("../utils/tryCatch");

const {
  Attendance,
  Attendance_period,
} = require("../model/attendance/attendModel");
const appStatus = require("../utils/appStatus");
const { Absent } = require("../model/leave/leaveApplyModel");

const attendance = tryCatch(async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const userEmployeeId = user.employee_id;
  const logged = res.logged;

  const time = await Attendance_period.findById("66debaa61e243f0ae560e559");
  const { in_time, late_time, half_day_leave, full_day_leave } = time;
  //######### convert time ############
  //#####################################
  const schedule = {
    in_time: moment.tz(in_time, "hh:mm a", "Asia/Dhaka"),
    late_time: moment.tz(late_time, "hh:mm a", "Asia/Dhaka"),
    half_day_leave: moment.tz(half_day_leave, "hh:mm a", "Asia/Dhaka"),
    full_day_leave: moment.tz(full_day_leave, "hh:mm a", "Asia/Dhaka"),
  };

  const now = moment().tz("Asia/Dhaka");
  const today = now.clone().startOf("day");
  const match_date = new Date();
  match_date.setUTCHours(0, 0, 0, 0);
  const next_day = new Date(match_date);
  next_day.setUTCDate(match_date.getUTCDate() + 1);
  //######### login new or before ############
  //#####################################

  let attendanceRecord = await Attendance.findOne({
    employee_ref: userId,
    date: {
      $gte: match_date,
      $lt: next_day,
    },
  });

  if (attendanceRecord && attendanceRecord.working_hours >= 0) {
    attendanceRecord.logHistory.push({
      login: now,
      logout: null,
    });

    // Save the updated attendance record
    await attendanceRecord.save();
  }

  if (attendanceRecord) {
    //###########if logged same day #############
    return appStatus(200, { user, aid: attendanceRecord._id }, req, res, next);
  } else {
    //###########new logged  #############
    attendanceRecord = new Attendance({
      employee_name: user.name,
      employee_ref: userId,
      employee_id: userEmployeeId,
      date: now.toDate(),
      login_time: now.toDate(),
      logged: logged,
    });

    await attendanceRecord.save();
  }
  //############# update status ########

  //#####################################
  const login_time = moment(attendanceRecord.login_time).tz("Asia/Dhaka");

  let attendanceStatus = "";
  if (login_time.isSameOrBefore(schedule.in_time)) {
    attendanceStatus = "regular office";
  } else if (login_time.isSameOrBefore(schedule.late_time)) {
    attendanceStatus = "regular office";
  } else if (login_time.isBefore(schedule.half_day_leave)) {
    attendanceStatus = "late";
  } else if (login_time.isBefore(schedule.full_day_leave)) {
    attendanceStatus = "halfday absent";
  } else {
    attendanceStatus = "fullday absent";
  }

  attendanceRecord.status = attendanceStatus;
  await attendanceRecord.save();
  //############# check leave schema ########
  const newDate = new Date();
  newDate.setUTCHours(0, 0, 0, 0);
  await Absent.findOneAndUpdate(
    {
      employee_id: userEmployeeId,
      date: newDate,
      status:"pending"
    },
    {
      status: "late_logged",
      login_status: {
        status: attendanceStatus,
        time: new Date(),
      },
    },
    { new: true }
  );

  //#####################################
  return appStatus(200, { user, aid: attendanceRecord._id }, req, res, next);
  // return res.status(200).json({
  //   success: true,
  //   message: "Attendance status calculated",
  //   login_time: login_time.format("YYYY-MM-DD hh:mm A"),
  //   attendance_status: attendanceStatus,
  //   attendance: attendanceRecord,
  // });
});

module.exports = { attendance };
