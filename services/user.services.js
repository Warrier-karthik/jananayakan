const User = require("../models/User.js");

exports.getAllUsers = async () => {
    return await User.find({});
}
exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
}

exports.getUserByPhoneNumber = async (phoneNumber) => {
    console.log(await User.find({ phoneNo: phoneNumber }));
    return await User.find({ phoneNo: phoneNumber });
}