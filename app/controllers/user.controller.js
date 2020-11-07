const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendEmailToUser } = require("./email.controller");
const { logger } = require("../logger/winstonLogger");

exports.signup = async (req, res) => {
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
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      token,
    });
  });
};

exports.signin = async (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      logger.error(`error finding user: ${err}`)
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      logger.error("user not found");
      return res.status(404).send();
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      logger.warn('sign in failure, inavlid password')
      return res.status(401).send({
        token: null,
        message: "Invalid Password!",
      });
    }

    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      token,
    });
  });
};

exports.edit = async (req, res) => {
  if (!req || !req.body || typeof(req.body.updates) !== 'object') {
    return
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
        logger.error("user not found");
        return res.status(404).send();
      }
      updatesKeys.forEach((update) => {
        if (typeof(user[update]) === 'string') {
          user[update] = updates[update]
        } else if (Array.isArray(user[update])) {
          user[update].push(updates[update])
        }
      });

      user.save((err, user) => {
        if (err) {
          logger.error(`could not save user: ${err}`)
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