const express = require("express");
const { body, param } = require("express-validator");
const {
  getVehicles,
  createVehicleController,
  updateVehicleController,
  deleteVehicleController,
} = require("../controllers/vehicleController");
const authMiddleware = require("../middleware/authMiddleware");
const { validate } = require("../utils/validators");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getVehicles);

router.post(
  "/",
  [
    body("code").isString().trim().notEmpty(),
    body("label").isString().trim().notEmpty(),
    body("status").optional().isIn(["active", "inactive"]),
    validate,
  ],
  createVehicleController
);

router.put(
  "/:id",
  [
    param("id").isInt({ min: 1 }),
    body("code").isString().trim().notEmpty(),
    body("label").isString().trim().notEmpty(),
    body("status").isIn(["active", "inactive"]),
    validate,
  ],
  updateVehicleController
);

router.delete("/:id", [param("id").isInt({ min: 1 }), validate], deleteVehicleController);

module.exports = router;
