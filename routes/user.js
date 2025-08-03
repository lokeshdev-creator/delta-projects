const express= require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utlis/wrapAsync");
const passport=require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/user.js")
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(usercontroller.signup));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",
    savedRedirectUrl,
    passport.authenticate("local", {
        failureRedirect:'/login',
        failureFlash: true
    }),
    usercontroller.login
);

router.get("/logout",usercontroller.logout)
module.exports=router;