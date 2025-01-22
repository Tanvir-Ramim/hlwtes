const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const bcrypt = require("bcryptjs");

const myLeave = {
  casual_leave: { type: Number, default: 10 },
  sick_leave: { type: Number, default: 10 },
  paternity_leave: { type: Number, default: 7 },
  maternity_leave: { type: Number, default: 90 },
};
const prevLeave = {
  hr_year: { type: Date, default: null },
  casual_leave: { type: Number, default: 0 },
  sick_leave: { type: Number, default: 0 },
  paternity_leave: { type: Number, default: 0 },
  maternity_leave: { type: Number, default: 0 },
};

const provisionLeave = {
  casual_leave: { type: Number, default: 3 },
  sick_leave: { type: Number, default: 1 },
};
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    employee_id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    personalEmail: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    marital_status: {
      type: String,
      enum: ["Married", "Single"],
    },
    qualification: {
      type: Object,
    },
    phone: {
      type: String,
      maxlength: 15,
    },
    department: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    job_type: {
      type: String,
      default: "onsite",
      enum: ["onsite", "remote", "hybrid"],
    },
    web_role: {
      type: String,
      enum: ["employee", "hr", "admin"],
      default: "employee",
    },
    role: {
      type: String,
      required: true,
    },
    join_date: {
      type: Date,
      required: true,
    },
    permanent_date: {
      type: Date,
      required: true,
    },
    url: {
      url: String,
      public_id: String,
    },
    total_leaves: {
      type: Number,
      default: 20,
    },
    leave_balance: {
      type: Number,
      default: 20,
    },
    hr_leave: myLeave,
    prev_leave: prevLeave,
    provision_leave: provisionLeave,
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: "",
    },
    confirm_pass: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // HR-related fields
    hr_start_year: {
      type: Date,
    },
    hr_end_year: {
      type: Date,
    },
    job_title: {
      type: String,
      default: "",
      maxlength: 100,
    },
    salary: {
      type: Number,
      default: 0,
    },
    employment_status: {
      type: String,
      enum: ["permanent", "contract", "intern"],
      default: "permanent",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    speciacl_home: {
      // special home office
      isActive: { type: Boolean, default: false },
      day_list: [{ type: Date, default: null }],
    },
    login_access: {
      type: Boolean,
      default: false,
    },
    emergency_contact: {
      name: {
        type: String,
        maxlength: 100,
      },
      relationship: {
        type: String,
        maxlength: 50,
      },
      phone: {
        type: String,
        maxlength: 15,
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    nid: {
      type: String,
      default: "",
    },
    birthday: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);

userSchema.pre("save", function (next) {
  if (this.password === this.confirm_pass) {
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashedPassword;
    this.confirm_pass = "";
    next();
  } else {
    next(new Error("Passwords do not match"));
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Method to create a hashed password
userSchema.methods.createHashedPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};
//############ ip model ##########
const ipSchema = new Schema(
  {
    ip: { type: Array },
    today_log: {
      type: String,
      enum: ["IP", "Home"],
    },
    isStart: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

//############ announcement model ##########
const annSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    posted_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target_single_employee_id: {
      type: String,
      default: "",
    },
    audience: {
      type: [String],
      default: ["all"],
    },
    importance: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    announcement_type: {
      type: String,
      enum: ["general", "urgent", "event"],
      default: "general",
    },
    expiration_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
//############ department  model ##########

const depSchema = new Schema(
  {
    name: String,
    description: {
      type: String,
      default: "",
    },
    head_of_department: {
      type: String,

      default: "",
    },
  },
  { timestamps: true }
);
module.exports = {
  User: mongoose.model("User", userSchema),
  IP: mongoose.model("IP", ipSchema),
  Announce: mongoose.model("Announce", annSchema),
  Department: mongoose.model("Department", depSchema),
};
