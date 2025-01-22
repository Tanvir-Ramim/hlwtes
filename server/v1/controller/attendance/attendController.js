const moment = require("moment-timezone");
const { tryCatch } = require("../../../utils/tryCatch");
const {
  Attendance,
  Attendance_report,
} = require("../../../model/attendance/attendModel");
const { User } = require("../../../model/user/userModel");
const {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} = require("../../../error/customError");
const appStatus = require("../../../utils/appStatus");
const {
  Absent,
  Leave_apply,
  Regular_holiday,
} = require("../../../model/leave/leaveApplyModel");

//##### employee attendanceRecord eachday ###
const myDayReport = tryCatch(async (req, res, next) => {
  const {
    id,
    emp,
    myAll,
    isCorrect,
    cid,
    date,
    date_emp,
    isApply,
    isNewAdd,
    page,
    limit,
  } = req.query;

  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  };

  if (id) {
    const attendanceRecord = await Attendance.findOne({ _id: id });

    return appStatus(200, attendanceRecord, req, res, next);
  } else if (myAll) {
    const attendanceRecord = await Attendance.find({ employee_id: myAll }).sort(
      {
        createdAt: -1,
      }
    );
    return appStatus(200, attendanceRecord, req, res, next);
  } else if (isApply === "a") {
    const attendanceRecord = await Attendance.find({
      isCorrection_apply: true,
    }).sort({
      createdAt: -1,
    });
    return appStatus(200, attendanceRecord, req, res, next);
  } else if (cid && isCorrect === "a") {
    const attendanceRecord = await Attendance.find({
      employee_id: cid,
      isCorrection_apply: true,
    }).sort({
      createdAt: -1,
    });
    return appStatus(200, attendanceRecord, req, res, next);
  } else if (date && date_emp) {
    const match_date = new Date(date);
    match_date.setUTCHours(0, 0, 0, 0);

    const next_day = new Date(match_date);
    next_day.setUTCDate(match_date.getUTCDate() + 1);
    const attendanceRecord = await Attendance.findOne({
      employee_id: date_emp,
      date: {
        $gte: match_date,
        $lt: next_day,
      },
    });
    return appStatus(200, attendanceRecord, req, res, next);
  } else if (isNewAdd == "true") {
    const attendanceRecord = await Attendance.find({ isNewAdd: true });
    return appStatus(200, attendanceRecord, req, res, next);
  } else {
    const attendanceRecord = await Attendance.find({ employee_id: emp });

    const lastAttend = attendanceRecord.pop();

    return appStatus(
      200,
      { lastAttend, lastDayOffice: "Your Last Day Office Report" },
      req,
      res,
      next
    );
  }
});
//#### update#######
const updateDayReport = tryCatch(async (req, res, next) => {
  const { employee_id } = req.params;
  const {
    working_hours,
    date,
    approved_note,
    approved_status,
    login_time,
    logout_time,
  } = req.body;
  const lib = {};
  if (Number(working_hours) > 0 || working_hours) {
    lib.working_hours = working_hours;
  }

  if (approved_note) {
    lib.approved_note = approved_note;
  }
  if (approved_status) {
    lib.approved_status = approved_status;
  }
  //###### Check if record exists ######
  const attendanceRecord = await Attendance.findOneAndUpdate(
    {
      employee_id,
      date: new Date(date),
    },
    {
      $set: lib,
    },
    {
      new: true,
    }
  );

  if (!attendanceRecord) {
    return next(
      new NotFoundError("Attendance record not found for the given date")
    );
  }

  // Parse the login_time and logout_time from the request body
  // const [loginHour, loginMinute] = login_time.split(":").map(Number);
  // const [logoutHour, logoutMinute] = logout_time.split(":").map(Number);

  // // Set the login and logout times, keeping the date and adjusting the time
  // const loginDate = new Date(date);
  // loginDate.setUTCHours(loginHour, loginMinute, 0, 0); // Set the login time in UTC

  // const logoutDate = new Date(date);
  // logoutDate.setUTCHours(logoutHour, logoutMinute, 0, 0); // Set the logout time in UTC

  // // Update the attendance record's login and logout times
  // attendanceRecord.login_time = loginDate;
  // attendanceRecord.logout_time = logoutDate;

  // // Save the updated record and recalculate working hours
  // const updatedRecord = await attendanceRecord.save();
  // await updatedRecord.calculateWorkingHours();

  // Send the response
  return res.status(200).json({
    success: true,
    message: "Attendance record updated successfully",
    data: attendanceRecord,
  });
});
// correction request
const correction_request = tryCatch(async (req, res, next) => {
  const { aid } = req.params;
  const data = req.body.correction_request;
  const lib = {};
  if (aid && aid !== "") {
    lib.isCorrection_apply = true;
  }
  if (data) {
    lib.correction_request = data;
  }
  //###### Check if record exists ######
  const attendanceRecord = await Attendance.findOneAndUpdate(
    { _id: aid },
    { $set: lib },
    { new: true }
  );

  if (!attendanceRecord) {
    return next(
      new NotFoundError("Attendance record not found for the given date")
    );
  }

  // Send the response
  return res.status(200).json({
    success: true,
    message: "Attendance record updated successfully",
    data: attendanceRecord,
  });
});

//#############monthly report individual####
const getMonthlyAttendance = tryCatch(async (req, res, next) => {
  const { employee_id } = req.params;
  const { month, year } = req.query;

  // Ensure month is always two digits
  const paddedMonth = month.toString().padStart(2, "0");

  //####### check user ######
  const ifUser = await User.findOne({ employee_id });
  if (!ifUser) {
    return next(new NotFoundError("User does not exist"));
  }

  //########start and end dates of the month
  const startDate = moment(`${year}-${paddedMonth}-01`).startOf("month");
  const endDate = moment(`${year}-${paddedMonth}-01`).endOf("month");

  try {
    const attendanceRecords = await Attendance.find({
      employee_id,
      date: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    }).select("-createdAt -updatedAt -__v");

    if (!attendanceRecords.length) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found for the given month",
      });
    }

    //###########Initialize counters##########
    let totalWorkingHours = 0;
    const statusCount = {};
    const endStatusCount = {};

    // ############# calculate totals and counts ######
    attendanceRecords.forEach((record) => {
      // Handle undefined or null working_hours
      totalWorkingHours += record.working_hours || 0;

      if (record.status) {
        statusCount[record.status] = (statusCount[record.status] || 0) + 1;
      }

      if (record.end_status) {
        endStatusCount[record.end_status] =
          (endStatusCount[record.end_status] || 0) + 1;
      }
    });

    // ##### monthly report #####
    return res.status(200).json({
      success: true,
      employee_id,
      month,
      year,
      totalWorkingHours,
      statusCount,
      endStatusCount,
      leave_balance: ifUser.leave_balance,
      attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return next(new Error("Error fetching attendance records"));
  }
});

//#############monthly report individual####
const getMonthlyAttendanceForAll = tryCatch(async (req, res, next) => {
  const { month, year, page, limit } = req.query;
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    select: "employee_id name leave_balance",
  };
  const search = {};

  //#######Start and end dates#######
  const startDate = moment(`${year}-${month}-01`).startOf("month");
  const endDate = moment(`${year}-${month}-01`).endOf("month");

  //####employees' data####
  const allEmployees = await User.paginate(search, options);
  if (!allEmployees.docs.length) {
    return res.status(404).json({
      success: false,
      message: "No employees found",
    });
  }

  //##### Fetch attendance records in batch #####
  const employeeIds = allEmployees.docs.map((emp) => emp.employee_id);
  const attendanceRecords = await Attendance.find({
    employee_id: { $in: employeeIds },
    date: {
      $gte: startDate.toDate(),
      $lte: endDate.toDate(),
    },
  }).select("-createdAt -updatedAt -__v");

  //#### Prepare the result array####
  const monthlyReport = [];

  //#####Group attendance records #####
  const groupedRecords = attendanceRecords.reduce((acc, record) => {
    if (!acc[record.employee_id]) {
      acc[record.employee_id] = [];
    }
    acc[record.employee_id].push(record);
    return acc;
  }, {});

  //###### calculate their attendance####
  allEmployees.docs.forEach((employee) => {
    const records = groupedRecords[employee.employee_id] || [];

    if (records.length > 0) {
      //##### Initialize counters#####
      let totalWorkingHours = 0;
      const statusCount = {};
      const endStatusCount = {};

      //#####Calculate totals and counts#####
      records.forEach((record) => {
        totalWorkingHours += record.working_hours;

        if (statusCount[record.status]) {
          statusCount[record.status]++;
        } else {
          statusCount[record.status] = 1;
        }

        if (endStatusCount[record.end_status]) {
          endStatusCount[record.end_status]++;
        } else {
          endStatusCount[record.end_status] = 1;
        }
      });

      //#####Create the report for this employee#####
      monthlyReport.push({
        employee_id: employee.employee_id,
        name: employee.name,
        leave_balance: employee.leave_balance,
        totalWorkingHours,
        statusCount,
        endStatusCount,
        attendanceRecords: records,
      });
    }
  });

  //#####Pagination data#####
  res.locals.data = { month, year, monthlyReport };
  res.locals.pagination = {
    totalDocs: allEmployees.totalDocs,
    limit: allEmployees.limit,
    totalPages: allEmployees.totalPages,
    page: allEmployees.page,
    pagingCounter: allEmployees.pagingCounter,
    hasPrevPage: allEmployees.hasPrevPage,
    hasNextPage: allEmployees.hasNextPage,
    prevPage: allEmployees.prevPage,
    nextPage: allEmployees.nextPage,
  };

  next();
});
//###### deleting#####
const delSingle = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const del_attend = await Attendance.findByIdAndDelete(id);
  if (!del_attend) {
    return next(new NotFoundError("Error"));
  }
  appStatus(204, "", req, res, next);
});
const delMonthlyAll = tryCatch(async (req, res, next) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({
      success: false,
      message: "Month and year are required",
    });
  }

  const startDate = moment(`${year}-${month}-01`).startOf("month");
  const endDate = moment(`${year}-${month}-01`).endOf("month");

  const result = await Attendance.deleteMany({
    date: {
      $gte: startDate.toDate(),
      $lte: endDate.toDate(),
    },
  });

  if (result.deletedCount > 0) {
    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} attendance records deleted for ${month}-${year}`,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "No attendance records found for the specified month",
    });
  }
});
const delYearly = tryCatch(async (req, res, next) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({
      success: false,
      message: "Year is required",
    });
  }

  const startDate = moment(`${year}-01-01`).startOf("year");
  const endDate = moment(`${year}-12-31`).endOf("year");

  const result = await Attendance.deleteMany({
    date: {
      $gte: startDate.toDate(),
      $lte: endDate.toDate(),
    },
  });

  if (result.deletedCount > 0) {
    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} attendance records deleted for the year ${year}`,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: `No attendance records found for the year ${year}`,
    });
  }
});
//###### report save and update #####
const reportSave = tryCatch(async (req, res, next) => {
  const { employee_id } = req.params;
  const { month, year } = req.query;
  const { leave_balance } = req.body;

  //####### Check if the user exists ######
  const ifUser = await User.findOne({ employee_id }).select("leave_balance");
  if (!ifUser) {
    return next(new NotFoundError("User Not Exist"));
  }

  //######## Start and end dates of the month ########
  const startDate = moment(`${year}-${month}-01`).startOf("month");
  const endDate = moment(`${year}-${month}-01`).endOf("month");

  //######## Find attendance records for the specified month ########
  const attendanceRecords = await Attendance.find({
    employee_id,
    date: {
      $gte: startDate.toDate(),
      $lte: endDate.toDate(),
    },
  }).select("-createdAt -updatedAt -__v");

  if (!attendanceRecords.length) {
    return res.status(404).json({
      success: false,
      message: "No attendance records found for the given month",
    });
  }

  //########### Initialize counters ##########
  let totalWorkingHours = 0;
  const statusCount = {};
  const endStatusCount = {};

  // ######## Calculate totals and counts ########
  attendanceRecords.forEach((record) => {
    totalWorkingHours += record.working_hours;

    // Status count
    statusCount[record.status] = (statusCount[record.status] || 0) + 1;

    // End status count
    endStatusCount[record.end_status] =
      (endStatusCount[record.end_status] || 0) + 1;
  });

  //######## Update leave balance ########
  await User.findOneAndUpdate(
    { employee_id },
    { $set: { leave_balance } },
    { new: true }
  );

  // ######## Check if the report already exists ########
  const checkRepo = await Attendance_report.findOne({
    employee_id,
    month,
    year,
  });

  if (!checkRepo) {
    // ######## Create a new report ########
    const newAttendReport = new Attendance_report({
      employee_id,
      month,
      year,
      totalWorkingHours,
      statusCount,
      endStatusCount,
      leave_balance: ifUser.leave_balance,
      update_leave_balance: leave_balance,
      attendanceRecords,
    });

    const saveRepo = await newAttendReport.save();
    if (!saveRepo) {
      return next(new InternalServerError("Error while saving report"));
    }

    return appStatus(201, saveRepo, req, res, next);
  } else {
    // Return the existing report if already present
    return next(new BadRequestError("Report Already Exist "));
  }
});
// Admin creating attendance for employee
const createAdminAttendance = async (req, res) => {
  try {
    const {
      employee_id,
      employee_name,
      date,
      login_time,
      logout_time,
      status,
      end_status,
      isNewAdd,
    } = req.body.attendanceData;

    // Check if user exists
    const ifUser = await User.findOne({ employee_id });
    if (!ifUser) {
      return res.status(404).json({
        message: "user Not exists.",
      });
    }
    // Check if already exists
    const existingAttendance = await Attendance.findOne({
      employee_id,
      date: new Date(date).toISOString().split("T")[0],
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance for this employee on this date already exists.",
      });
    }

    // Calculate working hours
    const login = new Date(login_time);
    const logout = new Date(logout_time);
    const working_hours = (logout - login) / (1000 * 60 * 60);

    // Create attendance record
    const attendance = new Attendance({
      employee_id,
      employee_name,
      date: new Date(date),
      login_time: login,
      logout_time: logout,
      status,
      end_status,
      isNewAdd,
      logged: "Admin",
      working_hours,
      employee_ref: ifUser._id,
    });

    await attendance.save();

    res
      .status(201)
      .json({ message: "Attendance created successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error creating attendance", error });
  }
};

const absent = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now).setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(now).setUTCHours(23, 59, 59, 999);
    const users = await User.find().select("name employee_id department role");

    const results = [];

    for (const user of users) {
      const result = await generateAbsent(startOfDay, endOfDay, user);
      results.push(result);
    }

    res.status(200).json({ message: "Absent Check Complete", results });
  } catch (error) {
    res.status(500).json({ message: "Error creating attendance", error });
  }
};

// get Absent
const getAbsent = tryCatch(async (req, res, next) => {
  const { from, to, toDay, status, emp_id, department } = req.query;
  const lib = {};
  if (from) {
    const dateX = new Date(from);
    dateX.setUTCHours(0, 0, 0, 0);
    lib.date = {
      $gte: dateX,
    };
  } else if (to) {
    const dateX = new Date(to);
    dateX.setUTCHours(0, 0, 0, 0);
    lib.date = {
      $lte: dateX,
    };
  } else if (toDay) {
    const dateX = new Date(toDay);
    dateX.setUTCHours(0, 0, 0, 0);
    lib.date = dateX;
  }
  if (status) {
    lib.status = status;
  }
  if (emp_id) {
    lib.employee_id = emp_id;
  }
  if (department) {
    lib.department = department;
  }

  const findAbsent = await Absent.find(lib);
  return appStatus(200, findAbsent, req, res, next);
});

// update Absent
const updateAbsent = tryCatch(async (req, res, next) => {
  const { leaveId } = req.params;
  const { status, leaveT, approvalNote, date } = req.body;
  const lib = {};
  if (status) {
    lib.status = status;
  }
  if (leaveT) {
    lib.absent_type = leaveT;
  }
  if (approvalNote) {
    lib.note = approvalNote;
  }

  const findAbsent = await Absent.findByIdAndUpdate(
    leaveId,
    { $set: lib },
    { new: true }
  );

  if (!findAbsent) {
    return next(new NotFoundError("Try Again"));
  }
  // leave create
  const user = await User.findOne({ employee_id: findAbsent.employee_id });

  const new_leave = await Leave_apply.create({
    request_for: "Others",
    leave_type: leaveT,
    employee_ref: user._id,
    employee_name: user.name,
    employee_department: user.department,
    approval_note: approvalNote,
    employee_id: user.employee_id,
    start_date: new Date(date),
    end_date: new Date(date),
    total_days: status === "approved(full)" ? 1 : 0.5,
    approval_day: status === "approved(full)" ? 1 : 0.5,
    duration: status === "approved(full)" ? "Full Day" : "Half Day",
    status: "approved",
    status_update_date: new Date(date),
    reason: "Absent" + leaveT,

    applied_on: new Date(date),

    employee_leave_blance:
      status === "approved(full)"
        ? user.leave_balance - 1
        : user.leave_balance - 0.5,
  });
  //step 1
  await User.findOneAndUpdate(
    { employee_id: user.employee_id },
    { $set: { leave_balance: new_leave.employee_leave_blance } },
    { new: true }
  );

  return appStatus(201, new_leave, req, res, next);
});

module.exports = {
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
};

// absent function

// const generateAbsent = async (start, end, user) => {
//   try {
//     const query = {
//       employee_id: user.employee_id,
//       createdAt: { $gte: start, $lt: end },
//     };

//     const attendance = await Attendance.findOne(query);
//     // is working day from calender
//     const date = new Date(start);

//     // Get month and year
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     const userId = user._id;
//     console.log(userId);
//     // year.toString(),
//     // month.toString(),
//     const lib = {
//       month: "10",
//       year: "2024",
//       holiday_list: {
//         $elemMatch: {
//           date: date,
//           $or: [
//             {
//               $and: [
//                 { "holiday_list.user_ref": { $size: 0 } },
//                 { "holiday_list.name": { $ne: "" } },
//               ],
//             },
//             {
//               $and: [
//                 { "holiday_list.user_ref": { $not: { $size: 0 } } },
//                 { "holiday_list.user_ref": userId },
//               ],
//             },
//           ],
//         },
//       },
//     };
//     const workingDay = await Regular_holiday.findOne(lib);
//     console.log({ workingDay });
//     return;
//     if (!attendance) {
//       const newAbsent = await Absent.create({
//         ...user._doc,
//         absent_type: "absent",
//         date: start,
//       });

//       return { message: "Absent Created", user: newAbsent };
//     }

//     return { message: "Attendance Found", user };
//   } catch (error) {
//     console.error("Error in generateAbsent:", error);
//     return { message: "Error", error };
//   }
// };

// const generateAbsent = async (start, end, user) => {
//   try {
//     const query = {
//       employee_id: user.employee_id,
//       createdAt: { $gte: start, $lt: end },
//     };

//     const attendance = await Attendance.findOne(query);

//     // Convert `start` to month and year
//     const date = new Date(start);
//     const month = (date.getMonth() + 1).toString();
//     const year = date.getFullYear().toString();
//     const userId = user._id;

//     // Fetch `Regular_holiday` document by `month` and `year`
//     const workingDayDocument = await Regular_holiday.findOne({ month, year });

//     // If `Regular_holiday` document found, filter `holiday_list` based on conditions
//     const isWorkingDay = workingDayDocument
//       ? workingDayDocument.holiday_list.every((holiday) => {
//           const isSameDate = holiday.date.toISOString() === date.toISOString();
//           if (!isSameDate) return true; // Ignore non-matching dates

//           // If holiday has a name and `user_ref` is empty, it's a non-working day
//           if (holiday.name && holiday.user_ref.length === 0) return false;

//           // If holiday has a name, `user_ref` has multiple entries, and includes `userId`, it's a non-working day
//           if (
//             holiday.name &&
//             holiday.user_ref.length > 0 &&
//             holiday.user_ref.includes(userId)
//           )
//             return false;

//           // If none of the conditions apply, it's a working day
//           return true;
//         })
//       : true; // Default to working day if no holiday document is found

//     // Continue based on `isWorkingDay` result
//     if (!attendance && isWorkingDay) {
//       const newAbsent = await Absent.create({
//         ...user._doc,
//         absent_type: "absent",
//         date: start,
//       });

//       return { message: "Absent Created", user: newAbsent };
//     }

//     return { message: "Attendance Found", user };
//   } catch (error) {
//     console.error("Error in generateAbsent:", error);
//     return { message: "Error", error };
//   }
// };
const generateAbsent = async (start, end, user) => {
  try {
    // Validate input data
    if (!start || !end || !user || !user.employee_id) {
      return { message: "Invalid Input Data" };
    }

    // Query to check attendance
    const query = {
      employee_id: user.employee_id,
      createdAt: { $gte: start, $lt: end },
    };

    const attendance = await Attendance.findOne(query);

    // Convert `start` to month and year
    const date = new Date(start);
    const month = (date.getMonth() + 1).toString(); // Convert to 1-based month
    const year = date.getFullYear().toString();
    const userId = user._id;

    // Fetch `Regular_holiday` document by `month` and `year`
    const workingDayDocument = await Regular_holiday.findOne({ month, year });

    // Check if the day is a working day
    const isWorkingDay = workingDayDocument
      ? workingDayDocument.holiday_list.every((holiday) => {
          const isSameDate = holiday.date.toISOString() === date.toISOString();
          if (!isSameDate) return true; // Ignore non-matching dates

          // If holiday has a name and `user_ref` is empty, it's a non-working day
          if (holiday.name && holiday.user_ref.length === 0) return false;

          // If holiday has a name, `user_ref` includes the user, it's a non-working day
          if (
            holiday.name &&
            holiday.user_ref.length > 0 &&
            holiday.user_ref.includes(userId)
          )
            return false;

          // Otherwise, it's a working day
          return true;
        })
      : true; // Default to working day if no holiday document is found

    // If no attendance and it's a working day, create an absent record
    if (!attendance && isWorkingDay) {
      // Check if an absent record already exists for this user on this date
      const existingAbsent = await Absent.findOne({
        employee_id: user.employee_id,
        date: start,
      });

      if (existingAbsent) {
        return {
          message: "Absent Record Already Exists",
          user: existingAbsent,
        };
      }

      // Remove `_id` from user document to avoid duplicate key error
      const { _id, ...userWithoutId } = user._doc;

      // Create new absent record
      const newAbsent = await Absent.create({
        ...userWithoutId,
        absent_type: "absent",
        date: start,
      });

      return { message: "Absent Created", user: newAbsent };
    }

    return { message: "Attendance Found", user };
  } catch (error) {
    console.error("Error in generateAbsent:", error);
    return { message: "Error", error };
  }
};
