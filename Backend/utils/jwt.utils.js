
const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const generateToken = AsyncHandler(async (id, tokenVersion) => {
    let token = jwt.sign({
        id, tokenVersion
    }, process.env.SECRET_KEY, {
        expiresIn: "1d"
    })
    return token
})


module.exports = { generateToken }