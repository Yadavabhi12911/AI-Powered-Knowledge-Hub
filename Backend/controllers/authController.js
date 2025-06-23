const User = require('../models/User')
const asyncHandler = require("express-async-handler")
const ErrorHandler = require("../utils/ErrorHandle")
const ApiResponse = require("../utils/ApiResponse")
const {generateToken} = require("../utils/jwt.utils")

// Register User
exports.register = asyncHandler(async (req, res) => {
    const { username, password, role } = req.body
    if (!username || !password) throw new ErrorHandler('Username and password required', 400)

    const existing = await User.findOne({ username })
    if (existing) throw new ErrorHandler('Username already exists', 400)

    const user = await User.create({ username, password , role})

    return res.status(201).json(
        new ApiResponse(201, { id: user._id, username: user.username, role: user.role }, "User registered")
    )
})

// Login User
exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body


    const user = await User.findOne({ username })
    if (!user) {
        console.log('User not found');
        throw new ErrorHandler('user not found', 400)
    }

    const match = await user.isPasswordCorrect(password)
  

    if (!match) throw new ErrorHandler('Invalid credentials', 400)

    let token = await generateToken(user._id, user.tokenVersion)
    if (!token) throw new ErrorHandler("unable to generate token", 500)

    const options = {
        httpOnly: true,
        // secure: true, // Remove or comment out for local development
    }

    

    return res.status(200)
        .cookie("myCookie", token, options)
        .json(
            new ApiResponse(200, { token, user: { id: user._id, username: user.username, role: user.role } }, "Login successful")
        )
})



exports.logout = asyncHandler(async (req, res) => {

   let userLogout = await User.findByIdAndUpdate(
        req.myUser._id,
        {
            $inc: { tokenVersion: 1 }
        },
        {
            new: true,
        }
    )


    return res.status(200)
        .clearCookie("myCookie")
        .json(
            new ApiResponse(200, {userLogout}, "user logOut succesfully")
        )
})

