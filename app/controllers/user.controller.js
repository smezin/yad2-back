const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmailToUser } = require('./email.controller');
const { logger } = require('../logger/winstonLogger');

exports.signup = async (req, res) => {
  if (!req || !req.body) {
    logger.error('bad request. missing body/user object')
    res.status(400).send()
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    mobile: req.body.mobile,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400, // 24 hours
  });
  user.save((err, user) => {
    if (err) {
      logger.error(`error saving user: ${err}`)
      res.status(500).send({ message: err });
      return;
    }
    sendEmailToUser(user.email, user.name, 'welcome')
    res.status(201).send({
      email: user.email,
      favoriteItems: [],
      id: user._id,
      items: [],
      mobile: user.mobile,
      previousSearches: [],
      username: user.username,   
      token,
    });
  });
};

exports.signin = async (req, res) => {
  if (!req || !req.body) {
    logger.error('bad request. missing body/user object')
    return res.status(400).send()
  }
  try {
    const user = await User.findOne({username: req.body.username})
    if (!user) {
      logger.warn('signin - user not found')
      return res.status(404).send()
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    )
    if (!passwordIsValid) {
      logger.info('sign in failure, inavlid password')
      return res.status(401).send({
        token: null,
        message: 'Invalid Password!',
      });
    }
    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    res.status(200).send({
      email: user.email,
      favoriteItems: user.favoriteItems,
      items: user.items,
      id: user._id,
      mobile: user.mobile,
      previousSearches: user.previousSearches,
      username: user.username,      
      token,
    });
  } catch (e) {
    logger.error(`signin error: ${e}`)
    res.status(500).send()
  }
};

exports.edit = async (req, res) => {
  if (!req || !req.body || typeof(req.body.updates) !== 'object') {
    logger.warn('bad edit request. missing body/user object/upadtes')
    res.status(400).send()
  }
  if (typeof(req.body.user) !== 'object') {
    logger.warn(`bad request. invalid user parameter`)
    res.status(400).send()
  }
  const updates = req.body.updates;
  const updatesKeys = Object.keys(updates);
  try {
    User.findOne({ username: req.body.user.username }).exec((err, user) => {
      if (err) {
        logger.error(`could not find user: ${err}`);
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        logger.warn('user not found on edit request');
        return res.status(404).send();
      }
      updatesKeys.forEach((updateKey) => {
        user[updateKey] = updates[updateKey]
      });
      user.save((err, user) => {
        if (err) {
          logger.warn(`could not save user after edit: ${err}`)
          res.status(500).send({ message: err });
          return;
        }
        res.status(200).send(user);
      });
    });
  } catch (e) {
    logger.error(`could not edit user: ${e}`)
    res.status(400).send;
  }
};

exports.addFavorite = async (req, res) => {
  if (!req || !req.body || typeof(req.body.itemId) !== 'string') {
    logger.warn('bad request. missing body/user object/upadtes')
    res.status(400).send()
  }
  if (typeof(req.body.userId) !== 'string') {
    logger.warn(`bad add favorite request. invalid user parameter ${req.body.userId}`)
    res.status(400).send()
  }
  try {
    const user = await User.findById(req.body.userId)
    if (!user) {
      logger.error(`user not found on addFavorite request`);
      return res.status(404).send();
    }
    if (user.favoriteItems.includes(req.body.itemId)) {
      const newArr = user.favoriteItems.filter((item) => {
        return !!item.toString().localeCompare(req.body.itemId.toString()) })
      user.favoriteItems = newArr
    } else {
      user.favoriteItems = [...user.favoriteItems, req.body.itemId]
    }    
    await user.save()
    res.status(200).send(user);
  } catch (e){
      logger.error(`could not add favorite item to user: ${e}`)
      res.status(400).send();
  }
}
exports.getFavorite = async (req, res) => {
  if (!req || !req.body || typeof(req.body.itemId) !== 'string') {
    logger.warn('bad request. missing body/user object/upadtes')
    res.status(400).send()
  }
  if (typeof(req.body.userId) !== 'string') {
    logger.warn(`bad get favorite request. invalid user parameter`)
    res.status(400).send()
  }
  try {
    const user = await User.findById(userId)
    if (!user) {
      logger.warn('cannot getFavorite, user not found')
      return status(404).send()
    }
    if (user.favoriteItems.includes(req.body.itemId)) {
      status(200).send(true)
    } else {
      status(200).send(false)
    }
  } catch (e) {
    logger.error(e)
  }
}
exports.getUserByName = async (req, res) => {
  if (!req || !req.params) {
    logger.warn('bad request. missing data/params')
    res.status(400).send()
  }
  const username = req.params.username;
  try {
    const user = await User.findOne({username: username})
    if (!user) {
      logger.warn('get user. user not found')
      return res.status(404).send()
    }
    res.status(200).send(user)
  } catch (e) {
    logger.error(`get user failed: ${e}`)
  }
}