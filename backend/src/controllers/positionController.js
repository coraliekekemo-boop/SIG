const {
  insertPosition,
  getLatestPositions,
  getVehicleHistory,
  searchInRadius,
  nearestVehicle,
} = require("../services/positionService");

const createPositionController = async (req, res, next) => {
  try {
    const payload = {
      vehicleId: req.body.vehicle_id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      recordedAt: req.body.recorded_at,
    };
    const row = await insertPosition(payload);
    return res.status(201).json(row);
  } catch (error) {
    return next(error);
  }
};

const getLatestPositionsController = async (req, res, next) => {
  try {
    const rows = await getLatestPositions();
    return res.status(200).json(rows);
  } catch (error) {
    return next(error);
  }
};

const getVehicleHistoryController = async (req, res, next) => {
  try {
    const rows = await getVehicleHistory(req.params.vehicleId, req.query.from, req.query.to);
    return res.status(200).json(rows);
  } catch (error) {
    return next(error);
  }
};

const searchRadiusController = async (req, res, next) => {
  try {
    const rows = await searchInRadius(
      Number(req.query.lat),
      Number(req.query.lng),
      Number(req.query.radius)
    );
    return res.status(200).json(rows);
  } catch (error) {
    return next(error);
  }
};

const nearestVehicleController = async (req, res, next) => {
  try {
    const row = await nearestVehicle(Number(req.query.lat), Number(req.query.lng));
    if (!row) {
      return res.status(404).json({ message: "Aucune position disponible" });
    }
    return res.status(200).json(row);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPositionController,
  getLatestPositionsController,
  getVehicleHistoryController,
  searchRadiusController,
  nearestVehicleController,
};
