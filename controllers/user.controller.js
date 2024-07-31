const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const sendEmail = require("../utils/email")
const { sendSMS } = require("../utils/sms")
const Posts = require("../models/Posts")
const { checkEmpty } = require("../utils/checkEmpty")

exports.VerifyUserEmail = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are Not Logged in Please Login Again" })
    }
    const otp = Math.floor(10000 + Math.random() * 900000)
    await User.findByIdAndUpdate(req.loggedInUser, { emailCode: otp })
    console.log(result);
    await sendEmail({
        to: result.email, subject: `Email OTP`, message: `
        <h1>Do Not Share Your Account OTP </h1>
        <p>your login otp ${otp}</p>
        `})

    res.json({ message: "Verify User Email Success" })
})

exports.verifyEmailOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You Are Not Logged In.Plese LOgin Again" })
    }
    if (otp != result.emailcode) {
        return res.status(400).json({ message: "INvalid OTP" })
    }
    await User.findByIdAndUpdate(req.loggedInUser, { emailverified: true })
    res.json({ message: "Email Verify Success" })
})
exports.verifyUserMobile = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    const otp = Math.floor(10000 + Math.random() * 900000)
    await User.findByIdAndUpdate(req.loggedInUser, { mobailcode: otp })
    await sendSMS({
        message: `Welcome to SkILLHUB Your OTP is${otp} `,
        numbers: `${result.mobail}`
    })
    res.json({ message: "Verification  Send   Success" })
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
    const updatedUser = await User.findByIdAndUpdate(
        req.loggedInUser,
        { mobailverified: true },
        { new: true })
    res.json({
        message: "Email Verify Success", result: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobail: updatedUser.mobail,
            avatar: updatedUser.avatar,
            emailverified: updatedUser.emailverified,
            mobailverified: updatedUser.mobailverified
        }

    })
})
// exports.addPost = asyncHandler(async (req, res) => {

//     const { title, desc, price, images, location, category, gps } = req.body
//     const { error, isError } = checkEmpty({ title, desc, price, images, location, category })
//     if (isError) {
//         return res.status(400).json({ message: "All feild Required", error })
//     }
//     if (gps) {
//         //api call to openCagedata
//         const responce = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${process.env.OPEN_CAGE_API_KEY}=
//             ${location.latitude}+${location.longitude}&pretty=1&no_annotations=1)`)
//         const x = await responce.json()
//         console.log(x)
//     }
//     // modify this code
//     // await Posts.create({ title, desc, price, images, location, category, user: req.loggedInUser })
//     res.json({ message: "Post Create success" })
// })

exports.getLocation = asyncHandler(async (req, res) => {
    const { gps } = req.body
    const { isError, error } = checkEmpty({ gps })
    if (isError) {
        return res.status(400).json({ message: "All fields are required", error })
    }
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${process.env.OPEN_CAGE_API_KEY}&q=${gps.latitude}+${gps.longitude}&pretty=1&no_annotations=1`);
    const x = await response.json();

    res.json({ message: "Location fetch Success", result: x.results[0].formatted })
})

exports.addPost = asyncHandler(async (req, res) => {
    const { title, desc, price, images, location, category, gps } = req.body;
    const { error, isError } = checkEmpty({ title, desc, price, images, location, category });

    if (isError) {
        return res.status(400).json({ message: "All fields are required", error });
    }

    if (gps) {
        // API call to OpenCage Data with corrected URL format

    }

    // Modify this code as needed
    // await Posts.create({ title, desc, price, images, location, category, user: req.loggedInUser });
    res.json({ message: "Post Create success" });
});

