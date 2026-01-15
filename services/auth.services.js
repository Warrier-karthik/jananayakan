const bcrypt = require("bcrypt");
const crypto = require("crypto");
const smsService = require("./sms.service.js");
const OTP = require("../models/otpModel.js");
const userService = require("./user.services.js");
exports.generateOTP = async (phoneNumber) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);
    console.log(`Generated OTP for ${phoneNumber}: ${otp}`);
    const otpEntry = new OTP({ otp: hashedOTP });
    await otpEntry.save();

    return {hashedOTP};
}
exports.verifyOTP = async (otp) => {
    const otpEntries = await OTP.find({});
    if (otpEntries.length === 0) {
        return false;
    }
    const latestOTPEntry = otpEntries[otpEntries.length - 1];
    if (latestOTPEntry.expiresAt < Date.now()) {
        throw new Error("OTP has expired");
    }
    const isMatch = await bcrypt.compare(otp, latestOTPEntry.otp);
    if (!isMatch) {
        throw new Error("Invalid OTP");
    }
    await OTP.deleteMany({});
    return true;
}
exports.verifyUser = async (phoneNumber) => {
    const user = await userService.getUserByPhoneNumber(phoneNumber);
    console.log(user);
    return !!user;
}