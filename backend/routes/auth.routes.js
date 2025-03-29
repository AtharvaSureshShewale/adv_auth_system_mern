const express=require('express');
const {signup,login,logout,verifyEmail,forgotPassword,resetPassword,checkAuth} = require('../controllers/auth.controller');
const verifyToken = require('../middleware/verifyToken');
const router=express.Router();

//check auth
router.get('/check-auth',verifyToken,checkAuth);

//signup
router.post('/signup',signup);

//login
router.post('/login',login);

//logout
router.post('/logout',logout);

//verify-email
router.post('/verify-email',verifyEmail);

//forget password
router.post('/forgot-password',forgotPassword);

//reset-password
router.post('/reset-password/:token',resetPassword);
module.exports=router;