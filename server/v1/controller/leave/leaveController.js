const {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} = require("../../../error/customError");
const mongoose = require("mongoose");
const {
  Leave_type,
  Regular_holiday,
  Leave_notice_period,
} = require("../../../model/leave/leaveApplyModel");
const appStatus = require("../../../utils/appStatus");
const { tryCatch } = require("../../../utils/tryCatch");
//#################### type ##########
const updateLeaveType = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, day, provision, isFile, duration_Type } = req.body;
  const lib = {};
  lib.provision = {};
  if (name && name.trim() !== "") {
    lib.name = name;
    lib.provision.name = name;
  }
  if (day) {
    lib.day = day;
  }
  // if (provision.name) {
  //   lib.provision = { name: provision.name };
  // }
  if (duration_Type) {
    lib.duration_Type = duration_Type;
  }

  // lib.provision = { day: provision.day };
  lib.provision.day = provision.day;

  lib.isFile = isFile;

  // Find the leave type by ID and update it
  const updatedLeaveType = await Leave_type.findByIdAndUpdate(
    id,
    {
      $set: lib,
    },
    { new: true }
  );

  if (!updatedLeaveType) {
    return next(new NotFoundError("Leave Type not found"));
  }

  return appStatus(200, updatedLeaveType, req, res, next);
});

// add leave type
const addLeaveType = tryCatch(async (req, res, next) => {
  const data = req.body;
  const ifExist = await Leave_type.findOne({ name: data.name });
  if (ifExist) {
    return next(new BadRequestError("Already Exist This Type"));
  }

  const newLeaveType = await Leave_type.create(data);
  return res.status(201).json({
    success: true,
    message: "Holiday plan created successfully",
    data: newLeaveType,
  });
});

// delete
const deleteLeaveType = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLeaveType = await Leave_type.findByIdAndDelete(id);

    if (!deletedLeaveType) {
      return res.status(404).json({
        success: false,
        message: "Leave Type not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Leave Type deleted successfully",
      data: deletedLeaveType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete Leave Type",
      error: error.message,
    });
  }
};

const getLeaveTypes = tryCatch(async (req, res, next) => {
  const { isFull } = req.query;
  let leaveTypes;
  if (isFull === "Full Day" || isFull === "Half Day") {
    leaveTypes = await Leave_type.find({ duration_Type: isFull }).select(
      "-createdAt -updatedAt -__v"
    );
  } else {
    leaveTypes = await Leave_type.find().select("-createdAt -updatedAt -__v");
  }

  // if (!leaveTypes.length) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "No leave types found",
  //   });
  // }

  return appStatus(200, leaveTypes, req, res, next);
});
//########## set holiday ##############
//new
const createHolidayPlan = tryCatch(async (req, res, next) => {
  const { month, year, holiday_list } = req.body;
  //### check ##
  const ifExist = await Regular_holiday.findOne({ month, year });
  if (ifExist) {
    return next(new BadRequestError("Already Exist"));
  }
  //## new ##
  const newHolidayPlan = await Regular_holiday.create({
    month,
    year,
    holiday_list,
  });

  return res.status(201).json({
    success: true,
    message: "Holiday plan created successfully",
    data: newHolidayPlan,
  });
});
// get by year month

const getHolidayPlanByMonth = tryCatch(async (req, res, next) => {
  const { month, year, weekly, emp } = req.query;

  const lib = {};
  if (month && month.trim() !== "") {
    lib.month = month;
  }
  if (year && year.trim() !== "") {
    lib.year = year;
  }

  let holidayPlan;
  if (weekly === "true") {
    const mx = await Regular_holiday.find(lib);

    holidayPlan = mx.map((doc) => {
      let filteredHolidayList;

      if (emp) {
        const empId = new mongoose.Types.ObjectId(emp);
        filteredHolidayList = doc.holiday_list.filter((item) =>
          item.user_ref.includes(empId)
        );
      } else {
        filteredHolidayList = doc.holiday_list.filter((item) => item.user_ref);
      }

      return {
        ...doc._doc,
        holiday_list: filteredHolidayList,
      };
    });
  } else {
    holidayPlan = await Regular_holiday.find(lib);
  }

  if (!holidayPlan) {
    return next(
      new NotFoundError("No holiday plan found for the given month and year")
    );
  }

  return res.status(200).json({
    success: true,
    data: holidayPlan,
  });
});

// const getHolidayPlanByMonth = tryCatch(async (req, res, next) => {
//   const { month, year, weekly, emp } = req.query;

//   // Validate inputs
//   if (month && (isNaN(month) || month < 1 || month > 12)) {
//     return next(new BadRequestError("Invalid month provided"));
//   }

//   if (year && isNaN(year)) {
//     return next(new BadRequestError("Invalid year provided"));
//   }

//   const lib = {};
//   if (month && month.trim() !== "") {
//     lib.month = month;
//   }
//   if (year && year.trim() !== "") {
//     lib.year = year;
//   }

//   let holidayPlan;

//   // Check if weekly is requested
//   if (weekly === "true") {
//     const mx = await Regular_holiday.find(lib);

//     holidayPlan = mx.map((doc) => {
//       let filteredHolidayList;

//       // Filter based on emp (employee reference)
//       if (emp) {
//         filteredHolidayList = doc.holiday_list.filter(
//           (item) => item.user_ref === emp
//         );
//       } else {
//         filteredHolidayList = doc.holiday_list.filter((item) => item.user_ref);
//       }

//       return {
//         ...doc._doc,
//         holiday_list: filteredHolidayList,
//       };
//     });
//   } else {
//     // Regular holiday search without weekly
//     holidayPlan = await Regular_holiday.find(lib);
//   }

//   // Check if holidayPlan is an empty array
//   if (!holidayPlan || holidayPlan.length === 0) {
//     return next(
//       new NotFoundError("No holiday plan found for the given month and year")
//     );
//   }

//   // Return successful response
//   return res.status(200).json({
//     success: true,
//     data: holidayPlan,
//   });
// });

//update
const updateHolidayPlan = tryCatch(async (req, res, next) => {
  const { month, year } = req.query;
  const holiday_list = req.body;

  const updatedHolidayPlan = await Regular_holiday.findOneAndUpdate(
    { month, year },
    { holiday_list: holiday_list },
    { new: true, runValidators: true }
  );

  if (!updatedHolidayPlan) {
    return next(
      new NotFoundError("Holiday plan not found for the given month and year")
    );
  }

  return res.status(200).json({
    success: true,
    message: "Holiday plan updated successfully",
    data: updatedHolidayPlan,
  });
});
//delete
const deleteHolidayPlan = tryCatch(async (req, res, next) => {
  const { month, year } = req.query;

  const deletedHolidayPlan = await Regular_holiday.findOneAndDelete({
    month,
    year,
  });

  if (!deletedHolidayPlan) {
    return next(
      new NotFoundError("Holiday plan not found for the given month and year")
    );
  }

  return res.status(200).json({
    success: true,
    message: "Holiday plan deleted successfully",
  });
});
//########## leave notification ##############
//add period
const createLeaveNotice = async (req, res) => {
  try {
    const {
      leave_type,
      type_ref,
      notice_period_days,
      description,
      duration,
      isFile,
      duration_Type,
    } = req.body;

    const newLeaveNotice = new Leave_notice_period({
      leave_type,
      type_ref,
      notice_period_days,
      description,
      duration,
      isFile: isFile === "true" ? true : false,
      duration_Type,
    });

    const savedNotice = await newLeaveNotice.save();
    return res.status(201).json({
      success: true,
      data: savedNotice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create leave notice",
      error: error.message,
    });
  }
};
//get
const getLeaveNotices = async (req, res) => {
  try {
    const leaveNotices = await Leave_notice_period.find();
    return res.status(200).json({
      success: true,
      data: leaveNotices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve leave notices",
      error: error.message,
    });
  }
};
//patch
const updateLeaveNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { leave_type, notice_period_days, description, duration, isFile } =
      req.body;
    const lib = {};
    if (leave_type) lib.leave_type = leave_type;
    lib.duration = duration;
    lib.notice_period_days = notice_period_days;
    lib.description = description;
    if (isFile === "true") {
      lib.isFile = true;
    } else {
      lib.isFile = false;
    }
    const updatedNotice = await Leave_notice_period.findByIdAndUpdate(
      id,
      { $set: lib },
      {
        new: true,
      }
    );

    if (!updatedNotice) {
      return res.status(404).json({
        success: false,
        message: "Leave notice not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedNotice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update leave notice",
      error: error.message,
    });
  }
};

//delte
const deleteLeaveNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotice = await Leave_notice_period.findByIdAndDelete(id);

    if (!deletedNotice) {
      return res.status(404).json({
        success: false,
        message: "Leave notice not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Leave notice deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete leave notice",
      error: error.message,
    });
  }
};

module.exports = {
  addLeaveType,
  deleteLeaveType,
  updateLeaveType,
  getLeaveTypes,
  createHolidayPlan,
  getHolidayPlanByMonth,
  updateHolidayPlan,
  deleteHolidayPlan,
  createLeaveNotice,
  getLeaveNotices,
  updateLeaveNotice,
  deleteLeaveNotice,
};
