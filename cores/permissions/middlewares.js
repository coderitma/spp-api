const jwt = require("jsonwebtoken");
const UserModel = require("../../apps/user/models");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let user = await jwt.verify(token, process.env.PROJECT_KEY);
    req.user = await UserModel.findOne({ email: user.email });
    next();
  } catch (error) {
    return res.status(401).json({
      message: "a client is forbidden from accessing a valid url.",
    });
  }
};

exports.allowAny = (req, res, next) => {
  next();
};

exports.isAdminUser = async (req, res, next) => {
  try {
    if (req.user && req.user.isSuperuser) {
      next();
    } else {
      throw { message: "a client is forbidden from accessing a valid url." };
    }
  } catch (error) {
    return res.status(401).json(error);
  }
};

exports.isAuthenticatedOrReadOnly = () => {};
