const express = require("express");
const { body } = require("express-validator");
const { loginController } = require("../controllers/authController");
const { validate } = require("../utils/validators");

const router = express.Router();

router.post(
  "/login",
  [
    body("username").isString().trim().notEmpty(),
    body("password").isString().isLength({ min: 4 }),
    validate,
  ],
  loginController
);

module.exports = router;
