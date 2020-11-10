const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { logger } = require("../logger/winstonLogger.js");

verifyToken = (req, res, next) => {
  if (!req || !req.body || !req.body.user) {
    logger.error(`inavlid token verification request`)
    return res.status(400).send(`bad request`)
  }
  let token = req.headers["x-access-token"] || req.body.user.token;  
  if (!token) {
    logger.warn(`verifyToken - no token provided`)
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      logger.warn('verifyToken - unauthorized')
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;