const bcrypt = require("bcrypt");
const crypto = require("crypto");
const smsService = require("./sms.service.js");
const OTP = require("../models/otpModel.js");
const userService = require("./user.services.js");

// Generate OTP for a given phone number
exports.generateOTP = async (phoneNumber) => {
    try {
        const mongoose = require("mongoose");
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection not ready. Please try again.");
        }

        if (!phoneNumber) {
            throw new Error("Phone number is required to generate OTP");
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);
        console.log(`Generated OTP for ${phoneNumber}: ${otp}`);

        // Remove old OTPs for this phone number
        await OTP.deleteMany({ phoneNumber });

        const otpEntry = new OTP({
            phoneNumber,
            otp: hashedOTP
        });

        // Save with timeout handling
        await Promise.race([
            otpEntry.save(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("OTP save operation timed out")), 15000)
            )
        ]);

        // Return both hashed and plain OTP (plain OTP is only for dev / SMS)
        return { otp, hashedOTP };
    } catch (error) {
        console.error("Error generating OTP:", error);
        throw error;
    }
};

// Verify OTP for a given phone number
exports.verifyOTP = async (phoneNumber, otp) => {
    try {
        if (!phoneNumber || !otp) {
            throw new Error("Phone number and OTP are required");
        }

        const otpEntry = await OTP.findOne({ phoneNumber }).sort({ createdAt: -1 });
        if (!otpEntry) {
            throw new Error("OTP not found. Please request a new OTP.");
        }

        if (otpEntry.expiresAt < Date.now()) {
            await OTP.deleteMany({ phoneNumber });
            throw new Error("OTP has expired. Please request a new OTP.");
        }

        const isMatch = await bcrypt.compare(otp, otpEntry.otp);
        if (!isMatch) {
            throw new Error("Invalid OTP");
        }

        // OTP is valid, remove all OTPs for this phone number
        await OTP.deleteMany({ phoneNumber });
        return true;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
    }
};

// Check if a user exists for a given phone number
exports.verifyUser = async (phoneNumber) => {
    const users = await userService.getUserByPhoneNumber(phoneNumber);
    console.log(users);
    return Array.isArray(users) && users.length > 0;
};