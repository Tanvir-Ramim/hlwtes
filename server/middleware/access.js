const { Unauthorized } = require("../error/customError");

const authorized = (...role) => {
  return (req, res, next) => {
    const userRole = req.authorize.role;
    if (!role.includes(userRole)) {
      return next(new Unauthorized("You are not authorized to access this"));
    }

    next();
  };
};
module.exports = { authorized };
