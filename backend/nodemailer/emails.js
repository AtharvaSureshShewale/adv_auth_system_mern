const { VERIFICATION_EMAIL_TEMPLATE,WELCOME_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } = require('./emailTemplates');
const dotenv=require('dotenv');
const transporter=require('./nodemailer.config');

dotenv.config();

const sendVerificationEmail=async(email,verificationToken)=>{
    try {
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Verify your Email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification"
        }

        await transporter.sendMail(mailOptions);
        
        console.log("Mail send successfully");
    } catch (error) {
        console.log(`Error sending verification email:${error}`)
        throw new Error(`Error sending verification email:${error}`);
    }
}

const sendWelcomeEmail=async(email,name)=>{
    try {
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome Email",
            html:WELCOME_EMAIL_TEMPLATE.replace("{userName}",name),
            category:"Welcomeing Email"
        }

        await transporter.sendMail(mailOptions);
        
        console.log("Welcome Email Send Successfully");
    } catch (error) {
        console.log(`Error sending verification email:${error}`)
        throw new Error(`Error sending verification email:${error}`);
    }
}

const sendPasswordResetEmail=async(email,resetURL)=>{
    try {
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Reset Your Password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category:"Welcomeing Email"
        }

        await transporter.sendMail(mailOptions);
        
        console.log(`Reset Password Send Successfully`);
    } catch (error) {
        console.error(`error sending password reset email`,error);
        throw new Error(`Error sending password reset email${error}`);
    }
}

const sendResetSuccessEmail=async(email)=>{
    try {
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Password Reset Successfully",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset"
        }

        await transporter.sendMail(mailOptions);
        
        console.log("Password reset email sent succussfully");
    } catch (error) {
        console.error(`Error in resetPassword:`,error);
        throw new Error(`Error in resetPassword:${error}`);
    }
}


module.exports={sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail};