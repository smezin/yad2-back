const controller = require('../controllers/feed.controller')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/feed/getfeed", controller.getItemsFeed);
  app.get("/api/feed/getfeed/:category", controller.getCategoryItemsFeed)
  app.get("/api/feed/getUserfeed/:userId", controller.getUserItemsFeed)
  app.post("/api/feed/getFilteredFeed", controller.getFilteredFeed)
};