const Listing = require("./models/listing")
const ExpressError=require("./utlis/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review=require("./models/review.js");

module.exports.isLOggedin =(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirecturl=req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
       return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl=(req,res,next)=>{
    console.log(req.session.redirecturl);
    if(req.session.redirecturl){
        res.locals.redirectUrl=req.session.redirecturl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
      let {id}=req.params;
    let listing = await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","you are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing =(req,res,next)=>{
 let {error}= listingSchema.validate(req.body);
 
       if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
       }else{
        next();
       }
}

module.exports.validateReview =(req,res,next)=>{
 let {error}= reviewSchema.validate(req.body);
 
       if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
       }else{
        next();
       }
}

module.exports.isReviewauthor=async(req,res,next)=>{
      let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if( !review.author._id.equals(res.locals.curruser._id)){
        req.flash("error","you are not the author of this review");
       return res.redirect(`/listings/${id}`);
    }
    next();
}