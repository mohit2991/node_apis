const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "mohit2991kumar@gmail.com",
    pass: "lxwo yvff pgpm gmlo",
  },
});
transporter.verify().then(console.log).catch(console.error);

module.exports = transporter;
