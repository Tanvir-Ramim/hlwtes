const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});
const quotation = async (req, res, pdfLink) => {
  try {

    const mailOptions = {
      from: req.body.email,
      to: process.env.EMAIL,
      subject: "Customer Quotation",

      html: `Name: ${req.body.name}\nAddress: ${req.body.address} \n Mobile:${req.body.phone}
             <p>Query: ${req.body.note}</p>
             <p>PDF Link: <a href="${pdfLink}">Download PDF</a></p>`,
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

module.exports = quotation;
