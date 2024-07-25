const router = require("express").Router()
const authController = require("./../controllers/auth.controller")

router
    .post("/register-admin", authController.registerAdmin)
    .post("/login-admin", authController.loginAdmin)
    .post("/verify-admin-otp", authController.verifyOTP)
    .post("/logout-admin", authController.logoutAdmin)


    .post("/login-mobail-user", authController.loginUser)
    .post("/register-mobail-user", authController.regiterUser)
    .post("/logout-mobail-user", authController.logoutUser)

module.exports = router

