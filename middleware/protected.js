const jwt = require("jsonwebtoken")
exports.userProtected = (req, res, next) => {
    const { user } = req.cookies
    if (!user) {
        return res.status(401).json({ message: "NO Cookie Found" })

    }
    jwt.verify(user, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(401).json({ message: "jwt Error", error: err.message })
        }
        req.loggedInUser = decode.userId
        next()
    })
}