
const { default: mongoose } = require("mongoose")
const bcryptjs = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"]
    },

    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [7, "minimun length should be 7"]
    },

    tokenVersion: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }

}, { timestamps: true })



userSchema.pre('save', async function () {

    if (!this.isModified("password")) return
    let salt = await bcryptjs.genSalt(12)


    let hashedPass = await bcryptjs.hash(this.password, salt)
    this.password = hashedPass


})

userSchema.methods.isPasswordCorrect = async function (enterPass) {
    return await bcryptjs.compare(enterPass, this.password)
}






module.exports = mongoose.model("User", userSchema)
