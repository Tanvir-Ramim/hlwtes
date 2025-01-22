const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});
const queryy = async (req, res) => {
  try {
    const mailOptions = {
      from: req.body.email,
      to: process.env.EMAIL,
      subject: "Customer Query",
      text: `Name: ${req.body.first} ${req.body.last}\nQuery: ${req.body.details}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Log success

    // Send success response to client
    res.status(200).json({
      status: "Success",
      message: "Email sent successfully",
    });
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
module.exports = queryy;
