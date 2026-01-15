const axios = require("axios");

exports.sendSMS = async (phoneNo, otp) => {
    try {
        const apiKey = "7ZJ6MjCUwyzX3iObAkocfYlEDIne0N5LTx1Pmgs94HdQR8KphqKWNu8nx0fomSgUsk4OFYc736dQJHv1";
        const url = " https://www.fast2sms.com/dev/bulkV2";
        const payload = {
            route: "q",
            message: `Your OTP is ${otp}`,
            numbers: phoneNo
        };
        const headers = {
            authorization: apiKey,
            "Content-Type": "application/json",
            accept: "application/json"
        };
        const response = await axios.post(url, payload, { headers });
        return response.data;
    } catch (error) {
        console.error("Error sending SMS:", error);
        throw error;
    }
}