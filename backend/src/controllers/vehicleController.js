const {
  listVehicles,
  createVehicle,
  updateVehicle,
  removeVehicle,
} = require("../services/vehicleService");

const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await listVehicles();
    return res.status(200).json(vehicles);
  } catch (error) {
    return next(error);
  }
};

const createVehicleController = async (req, res, next) => {
  try {
    const vehicle = await createVehicle(req.body);
    return res.status(201).json(vehicle);
  } catch (error) {
    return next(error);
  }
};

const updateVehicleController = async (req, res, next) => {
  try {
    const updated = await updateVehicle(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Vehicule introuvable" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

const deleteVehicleController = async (req, res, next) => {
  try {
    const deleted = await removeVehicle(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Vehicule introuvable" });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getVehicles,
  createVehicleController,
  updateVehicleController,
  deleteVehicleController,
};
