const express = require("express");
const router = express.Router();
const wrapAsync=require("../utlis/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLOggedin, isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js");
const upload = multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))//index.route
 .post(
     isLOggedin,
     upload.single('listing[image]'),
     validateListing,
     wrapAsync(listingController.createlisting));// create route

//new route
router.get("/new",isLOggedin,listingController.renderNewForm);

router.route("/:id")
.put(//update route
    isLOggedin,
    isOwner, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updatelisting))
.delete(isLOggedin,
//Delete Route
    isOwner,
    wrapAsync(listingController.deletelisting))
  .get(wrapAsync(listingController.showlisting));//Show Route  

//Edit route
router.get("/:id/edit",isLOggedin,
    isOwner,
    wrapAsync(listingController.editlisting));


module.exports=router;