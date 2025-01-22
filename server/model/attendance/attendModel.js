const mongoose = require("mongoose");

const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const AttendanceSchema = new Schema(
  {
    employee_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employee_id: {
      type: String,
      required: true,
    },
    employee_name: {
      type: String,
      default: "",
    },
    approved_status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
    approved_note: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    correction_request: Object,
    correction_date: {
      type: Date,
      default: null,
    },
    isCorrection_apply: {
      type: Boolean,
      default: false,
    },
    isNewAdd: {
      type: Boolean,
      // default: false,
    },
    login_time: {
      type: Date,
      required: true,
    },
    logout_time: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["regular office", "late", "halfday absent", "fullday absent"],
    },
    end_status: {
      type: String,
      enum: ["early end", "regular end", "overtime"],
    },
    logged: {
      type: String,
      enum: ["Office", "Home", "Admin"],
    },
    working_hours: {
      type: Number,
      default: 0,
    },
    over_time: {
      type: Number,
      default: 0,
    },
    logHistory: [
      {
        login: Date,
        logout: Date,
        duration: Number,
      },
    ],
    break_list: [
      { reason: String, hour: Number, start_time: Date, end_time: Date },
    ],
  },
  {
    timestamps: true,
  }
);

//############## break hour count ###################
const role = new Schema(
  {
    in_time: { type: String, required: true },
    late_time: { type: String, required: true },
    half_day_leave: { type: String, required: true },
    full_day_leave: { type: String, required: true },
    office_hour: { type: Number, default: 9 },
    office_close: { type: String, required: true },
    office_season: { type: String, enum: ["Summer", "Winter", "Special"] },
  },
  {
    timestamps: true,
  }
);

//############## working hour count ###################
AttendanceSchema.methods.calculateWorkingHours = async function () {
  const AttendancePeriod = mongoose.model("Attendance_period");
  const attendancePeriodData = await AttendancePeriod.findById(
    "66debaa61e243f0ae560e559"
  );

  if (this.login_time && this.logout_time) {
    const logoutTime = new Date(this.logout_time);
    const loginTime = new Date(this.login_time);

    const diffMs = logoutTime - loginTime;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    this.working_hours = totalHours + totalMinutes / 100;

    // const hours = (this.logout_time - this.login_time) / (1000 * 60 * 60);
    // this.working_hours = Math.round(hours * 100) / 100;

    this.end_status =
      this.working_hours === attendancePeriodData.office_hour
        ? "regular end"
        : this.working_hours > attendancePeriodData.office_hour
        ? "overtime"
        : "early end";

    this.over_time = this.working_hours > attendancePeriodData.office_hour ? this.working_hours - attendancePeriodData.office_hour : 0;
  }

  // Calculate duration for each logHistory entry
  this.logHistory.forEach((log) => {
    if (log.login && log.logout) {
      const durationHours = (log.logout - log.login) / (1000 * 60 * 60);
      log.duration = Math.round(durationHours * 100) / 100;
    }
  });
};

// toil
const toilSchema = new Schema(
  {
    employee_id: { type: String, required: true },
    employee_name: { type: String, required: true },
    earn_toil: { type: Number, required: true },
    toil_title: { type: String, required: true },

    toil_description: { type: String },
    toil_start_date: { type: Date, required: true },
    expiry_date: { type: Date },
    status: {
      type: String,
      enum: ["pending", "approved", "used", "expired"],
      default: "pending",
    },

    used_toil: { type: Number, default: 0 },
    remaining_toil: {
      type: Number,
      default: function () {
        return this.earn_toil;
      },
    },
  },
  {
    timestamps: true,
  }
);

const historySchema = new Schema(
  {
    employee_id: String,
    month: String,
    year: String,
    totalWorkingHours: Number,
    leave_balance: Number,
    update_leave_balance: Number,
    statusCount: Object,
    endStatusCount: Object,
    attendanceRecords: [Object],
  },
  {
    timestamps: true,
  }
);

historySchema.plugin(mongoosePaginate);

//########## attendance Rule #############
const attendanceRuleSchema = new mongoose.Schema({
  office_start_time: {
    type: String,
    default: "09:00",
    required: true,
  },
  office_end_time: {
    type: String,
    default: "18:00",
    required: true,
  },
  late_after_time: {
    type: String,
    default: "10:00",
    required: true,
  },
  late_penalties: [
    {
      late_days: {
        type: Number,
        required: true,
      },
      penalty: {
        type: String,
        required: true,
        enum: ["1 day leave", "1 day leave & 1 day absent", "3 days absent"],
      },
    },
  ],
  half_day_time: {
    type: String,
    default: "12:00",
    required: true,
  },
  full_day_time: {
    type: String,
    default: "13:00",
    required: true,
  },
  leave_limits: {
    permanent_employee: {
      type: Number,
      default: 4,
      required: true,
    },
    intern_employee: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  salary_deduction_for_late: {
    late_days: {
      type: Number,
      default: 3,
      required: true,
    },
    deduction_amount: {
      type: String,
      default: "1 day salary deducted",
      required: true,
    },
  },
});
module.exports = {
  Attendance: mongoose.model("Attendance", AttendanceSchema),
  Attendance_period: mongoose.model("Attendance_period", role),
  Attendance_report: mongoose.model("Attendance_report", historySchema),
  Attendance_rule: mongoose.model("Attendance_rule", attendanceRuleSchema),
  Toil: mongoose.model("Toil", toilSchema),
};
