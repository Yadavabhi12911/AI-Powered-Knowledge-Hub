
const asyncHanlder = require("express-async-handler")
const ErroHandler = require("../utils/ErrorHandle.js")

const authorize = asyncHanlder( async( req, res, next) => {

    let currentUserRole = req.myUser.role
    if(currentUserRole !== "admin"){
        throw new ErroHandler(`unauthorized access, ${currentUserRole} is not allowed to access this route`, 403)
    }

    next()
})


module.exports = { authorize}