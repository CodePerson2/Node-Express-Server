var nodemailer = require("nodemailer");
var mailOptions;
var transporter;

function organizeMail(info, email, pass) {
  transporter = nodemailer.createTransport({
    host: "mailgate.sfu.ca",
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: pass,
    },
  });

  mailOptions = {
    from: email,
    to: email,
    subject: "Website contact form",
    html:
      "<div><h2>Name: " +
      info.name +
      "</h2>" +
      "<h3>Email: " +
      info.email +
      "</h3>" +
      "<p>Message: " +
      info.message +
      "</p></div>",
  };
}

module.exports = {
  info_check: function (res, info, email, pass) {
    var success = true;
    if (info.name == "" || info.email == "" || info.message == "") {
      success = false;
    }

    if (success == false) {
      res.send({ success: 0, message: "Empty field detected." });
    } else {
      organizeMail(info, email, pass);
      transporter.sendMail(mailOptions, function (error, infoRes) {
        if (error) {
          res.send({ success: 0, message: "Failed to Send." });
        } else {
          res.send({ success: 1, message: "Message Sent. &#128522" });
        }
      });
    }
  },
  bar: function () {},
};
