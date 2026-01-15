const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 2 * 60 * 1000 // OTP expires in 5 minutes
    }
    
})
module.exports = mongoose.model("OTP", otpSchema);