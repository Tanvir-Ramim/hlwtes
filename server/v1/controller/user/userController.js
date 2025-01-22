const {
  BadRequestError,
  Unauthorized,
  NotFoundError,
  InternalServerError,
} = require("../../../error/customError");
const { User } = require("../../../model/user/userModel");
const appStatus = require("../../../utils/appStatus");
const { generateToken } = require("../../../utils/token");
const { tryCatch } = require("../../../utils/tryCatch");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const { emailVerificationLink } = require("../../../utils/sendEamil");
const { Attendance } = require("../../../model/attendance/attendModel");
const { cloudinary } = require("../../../config/cloudinary");

//?### sign-up ####
const signUp = tryCatch(async (req, res, next) => {
  const user = req.body;

  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };
  let url = {};

  if (req?.file) {
    const newFile = req.file;
    const result = await cloudinary.uploader.upload(newFile.path, options);

    url = {
      url: result.url,
      public_id: result.public_id,
    };
  }

  const newUser = new User({ ...user, url });
  const saveUser = await newUser.save();
  // req.user = saveUser;
  if (!saveUser) {
    return next(new BadRequestError("Try Again"));
  }
  // return next();
  return res.status(201).json({
    success: true,
    message: "Employee  created successfully",
    data: saveUser,
  });
});

//?### login ####
const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  //########### check #################
  if (!email || !password) {
    return next(new BadRequestError("Please provide your credentials"));
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new NotFoundError("No user found. Please create an account"));
  }

  const isPasswordValid = await user.comparePassword(password, user.password);

  if (!isPasswordValid) {
    return next(new Unauthorized("No user found. Please create an account"));
  }

  //########### if verified  #########
  if (!user.isVerified) {
    const setToken = generateToken(user, "10m");
    const updateUserToken = await User.findByIdAndUpdate(
      user._id,
      { $set: { token: setToken } },
      { new: true }
    );
    req.user = updateUserToken;
    return await emailVerificationLink(req, res);
  }
  //########### active  #########
  const mx = await User.findOneAndUpdate(
    { email: email },
    { $set: { isActive: true } },
    { new: true }
  );

  return appStatus(200, mx, req, res, next);
});
//?### office-start ####
const officeStart = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  //########### check #################
  if (!email) {
    return next(new BadRequestError("Please provide your credentials"));
  }

  const user = await User.findOneAndUpdate(
    { email: email },
    { $set: { isActive: true } },
    { new: true }
  );

  //### special office ###
  const special = res.special;
  if (special === "Home") {
    req.user = user;
    return next();
  }
  // if (!user) {
  //   return next(new NotFoundError("No user found. Please create an account"));
  // }

  // const isPasswordValid = await user.comparePassword(password, user.password);

  // if (!isPasswordValid) {
  //   return next(new Unauthorized("No user found. Please create an account"));
  // }

  // req.user = user;
  // //########### if verified  #########
  // if (!user.isVerified) {
  //   return await emailVerificationLink(req, res);
  // }
  // //########### active  #########
  // await User.findOneAndUpdate(
  //   { email: email },
  //   { $set: { isActive: true } },
  //   { new: true }
  // );
  //########### if joining date does not match ##########
  const today = new Date();
  const joinDate = new Date(user.join_date);

  // Check if the user's join_date is less than or equal to today

  if (Number(joinDate) > Number(today)) {
    return appStatus(200, user, req, res, next);
  }
  //####### if office hour not start############
  // if (res.start === "no") {
  //   console.log("no");
  //   return appStatus(200, user, req, res, next);
  // }
  req.user = user;

  next();
});

//?### log-out###
const logout = tryCatch(async (req, res, next) => {
  let objectId = req.params._id;
  const { aid } = req.body;

  if (!mongoose.Types.ObjectId.isValid(objectId)) {
    objectId = new mongoose.Types.ObjectId(objectId);
  }

  const executeUser = await User.findOneAndUpdate(
    { _id: objectId, isActive: true },
    // { $set: { isActive: false } },
    { new: true } // Return the updated document
  );

  if (!executeUser) {
    return next(new BadRequestError("You are not logged in"));
  }

  //### if attendance id not found #####

  if (!aid) {
    return appStatus(204, "", req, res, next);
  }

  //####### if aid found ###############
  const now = moment().tz("Asia/Dhaka");

  let myAttendance = await Attendance.findById(aid);
  if (myAttendance.working_hours === 0) {
    myAttendance.logout_time = now;
    await myAttendance.save();
  }

  if (myAttendance && myAttendance.working_hours >= 0) {
    const lastLogEntry = myAttendance.logHistory.find(
      (entry) => entry.logout === null
    );

    if (lastLogEntry) {
      lastLogEntry.logout = now;
    }
    await myAttendance.save();
  }
  await myAttendance.calculateWorkingHours();

  await myAttendance.save();
  return appStatus(204, "", req, res, next);
});
//?#### verifyEmail ###
const verifyUser = tryCatch(async (req, res, next) => {
  const userId = req.params.verificationToken;

  const verifiedUser = await User.findOneAndUpdate(
    { _id: userId },
    { isVerified: true },
    { new: true }
  );

  if (!verifiedUser) {
    return appStatus(404, `User not found`, req, res, next);
  }

  // After successful verification, redirect to frontend login page
  res.redirect(`${process.env.CLIENT_URL}/login/reset=new_password`);
});

//?# password reset api ###
const resetPasswordRequest = async (req, res, next, user = null) => {
  try {
    const { email, phone } = req.body;

    const ifExist = user || (await User.findOne({ email, phone }));

    if (!ifExist) {
      return next(
        new NotFoundError(
          "User Not Found , Please Provide Valid Gmail and Phone number"
        )
      );
    }

    const setToken = generateToken(ifExist, "10m");

    const updateUserToken = await User.findByIdAndUpdate(
      ifExist._id,
      { $set: { token: setToken } },
      { new: true }
    );
    req.user = updateUserToken;
    next();
  } catch (error) {
    return next(new InternalServerError(`${error.message}`));
  }
};

const setNewPassword = tryCatch(async (req, res, next) => {
  const token = req.params.token;
  // const getUser = await User.findOne({ token });
  const getUser = await User.findOne({ token: token });

  if (!getUser) {
    return next(new NotFoundError("Link Already Usesd"));
  }

  const newPassword = getUser.createHashedPassword(req.body.password);

  const updatePassword = await User.findOneAndUpdate(
    // { token },
    { token: token },
    {
      token: "",
      password: newPassword,
      isVerified: true,
    },
    {
      new: true,
    }
  );
  if (!updatePassword) {
    return next(new BadRequestError("Password did not update"));
  }
  return appStatus(204, "", req, res, next);
});
//? ### end reset api ###

//?### loginSession ####

const loginSession = tryCatch(async (req, res, next) => {
  const { token } = req?.params;
  // (token);
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded) appStatus(200, decoded, req, res, next);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).send(`/login`);
    } else {
      throw error;
    }
  }
});

//?### single  user find ###
const singleUser = tryCatch(async (req, res, next) => {
  const _id = req.params._id;

  const ifUser = await User.findById(_id);

  if (!ifUser) {
    return next(new NotFoundError("User Not Exist"));
  }
  return appStatus(200, ifUser, req, res, next);
});

// get all user
const getAllUsers = tryCatch(async (req, res, next) => {
  const { department, designation, hr_year } = req.query;
  let ifUser;
  if (department === "all") {
    ifUser = await User.aggregate([
      {
        $group: {
          _id: "$department",
          totalUsers: { $sum: 1 },
        },
      },
    ]);
  } else if (
    designation &&
    designation !== "" &&
    designation !== undefined &&
    designation !== "undefined"
  ) {
    ifUser = await User.find({ designation: designation }).select(
      "name employee_id phone designation url role gender"
    );
  } else if (
    department !== "all" &&
    department !== "" &&
    department !== undefined &&
    department !== "undefined"
  ) {
    ifUser = await User.find({ department: department });
  } else {
    ifUser = await User.find().sort({ hr_end_year: Number(hr_year) });
  }

  // Send response
  return appStatus(200, ifUser, req, res, next);
});

const getCrmUsers = tryCatch(async (req, res, next) => {
  let ifUser;
  ifUser = await User.find().select("employee_id name designation email");
  // Send response
  return appStatus(200, ifUser, req, res, next);
});

//?### search  users  ###
const allUser = tryCatch(async (req, res, next) => {
  const { query, order_list, page, limit } = req.query;
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  };

  let search = {};
  let getAll;

  // Handle search query
  if (query) {
    const regexQuery = new RegExp(query, "i");
    search = {
      $or: [
        { email: { $regex: regexQuery } },
        { phone: { $regex: regexQuery } },
        { name: { $regex: regexQuery } },
        { employee_id: { $regex: regexQuery } },
      ],
    };
  }

  // Paginate the search results
  getAll = await User.paginate(search, options);

  if (getAll.docs.length === 0) {
    return next(new NotFoundError("No user"));
  }
  res.locals.data = getAll.docs;
  res.locals.pagination = {
    totalDocs: getAll.totalDocs,
    limit: getAll.limit,
    totalPages: getAll.totalPages,
    page: getAll.page,
    pagingCounter: getAll.pagingCounter,
    hasPrevPage: getAll.hasPrevPage,
    hasNextPage: getAll.hasNextPage,
    prevPage: getAll.prevPage,
    nextPage: getAll.nextPage,
  };

  next();
});

//?### single delete user###
const deleteUser = tryCatch(async (req, res, next) => {
  const _id = req.params._id;

  const executeUser = await User.findByIdAndDelete(_id);
  if (!executeUser) {
    return next(new NotFoundError("User Not Exist"));
  }

  return appStatus(204, "", req, res, next);
});

// update user
const updateUser = tryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const updates = req.body;

  // Helper function to recursively build the update object
  const buildUpdateObject = (source, target) => {
    Object.keys(source).forEach((key) => {
      if (
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        source[key] !== null
      ) {
        target[key] = target[key] || {};
        buildUpdateObject(source[key], target[key]);
      } else if (source[key] !== undefined && source[key] !== "") {
        target[key] = source[key];
      }
    });
  };

  // Find the user by ID to check if they exist
  const user = await User.findById(_id);
  if (!user) {
    return next(new NotFoundError("User Not Exist"));
  }

  const lib = {};

  // Handle file upload if applicable
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };
  if (req?.file) {
    const thumbFile = req.file;
    if (user?.url?.public_id) {
      await cloudinary.uploader.destroy(user.url.public_id, options);
    }
    const result = await cloudinary.uploader.upload(thumbFile.path, options);
    lib.url = {
      url: result.url,
      public_id: result.public_id,
    };
  }

  // Build update object dynamically
  buildUpdateObject(updates, lib);

  // Handle `web_role` and `isAdmin` logic
  if (lib.web_role) {
    lib.isAdmin = ["admin", "hr"].includes(lib.web_role);
  }

  // Update the user with validation
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { $set: lib },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    return next(new NotFoundError("Update Failed"));
  }

  appStatus(204, updatedUser, req, res, next);
});

//?### many user delete ###
const deleteMAnyUser = tryCatch(async (req, res, next) => {
  const { idList } = req.body;

  let arr = [];
  for (const _id of idList) {
    const executeUser = await User.findByIdAndDelete(_id);
    if (!executeUser) {
      return next(new NotFoundError("User Not Exist"));
    }
    arr.push(executeUser.name);
  }
  return appStatus(204, `${arr} Deleted`, req, res, next);
});

//?### update role ###
const roleUpdate = tryCatch(async (req, res, next) => {
  const { _id, role } = req.params;
  const roleUp = await User.findByIdAndUpdate(
    _id,
    { role: role },
    { new: true }
  );

  if (!roleUp) {
    return next(new BadRequestError("Failed to Update"));
  }

  appStatus(204, "", req, res, next);
});

const getHrEndBirthDay = tryCatch(async (req, res, next) => {
  const today = new Date();

  const calculateEndDate = (days) => {
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    return endDate.toISOString().split("T")[0];
  };

  const startDate = today.toISOString().split("T")[0];

  const endDateHrYear = calculateEndDate(60);
  const endDateBirthday = calculateEndDate(30);

  const hrYearEnd = await User.find({
    hr_end_year: {
      $gte: startDate,
      $lte: endDateHrYear,
    },
  }).select("name  employee_id personalEmail hr_end_year ");

  const birthdayList = await User.find({
    birthday: {
      $gte: startDate,
      $lte: endDateBirthday,
    },
  }).select("name  employee_id personalEmail birthday ");

  const data = {
    hrYearEnd,
    birthdayList,
  };
  appStatus(201, data, req, res, next);
});

module.exports = {
  signUp,
  login,
  logout,
  verifyUser,
  resetPasswordRequest,
  setNewPassword,
  loginSession,
  singleUser,
  allUser,
  deleteUser,
  deleteMAnyUser,
  roleUpdate,
  getAllUsers,
  updateUser,
  officeStart,
  getHrEndBirthDay,
  getCrmUsers,
};
