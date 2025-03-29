const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto=require("crypto");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
// const {  } = require("../mailtrap/emails");
const {sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail}=require('../nodemailer/emails');

//check-auth
const checkAuth=async(req,res)=>{
    try {
        const user=await UserModel.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not Found",
            })
        }
        res.status(200).json({
            success:true,
            user
        });
    } catch (error) {
        console.log("Error in checkAuth",error);
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

//signup
const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userAlreadyExists = await UserModel.findOne({ email });

        if (userAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new UserModel({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // Ensure generateTokenAndSetCookie is properly implemented
        if (typeof generateTokenAndSetCookie === "function") {
            generateTokenAndSetCookie(res, user._id);
        } else {
            return res.status(500).json({
                success: false,
                message: "Internal server error: Token generation function is missing",
            });
        }

        try {
            await sendVerificationEmail(user.email, verificationToken);
            console.log("Verification email sent successfully!");
        } catch (emailError) {
            console.error("Error sending verification email:", emailError);
        }
        

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user: {
                ...user.toObject(),
                password: undefined,
                verificationToken: undefined, // Don't expose this in the response
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//verify-email
const verifyEmail=async(req,res)=>{
    const {code}=req.body;

    try {
        const user=await UserModel.findOne({
            verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired verification code"
            });
        }

        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined;

        await user.save();

        await sendWelcomeEmail(user.email,user.name);

        res.status(200).json({
            success:true,
            message:"Email verified succussfully",
            user:{
                ...user._doc,
                password:undefined,
            }
        })

    } catch (error) {
        
    }
};

// login 
const login = async (req, res) => {
    const {email,password}=req.body;
    try {
        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials",
            });
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"INvalid credentials",
            });
        }

        generateTokenAndSetCookie(res,user._id);

        user.lastLogin=new Date();
        await user.save();

        res.status(200).json({
            success:true,
            message:"Login Successfully",
            user:{
                ...user._doc,
                password:undefined,
            }
        });

    } catch (error) {
        console.log(`Error in login${error}`);
        res.status(400).json({
            success:false,
            message:error.message,
        });
    }
};

// logout 
const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success:true,
        message:"Logged Out Successfully",
    }); 
};

//forgotPassword
const forgotPassword=async(req,res)=>{
    const {email}=req.body;
    try {
        const user=await UserModel.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not Found",
            });
        }

        //Generate reser Token
        const resetToken=crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt=Date.now()+1*60*60*1000; // 1 hour

        user.resetPasswordToken=resetToken;
        user.resetPasswordExpiresAt=resetTokenExpiresAt;

        await user.save();

        //send email
        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            sucess:true,
            message:"Password reset link send to your email"
        });
    } catch (error) {
        console.log("Error in forgotPassword",error);
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

//resetPassword
const resetPassword=async(req,res)=>{
    try {
        const {token}=req.params;
        const {password}=req.body;

        const user=await UserModel.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()},
        });

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired reset token"
            });
        }

        //update password
        const hashedPassword=await bcrypt.hash(password,10);

        user.password=hashedPassword;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpiresAt=undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            sucess:true,
            message:"Password reset successfully",
        });
    } catch (error) {
        console.log("Error in reset Password:",error);
        res.status(400).json({
            success:false,
            message:error.message,
        });
    }
}
module.exports = { signup, login, logout,verifyEmail,forgotPassword,resetPassword,checkAuth};
