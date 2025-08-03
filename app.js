if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose = require("mongoose");
const port=8080;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utlis/ExpressError.js");
const session=require("express-session");//this session is for only devloping
const MongoStore = require("connect-mongo");//give an internet session for production
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

 
 app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const listings = require("./routes/listing.js");
const reviews=require("./routes/review.js");
const user=require("./routes/user.js");


const dburl =process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dburl);
}

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSSION STORE",err);
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() +7*24*60*1000,
        maxAge:7*24*60*1000,
        httpOnly: true,
    }
}




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());//A middleware that initializes passport
app.use(passport.session());
//Use static authenticate method of model in localStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});


// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     })

//    let registeruser=await User.register(fakeUser,"helloworld");
//    res.send(registeruser);
// })

//router using
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price:1200,
//         location:"calangute,GOa",
//         country:"India",
//     })
//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("successful test");
// })

app.all(/.*/, (req, res, next) => {
  throw new ExpressError(404,"page not found!");
});

 app.use((err,req,res,next)=>{
    console.log(err);
    const {status=500,message="something went wrong"}=err;
    res.status(status).render("error.ejs",{err});
    //  res.status(status).send(message);
 });



app.listen(port,()=>{
    console.log("app is listening");
});