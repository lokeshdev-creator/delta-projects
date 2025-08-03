const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const  passportLocalmongoose = require("passport-local-mongoose"); 
const User = new Schema({
    email:{
        type:String,
        required: true,
    }

});
User.plugin(passportLocalmongoose);

module.exports = mongoose.model('User',User);