const { verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");
const authJwt = require('../middleware/authJwt')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/user/signup",[verifySignUp.checkDuplicateUsernameOrEmail], controller.signup);

  app.post("/api/user/signin", controller.signin);

  app.patch("/api/user/me", [authJwt.verifyToken], controller.edit) 

  app.post("/api/user/upload-image/:id", controller.uploadImage)

};