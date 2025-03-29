const { response } = require('express');
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require('./emailTemplates');
const {mailtrapClient,sender}=require('./mailtrap.config');

const sendVerificationEmail=async(email,verificationToken)=>{
    const recipient=[{email}];
    try {
        const response=await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify your Email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification"
        })

        console.log("Email Send Successfully",response)
    } catch (error) {
        console.log(`Error sending verification email:${error}`)
        throw new Error(`Error sending verification email:${error}`);
    }
}

const sendWelcomeEmail=async(email,name)=>{
    const recipient=[{email}];

    try {
        const response=await mailtrapClient.send({
            from:sender,
            to:recipient,
            template_uuid:"34661167-5e25-4fc9-a119-5e2194279dbe",
        });

        console.log("Welcome Email Send Successfully",response)
    } catch (error) {
        console.log(`error in verfyingEmail:${error}`);
        throw new Error(`Error sending email:${error}`);
    }
}

const sendPasswordResetEmail=async(email,resetURL)=>{
    const recipient=[{email}];
    try {
        const response=await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Reset Your Password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category:"Password Reset",
        });

        console.log(`Reset Password Send Successfully:${response}`);
    } catch (error) {
        console.error(`error sending password reset email`,error);
        throw new Error(`Error sending password reset email${error}`);
    }
}

const sendResetSuccessEmail=async(email)=>{
    const recipient=[{email}];

    try {
        const response=await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Password Reset Successfully",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset"
        });

        console.log("Password reset email sent succussfully:",response);
    } catch (error) {
        console.log("Error in resetPassword:",error);
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

module.exports={sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail};