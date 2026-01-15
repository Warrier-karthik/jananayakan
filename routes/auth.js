const express = require("express");
const Router = express.Router();
const authController = require("../controllers/auth.controller.js");

Router.post("/generate-otp", authController.generateOTP);
Router.post("/verify-otp", authController.verifyOTP);
module.exports = Router;