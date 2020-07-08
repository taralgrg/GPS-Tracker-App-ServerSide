const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    // create jasonWebtoken and send this back as response
    // 1st argument : information that we want to send in token, i.e userId
    // 2ns argument : KEY used to sign the token
    const token = jwt.sign({ userId: user._id }, "My_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    // 422 refers to error that user provided unstatisfied data.
    // return res.status(422).send(err.response);
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  try {
    await user.comparePassword(password);
    // user._id == hashing the used Id
    const token = jwt.sign({ userId: user._id }, "My_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

module.exports = router;
