const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");

const leaveStatus = async (req, res, next, email, data) => {
  try {
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, "../views/status.ejs"),
      { data }
    );

    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: "Application Status",
      html: emailTemplate,
    };

    // Send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    return await transporter.sendMail(mailOptions);

    // Send success response to client
  
  } catch (error) {
    // Log error
    console.error("Error sending email:", error);

    // Send error response to client
    res.status(500).json({
      status: "fail",
      error: "Error sending email",
    });
  }
};
module.exports = { leaveStatus };
