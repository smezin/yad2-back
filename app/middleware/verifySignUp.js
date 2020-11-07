const { logger } = require('../logger/winstonLogger');
const db = require('../models');
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  if (!req.body || !req.body.username) {
    logger.error(`bad request. no username/req body provided`)
    res.status(400).send()
  }  
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      logger.error(`counld not find user: ${err}`)
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      logger.error('Failed signup, username is already in use')
      res.status(400).send({ message: 'Failed signup, username is already in use' });
      return;
    } 
    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return
      }
      if (user) {
        logger.error('Failed signup, email is already in use')
        res.status(400).send({ message: 'Failed signup, email is already in use' });
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;