const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

async function secretEmail(email, data) {
  const emailTemplate = await ejs.renderFile(
    path.join(__dirname, "../views/auth.ejs"),
    { data }
  );

  // Email content
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Admin secretEmail",
    html: emailTemplate,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email sending failed:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = { secretEmail };
