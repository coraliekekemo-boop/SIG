const { login, register } = require("../services/authService");

const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await login(username, password);

    if (!result) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const registerController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await register(username, password);

    if (!result) {
      return res.status(409).json({ message: "Ce nom d utilisateur existe deja" });
    }

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = { loginController, registerController };
