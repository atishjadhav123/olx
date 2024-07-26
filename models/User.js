const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dpcwps9zv/image/upload/v1721291311/food_zjfks2.png"
    },
    password: {
        type: String,
        require: true
    },
    emailverified: {
        type: Boolean,
        default: false
    },
    mobailverified: {
        type: Boolean,
        default: false
    },
    emailcode: {
        type: String,
    },
    mobailcode: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    mobail: {
        type: Number,
        require: true
    },
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)