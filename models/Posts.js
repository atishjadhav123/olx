const mongoose = require("mongoose")
const PostScheme = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    title: { type: String, require: true },
    category: { type: String, require: true },
    desc: { type: String, require: true },
    price: { type: String, require: true },
    images: { type: String, require: true },
    location: { type: String, require: true },
}, { timestamps: true })

module.exports = mongoose.model("post", PostScheme)