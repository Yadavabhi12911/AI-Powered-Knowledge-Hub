const { default: mongoose } = require("mongoose")

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },
    content: {
        type: String,
        required: [true, "content is required"]
    },
    tags:[],
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "author is required"]
    },

    published: {
        type: Boolean,
        default: false
    },
    summary: {
        type: String,
        default: ""
    }
}, { timestamps: true, minimize: false })

module.exports = mongoose.model('Article', articleSchema);