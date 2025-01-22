const jwt = require("jsonwebtoken");
const appStatus = require("./appStatus");

const generateToken = (userInfo) => {
  const payload = {
    email: userInfo.email,
    role: userInfo.role,
  };
  const expiresIn =
    userInfo.role.includes("Supper") ||
    userInfo.role.includes("Customer") ||
    userInfo.role.includes("Admin")
      ? "30m"
      : "7d";
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: expiresIn,
  });
  console.log("token", token);

  return token;
};

const isTokenExpired = (token, res) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded) {
      return appStatus(200, "Loging", decoded, res);
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.redirect(`/login`);
    } else {
      throw error;
    }
  }
};
module.exports = { generateToken, isTokenExpired };
