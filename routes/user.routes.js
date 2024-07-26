const userController = require("../controllers/user.controller")
const { userProtected } = require("../middleware/protected")

const router = require("express").Router()


router

    .put("/verify-email", userProtected, userController.verifyUserEmail)

module.exports = router