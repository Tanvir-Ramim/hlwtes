const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../../../config/cloudinary");
const {
  Leave_apply,
  Regular_holiday,
} = require("../../../model/leave/leaveApplyModel");
const { User } = require("../../../model/user/userModel");
const { leaveStatus } = require("../../../utils/leaveStatus");
const { NotFoundError } = require("../../../error/customError");
//apply
const applyForLeave = async (req, res) => {
  try {
    const data = req.body;
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };
    let attachment = {};

    if (req?.file) {
      const thumbFile = req.file;
      const result = await cloudinary.uploader.upload(thumbFile.path, options);

      attachment = {
        url: result.url,
        public_id: result.public_id,
      };
    }
    const Leaveapply = new Leave_apply({
      ...data,
      attachment,
      role: res.role,
      employee_leave_blance: res.leave_blance,
    });

    const savedLeave = await Leaveapply.save();
    return res.status(201).json({
      success: true,
      data: savedLeave,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to apply for leave",
      error: error.message,
    });
  }
};
// get apply
const getLeaveByEmployee = async (req, res) => {
  try {
    const { employee_id, employee_name, leave_type, status, emp, filter } =
      req.query;
    let query = {};
    if (employee_id && employee_id !== "") {
      query.employee_id = employee_id;
    }
    if (employee_name && employee_name !== "") {
      query.employee_name = employee_name;
    }
    if (leave_type && leave_type !== "") {
      query.leave_type = leave_type;
    }
    if (status && status !== "") {
      query.status = status;
    }

    if (filter === "true") {
      let mx = await Leave_apply.find(query).sort({
        createdAt: -1,
      });
      if (!mx) {
        mx = await Leave_apply.find({}).sort({
          createdAt: -1,
        });
      }

      return res.status(200).json({
        success: true,
        data: mx,
      });
    }
    let leaveApplications;
    if (emp && emp === "true") {
      const leaves = await Leave_apply.find({
        status: "approved",
        employee_id,
      }).sort({ applied_on: 1 });

      // Group the leaves by leave_type and calculate total days for each

      const leaveSummary = leaves.reduce((acc, leave) => {
        if (!acc[leave.leave_type]) {
          acc[leave.leave_type] = 0;
        }
        acc[leave.leave_type] += leave.approval_day;
        return acc;
      }, {});

      return res.status(200).json({
        leave_type,
        leaveSummary,
        message: `Total approved leave days for each type: ${JSON.stringify(
          leaveSummary
        )}`,
      });
    }

    leaveApplications = await Leave_apply.find(query).sort({
      createdAt: -1,
    });
    if (!leaveApplications || leaveApplications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No leave applications found for the given employee.",
      });
    }

    return res.status(200).json({
      success: true,
      data: leaveApplications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve leave applications",
      error: error.message,
    });
  }
};

//update apply

const updateLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, approval_day, approval_note } = req.body;
    //### check valid status ####
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values are: pending, approved, rejected",
      });
    }

    //### find leave app ####
    const leaveApp = await Leave_apply.findById(id);
    if (!leaveApp) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found.",
      });
    }
    const lib = {};
    if (approval_note) {
      lib.approval_note = approval_note;
    }
    if (approval_day || typeof approval_day === "number") {
      lib.approval_day = Number(approval_day);
    }
    if (status) {
      lib.status = status;
      lib.status_update_date = new Date();
    }

    //### update  status ####
    const updatedLeave = await Leave_apply.findByIdAndUpdate(
      id,
      { $set: lib },
      { new: true }
    );
    if (!updatedLeave) {
      return res.status(404).json({
        success: false,
        message: "Failed to update leave application.",
      });
    }

    //### check for status change ####
    if (leaveApp.status === status) {
      return res.status(400).json({
        success: false,
        message: "The leave status is already set to this value.",
      });
    }

    //### update employee leave balance if necessary ####
    let employee = await User.findOne({
      employee_id: updatedLeave.employee_id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }
    //?## con1#
    //If the status is changed to approved, deduct leave balance
    if (leaveApp.status !== "approved" && status === "approved") {
      employee = await User.findOneAndUpdate(
        { employee_id: updatedLeave.employee_id },
        {
          $inc: { leave_balance: -Number(approval_day) },
        },
        {
          new: true,
        }
      );
    }
    //?## con2#
    // If the status is changed from approved to pending or rejected, restore the leave balance
    if (
      leaveApp.status === "approved" &&
      ["pending", "rejected"].includes(status)
    ) {
      employee = await User.findOneAndUpdate(
        { employee_id: updatedLeave.employee_id },
        {
          $inc: { leave_balance: Number(leaveApp.approval_day) },
        },
        {
          new: true,
        }
      );
    }
    updatedLeave.employee_leave_blance = employee.leave_balance;
    await updatedLeave.save();
    // Send status update email (ensure employee email is set)
    if (!employee.email) {
      return res.status(500).json({
        success: false,
        message: "Employee email is missing.",
      });
    }

    await leaveStatus(req, res, next, employee.email, updatedLeave);

    // Return success response
    return res.status(200).json({
      success: true,
      data: updatedLeave,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update leave status",
      error: error.message,
    });
  }
};

//delete
const deleteLeaveApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLeave = await Leave_apply.findByIdAndDelete(id);

    if (!deletedLeave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Leave application deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete leave application",
      error: error.message,
    });
  }
};

// get monthly leave
const getMonthlyLeaveRecord = async (req, res) => {
  try {
    const { employee_id, month, year, department } = req.query;

    let query = {
      status: "approved",
    };

    if (employee_id && employee_id !== "undefined" && employee_id !== "") {
      query.employee_id = employee_id;
    }

    if (department && department !== "undefined" && department !== "") {
      query.employee_department = department;
    }

    if (month && year) {
      const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
      const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      query.start_date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const leaveApplications = await Leave_apply.find(query);

    // if (!leaveApplications || leaveApplications.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No leave applications found for the given employee.",
    //   });
    // }

    return res.status(200).json({
      success: true,
      data: leaveApplications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve leave applications",
      error: error.message,
    });
  }
};
// get yearly leave
const getYearlyLeave = async (req, res) => {
  try {
    const { employee_id, year, type } = req.query;

    const isExistUer = await User.findById(employee_id).select(
      "name employee_id department join_date hr_start_year hr_end_year"
    );

    if (!isExistUer) {
      return next(new NotFoundError("User Not Exist"));
    }

    const joinDate = new Date(isExistUer.join_date);
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const leaveApplyData = await Leave_apply.find(
      {
        status: "approved",
        employee_ref: employee_id,
        status_update_date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      {
        employee_name: 1,
        employee_ref: 1,
        employee_id: 1,
        start_date: 1,
        end_date: 1,
        leave_type: 1,
      }
    );
    const employeeId = new mongoose.Types.ObjectId(employee_id);

    const holidays = await Regular_holiday.aggregate([
      {
        $match: {
          year: year,
        },
      },
      {
        $unwind: "$holiday_list",
      },
      {
        $match: {
          $or: [
            {
              $and: [
                { "holiday_list.user_ref": { $size: 0 } },
                { "holiday_list.name": { $ne: "" } },
              ],
            },
            {
              $and: [
                { "holiday_list.user_ref": { $not: { $size: 0 } } },
                { "holiday_list.user_ref": employeeId },
              ],
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          holiday_list: { $push: "$holiday_list" },
        },
      },
      {
        $project: {
          _id: 0,
          holiday_list: 1,
        },
      },
    ]);

    if (!holidays?.length > 0 && !leaveApplyData?.length > 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }
    const combinedData = [
      ...leaveApplyData.map((leave) => ({
        type: "leave",
        start_date: leave.start_date,
        leave_type: leave.leave_type,
        end_date: leave.end_date,
      })),
      ...holidays[0].holiday_list.map((holiday) => ({
        type: "holiday",
        start_date: holiday.date,
        leave_type: holiday.name,
        end_date: holiday.date,
      })),
    ];

    let filteredData;

    if (type === "yearly") {
      filteredData = combinedData.filter(
        (item) => new Date(item.start_date) > joinDate
      );
    } else {
      filteredData = combinedData.filter(
        (item) =>
          new Date(item.start_date) > new Date(isExistUer.hr_start_year) &&
          new Date(item.start_date) < new Date(isExistUer.hr_end_year)
      );
    }

    filteredData.sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date)
    );
    return res.status(200).json({
      success: true,
      data: {
        name: isExistUer.name,
        employee_id: isExistUer.employee_id,
        department: isExistUer.department,
        leaveData: filteredData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve leave applications and holidays",
      error: error.message,
    });
  }
};

module.exports = {
  applyForLeave,
  getLeaveByEmployee,
  getYearlyLeave,
  updateLeaveStatus,
  deleteLeaveApplication,
  getMonthlyLeaveRecord,
};
