const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", (req, res, next) => {
  res.send({ user: req.user });
});

module.exports = router;
