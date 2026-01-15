const authServices = require("../services/auth.services.js");
const jwt = require("jsonwebtoken");
exports.generateOTP = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        const otpData = await authServices.generateOTP(phoneNumber);
        res.status(200).json({ success: true, otp: otpData.otp });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { phoneNumber,otp } = req.body;
        const isValid = await authServices.verifyOTP(otp);
        const userExists = await authServices.verifyUser(phoneNumber);
        if (!userExists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (isValid) {
            const token = jwt.sign({ phoneNumber }, process.env.API_SECRET);

            res.status(200).json({ success: true, message: "OTP verified successfully", token: token });

        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}