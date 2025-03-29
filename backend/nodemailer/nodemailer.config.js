const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP Connection Error:", error);
    } else {
        console.log("SMTP is Ready to Send Emails!");
    }
});

module.exports=transporter;