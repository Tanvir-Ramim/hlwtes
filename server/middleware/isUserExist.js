const appError = require("http-errors");
const { User } = require("../model/user/userModel");
const {
  resetPasswordRequest,
} = require("../v1/controller/user/userController");
const { generateToken } = require("../utils/token");
const { emailVerificationLink } = require("../utils/sendEamil");

const ifExist = async (req, res, next) => {
  try {
    const isUserExist = await User.findOne({ email: req.body.email });
    if (isUserExist) {
      // return res.status(409).json({
      //   success: false,
      //   message: `${
      //     isUserExist.isVerified
      //       ? "You already have an account. Please log in."
      //       : "Verify You Email"
      //   }`,
      // });
          return res.status(409).json({
        success: false,
        message: "You already have an account. Please log in.",
      });
    }
    next();
  } catch (error) {
    next(error);
    
  }
};
const isOurCustomer = async (req, res, next) => {
  try {
    let isUserExist = await User.findOne({ email: req.body.email });

    if (isUserExist) {
      req.customer_ref = isUserExist._id;
      return next();
    }
    // Creating new user if not exists
    const new_customer = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.customer_eamil,
      phone: req.body.customer_phone,
      password: req.body.email,
      confirm_pass: req.body.email,
    });

    const save_customer = await new_customer.save();
    req.customer_ref = save_customer._id;

    // Pass the newly created user
    const setToken = generateToken(save_customer, "10m");
    const updateUserToken = await User.findByIdAndUpdate(
      save_customer._id,
      { $set: { token: setToken } },
      { new: true }
    );

    req.token = updateUserToken.token;
    await emailVerificationLink(req, res);
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { ifExist, isOurCustomer };
