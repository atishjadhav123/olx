const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const sendEmail = require("../utils/email")
const { sendSMS } = require("../utils/sms")
const Posts = require("../models/Posts")
const { checkEmpty } = require("../utils/checkEmpty")
const upload = require("../utils/upload")
const cloudinary = require("../utils/cloudinary.config")

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

exports.getLocaton = asyncHandler(async (req, res) => {
    const { gps } = req.body
    const { isError, error } = checkEmpty({ gps })

    if (isError) {
        return res.status(400).json({ message: "all Fields Requred", error })
    }

    // open as
    const responce = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${process.env.OPEN_CAGE_API_KEY}=${gps.latitude}+${gps.longitude}&pretty=1&no_annotations=1`)
    const x = await responce.json()
    console.log(x);

    res.json({ message: "Location fetch success", result: x.results[0].formatted })
})

exports.addPost = asyncHandler(async (req, res) => {
    upload(req, res, async err => {
        const { title, desc, price, location, category } = req.body
        const { error, isError } = checkEmpty({ title, desc, price, location, category })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        console.log(req.files);
        const images = []
        for (const item of req.files) {
            const { secure_url } = await cloudinary.uploader.upload(item.path)
            images.push(secure_url)
        }

        await Posts.create({
            title,
            desc,
            price,
            images,
            location,
            user: req.loggedInUser,
            category
        })
        res.json({ message: "Post Create Successs" })
    })
})
exports.getAllPost = asyncHandler(async (req, res) => {
    const result = await Posts.find()
    console.log(result);
    res.json({ message: "post fetch success", result })

})


