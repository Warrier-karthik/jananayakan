const mongoose = require("mongoose");

// OTP schema now stores OTPs per phone number with timestamps
const otpSchema = new mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
            index: true
        },
        otp: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            default: () => Date.now() + 2 * 60 * 1000 // OTP expires in 2 minutes
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("OTP", otpSchema);