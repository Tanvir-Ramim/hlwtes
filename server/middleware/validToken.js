const jwt = require("jsonwebtoken");

const { promisify } = require("util");
const User = require("../model/userModel");

/**
 *
 * @param {check if token exist} req
 * @param {**if not token send res **} res
 * @param {decode the token }
 * @param {if valid next} next
 */

const validToken = async (req, res, next) => {
  try {
    const token = req?.cookies?.loginSession;

    if (req.user) {
      return next();
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        error: "You are not logged in",
      });
    }

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    res.status(403).json({
      status: "fail",
      error: "session expired please login again",
    });
  }
};

module.exports = validToken;
