const db = require("../models");
const dbConfig = require('../config/db.config')
const Role = db.role;
const uri = `mongodb+srv://smezin:${process.env.MONGO_PASS}@cluster0.h9kw3.mongodb.net/${process.env.MONGO_CLUSTER_NAME}?retryWrites=true&w=majority`;
db.mongoose
  .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true})
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}