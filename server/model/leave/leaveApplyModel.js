const mongoose = require("mongoose");
const { Schema } = mongoose;

const leaveTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    duration_Type: {
      type: String,
      enum: ["Full Day", "Half Day"],
      default: "Full Day",
    },
    provision: {
      name: {
        type: String,
        default: "",
      },
      day: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const regular_holidy = new Schema({
  month: {
    type: String,
  },
  year: {
    type: String,
  },
  holiday_list: [
    {
      date: Date,
      name: String,
      user_ref: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  ],
});

const leaveNoticeSchema = new Schema(
  {
    leave_type: { type: String },
    notice_period_days: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    isFile: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// const RemainingLeaveSchema= new mongoose.Schema({
//   employee_ref: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//    total_Leave:{
//     type: Number,
//     default: 0,
//    },
//    remaining_Total_Leave:{
//     type: Number,
//     default: 0,
//    },
//    remaining_Others_Leave:
// })

const LeaveApplySchema = new mongoose.Schema({
  request_for: {
    type: String,
    enum: ["Own", "Others"],
    default: "Others",
  },
  leave_type: {
    type: String,

    required: true,
  },
  employee_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  employee_name: {
    type: String,
    required: true,
  },
  employee_department: {
    type: String,
    required: true,
  },
  approval_note: {
    type: String,
    default: "",
  },
  employee_id: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  total_days: {
    type: Number,
    required: true,
  },
  approval_day: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    enum: ["Full Day", "Half Day"],
    default: "Full Day",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  status_update_date: { type: Date, default: null },
  reason: {
    type: String,
    maxlength: 500,
  },
  attachment: { url: String, public_id: String },

  applied_on: {
    type: Date,
    default: Date.now,
  },
  role: Object,
  employee_leave_blance: Number,
});

// absent

const absentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employee_id: {
      type: String,
      required: true,
      // unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    absent_type: { type: String },
    note: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "approved(full)",
        "approved(half)",
        "cancel",
        "leave_applied",
        "late_logged",
      ],
    },
    login_status: {
      status: String,
      time: Date,
    },
    leave_apply_status: {
      application_ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leave_apply",
      },
      apply_date: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

//####### pre function ############
regular_holidy.pre("save", function (next) {
  this.holiday_list.forEach((it) => {
    if (typeof it.date === "string") {
      it.date = new Date(it.date);
    }
  });

  next();
});
module.exports = {
  Leave_apply: mongoose.model("Leave_apply", LeaveApplySchema),
  Leave_type: mongoose.model("Leave_type", leaveTypeSchema), //setting
  Regular_holiday: mongoose.model("Regular_holiday", regular_holidy), //setting
  Leave_notice_period: mongoose.model("Leave_notice_period", leaveNoticeSchema), //setting
  Absent: mongoose.model("Absent", absentSchema),
};
