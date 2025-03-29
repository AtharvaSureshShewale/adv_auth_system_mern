const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config();

const generateTokenAndSetCookie=(res,userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    })

    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict", //prevents csrf
        maxAge:7*24 *60*60*10000,
        
    });

    return token;
};

module.exports=generateTokenAndSetCookie;