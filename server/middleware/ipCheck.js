const { BadRequestError, Unauthorized } = require("../error/customError");
const { IP, User } = require("../model/user/userModel");
const appStatus = require("../utils/appStatus");
const { tryCatch } = require("../utils/tryCatch");
const moment = require("moment-timezone");
const chcek_my_ip = tryCatch(async (req, res, next) => {
  // Extract IP from request body
  const { ip } = req.body;
  //## special home office if match ####
  const now = moment().tz("Asia/Dhaka");
  const today = now.clone().startOf("day");
  const match_date = new Date();
  match_date.setUTCHours(0, 0, 0, 0);

  const user = await User.findOne({
    email: req.body.email,
    "speciacl_home.isActive": true,
    "speciacl_home.day_list": {
      $elemMatch: {
        $eq: match_date.toISOString(),
      },
    },
  });

  if (user) {
    res.logged = "Home";
    res.special = "Home";
    return next();
  }

  // Fetch the IP and office log information from the database
  const match_ip = await IP.findById("66de9753f92efce44c4c0333");

  // #### Office hour check ####
  // If office hours haven't started yet, set response to "no" and proceed to the next middleware
  if (!match_ip.isStart) {
    res.start = "no";
    return next(new Unauthorized("Office Does Not Start"));
  }

  // #### Location check for home or office ####
  // #### If IP is not from the office, set status as "Home"####
  if (match_ip.today_log !== "IP") {
    res.logged = "Home";
    return next();
  }

  // #### Office location check ####
  // #### If IP matches and the log indicates an office location, set status as "Office"
  if (match_ip.today_log === "IP" && match_ip.ip.includes(ip)) {
    res.logged = "Office";
    return next();
  }
  // If IP does not match, return an error
  else {
    return res.status(401).json({
      success: false,
      error: "Your Location Error",
    });
  }
});
//####Export the controller###
module.exports = {
  chcek_my_ip,
};
