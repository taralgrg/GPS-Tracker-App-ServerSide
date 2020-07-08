// function taking incoming request and do some pre-processing
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  // whenever a request comes to express, it automatically down case headers name.
  const { authorization } = req.headers;
  // authorization === 'Bearer lsdfljkasdfjasdlkfjsd'

  // 401 == forbidden error
  if (!authorization) {
    return res.status(401).send({ error: "you must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  // validate the token call jwt
  jwt.verify(token, "My_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in" });
    }

    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};
