// admin register
// admin verify otp
// admin login
// admin logout

// user register
// user verify email
// user login
// user logout

const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")
const sendEmail = require("../utils/email")
const { checkEmpty } = require("../utils/checkEmpty")
const User = require("../models/User")

exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const { isError, error } = checkEmpty({ name, email, password })

    if (isError) {
        return res.status(400).json({ message: "All Feilds Required", error })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invaild Email" })
    }
    // if (!validator.isStrongPassword(password)) {
    //     return res.status(400).json({ message: "Provide strong Password" })
    // }
    const IsFound = await Admin.findOne({ email })
    if (IsFound) {
        return res.status(400).json({ messsage: "Email Alerdy Registerd With Us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })
    res.json({ message: " Register Success" })

})

exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Fields Requpred", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Indivaid Email" })

    }
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ messsage: process.env.NODE_ENV === "devlopment" ? "invaild Email" : "invaild Creaditals" })
    }
    const verify = await bcrypt.compare(password, result.password)

    if (!verify) {
        return res.status(401).json({ messsage: process.env.NODE_ENV === "devlopment" ? "invaild Password" : "invaild Creaditals" })
    }
    //send otp
    const otp = Math.floor(10000 + Math.random() * 900000)//nanoid

    await Admin.findByIdAndUpdate(result._id, { otp })

    await sendEmail({
        to: email, subject: `Login OTP`, message: `
        <h1>Do Not Share Your Account OTP </h1>
        <p>your login otp ${otp}</p>
        `})

    res.json({ message: "Credentials Verify Success. OTP send to your registred email." })
})
exports.verifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ otp, email })
    if (isError) {
        return res.status(401).json({ message: "All Fields Requpred", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Indivaid Email" })
    }
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ messsage: process.env.NODE_ENV === "devlopment" ? "Invaild Email" : "Invaild Creaditals" })
    }
    if (otp !== result.otp) {
        return res.status(401).json({ message: "Indivaid OTP" })
    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    // JWT
    res.cookie("admin", token, {
        maxAge: 86400000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    // cookie
    res.json({
        message: "OTP Verify Success.", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })
    // res

})


exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "Admin Logout Success" })
})


exports.regiterUser = asyncHandler(async (req, res) => {
    const { name, mobile, email, password, cpassword } = req.body
    const { error, isError } = checkEmpty({
        name,
        mobile,
        email,
        password,
        cpassword
    })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "invaild Email " })
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ message: "invaild mobile " })
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "provide Strong password " })
    }
    if (!validator.isStrongPassword(cpassword)) {
        return res.status(400).json({ message: "provide Strong Conform password " })
    }
    if (password !== cpassword) {
        return res.status(400).json({ message: "password Do Not Match" })
    }

    const result = await User.findOne({ email })
    if (result) {
        res.status(400).json({ message: "email Alredy registred with us ", })
    }

    const hash = await bcrypt.hash(password, 10)
    await User.create({ name, mobile, email, password: hash })

    res.status(200).json({ message: "user Register Success" })


})


exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Fields Requpred", error })
    }
    const result = await User.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: "Email not Found" })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "password Do Not Match" })
    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "180d" })
    res.cookie("user", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 180
    })
    res.json({
        messsage: "user Register Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            mobail: result.mobail,
            avatar: result.avatar,
            verified: result.verified,
            emailverified: result.verified,
            mobailverified: result.verified
        }
    })
})

exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("user")
    res.json({ message: "Admin Logout Success" })
})