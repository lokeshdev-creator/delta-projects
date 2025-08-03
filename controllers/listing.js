const Listing =require("../models/listing");

module.exports.index=(async (req,res,next)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings}); 
});

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showlisting =async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist! ");
       return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createlisting=async(req,res,next)=>{
    let url=req.file.path;
    let filename = req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","new Listing Created!");
    res.redirect("/listings");
    
}

module.exports.editlisting=async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist! ");
       return res.redirect("/listings");
    }

    let orginalImageurl=listing.image.url;
    orginalImageurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,orginalImageurl});
}

module.exports.updatelisting=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
       let url=req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save(); 
    }
    
    req.flash("success","List Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deletelisting=async(req,res,next)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
};