const userController = require("../controllers/user.controller")
const { userProtected } = require("../middleware/protected")

const router = require("express").Router()


router

    .post("/verify-email", userProtected, userController.VerifyUserEmail)
    .post("/verify-user-email-otp", userProtected, userController.verifyEmailOTP)
    .post("/verify-user-mobile-otp", userProtected, userController.verifyMobilOTP)

module.exports = router