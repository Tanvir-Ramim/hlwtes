const express = require("express");
const {
  signUp,
  login,
  verifyUser,
  resetPasswordRequest,
  setNewPassword,
  loginSession,
  logout,
  officeStart,
} = require("../../../controller/user/userController");
const { ifExist } = require("../../../../middleware/isUserExist");
const { emailVerificationLink } = require("../../../../utils/sendEamil");
const { uploadCloudinary } = require("../../../../utils/cloudiNulter");
const { chcek_my_ip } = require("../../../../middleware/ipCheck");
const { attendance } = require("../../../../middleware/attendanceChecker");
const _ = express.Router();
_.get("/verify/:verificationToken", verifyUser);
_.get("/login-session/:token", loginSession);
_.post(
  "/sign-up",
  uploadCloudinary.single("url"),
  ifExist,
  signUp
  // emailVerificationLink
);
_.post("/login", login);
_.post("/office-start", chcek_my_ip, officeStart, attendance);
_.patch("/:_id", logout);
_.post("/reset-password-request", resetPasswordRequest, emailVerificationLink);
_.post("/set-new-password/:token", setNewPassword);
module.exports = _;
