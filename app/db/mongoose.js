const db = require('../models');
const dbConfig = require('../config/db.config');
const { logger } = require('../logger/winstonLogger');
const Role = db.role;
const password = process.env.MONGO_PASS;
const clusterId = process.env.MONGO_CLUSTER_ID;
const clusterName = process.env.MONGO_CLUSTER_NAME;
const uri = `mongodb+srv://smezin:${password}@${clusterId}.mongodb.net/${clusterName}?retryWrites=true&w=majority`;
db.mongoose
  .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
  .then(() => {
    logger.info('Successfully connect to MongoDB.')
  })
  .catch(err => {
    logger.error(`could not connect to mongoDB: ${err}`)
    process.exit();
  });

