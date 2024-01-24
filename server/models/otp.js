const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Otpschema= new Schema({
    email:String,
    code:String,
    expireIn:Number

},{
    timestamps:true
})
const Otp = mongoose.model("otp", Otpschema);

module.exports = Otp;

