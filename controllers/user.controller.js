const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const sendEmail = require("../utils/email")

exports.verifyUserEmail = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You Are Not Logged In.Plese LOgin Again" })
    }
    const otp = Math.floor(10000 + Math.random() * 900000)
    await User.findByIdAndUpdate(req.loggedInUser, { emailCode: otp })
    const isSend = await sendEmail({
        to: result.email,
        subject: "Verify Email",
        message: `<p>your otp${otp}</p>`
    })


    res.json({ message: "Verification Send Success" })
})

exports.verifyEmailOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You Are Not Logged In.Plese LOgin Again" })
    }
    if (otp !== result.emailcode) {
        return res.status(400).json({ message: "INvalid OTP" })
    }
    await User.findByIdAndUpdate(req.loggedInUser, { emailverified: true })
    res.json({ message: "Email Verify Success" })
})
exports.verifyMobilOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You Are Not Logged In.Plese LOgin Again" })
    }
    if (otp !== result.mobailcode) {
        return res.status(400).json({ message: "INvalid OTP" })
    }
    await User.findByIdAndUpdate(req.loggedInUser, { emailverified: true })
    res.json({ message: "Email Verify Success" })
})