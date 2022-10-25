const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

router.post("/sign-in", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Sorry invalid email or password");
    }
    const match = await user.comparePassword(password);
    if (!match) {
      throw new Error("Sorry invalid email or password");
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.MY_SECRET_WEB_TOKEN_KEY
    );
    res.send({ success: true, token });
  } catch (err) {
    const error = new Error(err.message);
    return next(error);
  }
});
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Sorry but the email is already taken");
    }
    const newUser = new User({ email, password });
    await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id },
      `${process.env.MY_SECRET_WEB_TOKEN_KEY}`
    );
    res.send({ success: true, token });
  } catch (err) {
    const error = new Error(err.message);
    return next(error);
  }
});

module.exports = router;
