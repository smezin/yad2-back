const controller = require('../controllers/item.controller')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/item/additem", controller.addItem);
  app.get("/api/item/getfeed", controller.getItemsFeed);
  app.get("/api/item/getfeed/:category", controller.getCategoryItemsFeed)
  app.get("/api/item/getUserfeed/:userId", controller.getUserItemsFeed)
  app.post("/api/item/upload-image/:id", controller.uploadImage)
  app.delete("/api/item/delete-item/:id", controller.deleteItem)
};