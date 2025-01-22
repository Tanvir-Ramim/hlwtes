const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

const mailUtils = async (req, res) => {
  let userName;
  if (req?.user) {
    userName = `${req.user.name} `;
  }
  // const verificationToken = req?.user?._id;
  const verificationToken = null;

  // const passwordResetToken = req?.token;
  const passwordResetToken = req?.user?.token;

  // Compose the verification link

  const forgetPasswordLink = `${process.env.CLIENT_URL}/login/${passwordResetToken}`;
  const verifyEmailLink = `${process.env.SERVER_URL}/leave/api/v1/auth/verify/${verificationToken}`;

  const verificationLink = verificationToken
    ? verifyEmailLink
    : forgetPasswordLink;
  const emailTemplate = `

  <head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">

        <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>

  <style type="text/css">
            #outlook a { padding: 0; }
            .ReadMsgBody { width: 100%; }
            .ExternalClass { width: 100%; }
            .ExternalClass * { line-height:100%; }
            body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
            p { display: block; margin: 13px 0; }
        </style>

        <style type="text/css">
            @media only screen and (max-width:480px) {
                @-ms-viewport { width:320px; }
                @viewport { width:320px; }
            }
        </style>




        <style type="text/css">
            .outlook-group-fix {
                width:100% !important;
            }
        </style>

  <style>                
    @media only screen and (min-width:480px) {
                .mj-column-per-100, * [aria-labelledby="mj-column-per-100"] { width:100%!important; }
            }
        </style>
</head>


<body style="background: #F9F9F9;">
  <div style="background-color:#F9F9F9;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <style type="text/css">
            html, body, * {
            -webkit-text-size-adjust: none;
            text-size-adjust: none;
            }
            a {
            color:#1EB0F4;
            text-decoration:none;
            }
            a:hover {
            text-decoration:underline;
            }
          </style>

          <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
              <tbody>
                <tr>
                  <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;width:640px;">
                          <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;		display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="width:138px;">
                                            <a href="https://weepoka.com" target="_blank">
                                              <img alt="" title="" height="" src="/image/logo.png" style="border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:38px;" width="138">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>							
                            </table>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
                  <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                  <div style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden">
                    <div style="margin:0px auto;max-width:640px;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;">
                      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
                      <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png" />
                      <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">

                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;" align="center" border="0" background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png">
                        <tbody>
                          <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="vertical-align:undefined;width:640px;">
                                    <div style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">
                                      Welcome to WeeroDigital!
                                    </div>
                                  </td>
                                </tr>
                              </table>		
                            </td>
                          </tr>
                        </tbody>
                      </table>		

                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
                  <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <div style="margin:0px auto;max-width:640px;background:#ffffff;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0">
                      <tbody>
                        <tr>
                          <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
                                  <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;" align="left">
                                        <div style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;">
                                          <h2 style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">
                                            Hey ${
                                              userName ? userName : "Visitor"
                                            },
                                          </h2>

                                          <p>
                                            Wow! Thanks for registering an account with Weepoka! You're the coolest person in all the land.
                                          </p>

                                          <h1>${
                                            verificationToken
                                              ? "Verify Your Email"
                                              : "Reset your password"
                                          }</h1>
                                          
                                        </div>
                                      </td>
                                    </tr>
                                    
                                    <tr>
                                      <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center">
                                        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0">
                                          <tbody>
                                            <tr>
                                              <td style="border:none;border-radius:3px;color:white;cursor:auto;padding:15px 19px;" align="center" valign="middle" bgcolor="#7289DA">
                                                <a href="${verificationLink}" style="text-decoration:none;line-height:100%;background:#7289DA;color:white;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px;" target="_blank">
                                                  ${
                                                    verificationToken
                                                      ? "Verify Email"
                                                      : "Reset Password"
                                                  }
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>	
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>	
                                </table>	
                              </div>	
                            </table>
                          </td>
                        </tr>
                      </tbody>	
                    </table>		
                    </div>
                </td>
              </tr>
            </table>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
                  <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <div style="margin:0px auto;max-width:640px;background:transparent;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                      <tbody>
                        <tr>
                          <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
                              <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="word-break:break-word;font-size:0px;"><div style="font-size:1px;line-height:12px;">
                                      &nbsp;
                                      </td>
                                    </tr>
                                  </tbody>	
                                </table>
                              </div>
                            </table>
                          </td>
                        </tr>
                      </tbody>	
                    </table>
                  </div>
                </td>
              </tr>

            </table>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
                  <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <div style="margin:0px auto;max-width:640px;background:transparent;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                      <tbody>
                        <tr>
                          <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
                                  <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                        <div style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">

                                          Developed by Weepoka • 
                                          <a href="https://weepoka.com/" style="color:#1EB0F4;text-decoration:none;" target="_blank">
                                            Visit Website
                                          </a> • 
                                          <a href="https://m.facebook.com/weepoka.digital/" style="color:#1EB0F4;text-decoration:none;" target="_blank">
                                            @weepoka.digital
                                          </a>
                                        </div>
                                    
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                        <div style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                            Block# C, House#2, 1 Road-2, Dhaka 1216. Contact NO: 
                                            <a href="tel:+8801606104415">01606-104415</a>
                                        </div>
                                      </td>
                                    </tr>

                                  </tbody>
                                </table>
                              </div>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>			
                </td>
              </tr>			
            </table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>

    `;

  try {
    // Email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: verificationToken ? "Email Verification" : "Forget Password",
      html: emailTemplate,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({
          status: "fail",
          error,
        });
      } else {
        if (req.url == "/login") {
          res.status(401).json({
            success: false,
            // message: " please check your email to verify",
            message: "Please Check Your Email",
          });
        } else {
          //console.log("none login");
          res.status(200).json({
            success: true,
            message: verificationToken
              ? " please check your email to verify"
              : "A confirmation message has been sent to your email",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

module.exports = { emailVerificationLink: mailUtils };
