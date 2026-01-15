const authServices = require("../services/auth.services.js");
const jwt = require("jsonwebtoken");

// POST /auth/generate-otp
exports.generateOTP = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        if (!phoneNumber) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const otpData = await authServices.generateOTP(phoneNumber);

        return res.status(200).json({
            success: true,
            message: "OTP generated successfully",
            // In development, we can return the OTP for easier testing
            otp: process.env.NODE_ENV === "production" ? undefined : otpData.otp
        });
    } catch (error) {
        console.error("Generate OTP controller error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// POST /auth/verify-otp
exports.verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
        }

        // Verify OTP for this phone number
        await authServices.verifyOTP(phoneNumber, otp);

        // Check if user exists
        const userExists = await authServices.verifyUser(phoneNumber);
        if (!userExists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate JWT token
        const secret = process.env.API_SECRET || process.env.JWT_SECRET || "dev-secret";
        const token = jwt.sign({ phoneNumber }, secret, { expiresIn: "7d" });

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token: token
        });
    } catch (error) {
        console.error("Verify OTP controller error:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};