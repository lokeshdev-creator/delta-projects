const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utlis/wrapAsync.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview, isLOggedin, isReviewauthor}=require("../middleware.js");
const reviewcontroller = require("../controllers/review.js")


//Reviews
// review post Route
router.post("/",
  isLOggedin,
  validateReview,
  wrapAsync(reviewcontroller.createreview));

//review delete post
router.delete("/:reviewId",
  isLOggedin,
  isReviewauthor,
  wrapAsync(reviewcontroller.destroyreview));

module.exports=router;