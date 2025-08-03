const User=require("../models/user.js");

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newuser=new User({email,username});
   const registeredUser= await User.register(newuser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
        if(err){
           return  next(err);
        }
        req.flash("success","Welcome to Wander!");
        res.redirect("/listings");
    });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl =res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return  next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
}