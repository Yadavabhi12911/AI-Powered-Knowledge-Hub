const asyncHandler = require("express-async-handler");
const ErroHandler = require("../utils/ErrorHandle");
const jwt = require("jsonwebtoken");
const userCollection = require("../models/User");

const authenticate = asyncHandler(async (req, res, next) => {
  let token = req?.cookies?.myCookie;

  // If not in cookie, check Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ErroHandler("please login first", 401);
  }
  let decodedToken = jwt.verify(token, process.env.SECRET_KEY);

  let user = await userCollection.findOne({ _id: decodedToken.id });

  if (!user) {
    throw new ErroHandler("Invalid session, please login again !!!", 404);
  }

  if (user.tokenVersion !== decodedToken.tokenVersion) {
    throw new ErroHandler(
      "invalid session,Token version mismatch please login again !!!!",
      404
    );
  }

  req.myUser = user;

  next();
});

module.exports = authenticate;
