const express = require("express");
const { body, param, query } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const { validate } = require("../utils/validators");
const {
  createPositionController,
  getLatestPositionsController,
  getVehicleHistoryController,
  searchRadiusController,
  nearestVehicleController,
} = require("../controllers/positionController");

const router = express.Router();

router.use(authMiddleware);

router.get("/latest", getLatestPositionsController);

router.get(
  "/vehicle/:vehicleId/history",
  [param("vehicleId").isInt({ min: 1 }), validate],
  getVehicleHistoryController
);

router.post(
  "/",
  [
    body("vehicle_id").isInt({ min: 1 }),
    body("latitude").isFloat({ min: -90, max: 90 }),
    body("longitude").isFloat({ min: -180, max: 180 }),
    body("recorded_at").optional().isISO8601(),
    validate,
  ],
  createPositionController
);

router.get(
  "/search/radius",
  [
    query("lat").isFloat({ min: -90, max: 90 }),
    query("lng").isFloat({ min: -180, max: 180 }),
    query("radius").isFloat({ min: 1 }),
    validate,
  ],
  searchRadiusController
);

router.get(
  "/search/nearest",
  [
    query("lat").isFloat({ min: -90, max: 90 }),
    query("lng").isFloat({ min: -180, max: 180 }),
    validate,
  ],
  nearestVehicleController
);

module.exports = router;
