const express = require("express");
const { body } = require("express-validator");
const { loginController, registerController } = require("../controllers/authController");
const { validate } = require("../utils/validators");

const router = express.Router();

router.post(
  "/register",
  [
    body("username").isString().trim().isLength({ min: 3, max: 50 }),
    body("password").isString().isLength({ min: 4 }),
    validate,
  ],
  registerController
);

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
