const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (schema, uniqueIdentifier = "email") => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      let user = await jwt.verify(token, process.env.PROJECT_KEY);
      // unique identifier like { email: user.email }
      req.user = await schema.findOne({
        [uniqueIdentifier]: user[uniqueIdentifier],
      });
      next();
    } catch (error) {
      return res.status(401).json({
        message: "a client is forbidden from accessing a valid url.",
      });
    }
  };
};

exports.isAdminUser = async () => {
  return async (req, res, next) => {
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
};
