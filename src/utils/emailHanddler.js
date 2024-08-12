const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,    
  secure: true,
  auth: {
    user: "just.ashish007@gmail.com",
    pass: atob("TGFkZHUhMDYyMA=="),
  },
});
transporter.verify().then(console.log).catch(console.error);

module.exports = transporter;
