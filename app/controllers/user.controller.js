const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail } = require("./email.controller");
const upload = require('./aws.controller');
const {Item} = db.item;
const singleUpload = upload.single('image');

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
      res.status(500).send({ message: err });
      return;
    }
    sendWelcomeEmail(user.email, user.name, 'welcome')
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
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
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
  if (typeof(req.body.updates) !== 'object') {
    return
  }
  const updates = req.body.updates;
  const updatesKeys = Object.keys(updates);
  try {
    User.findOne({ username: req.body.user.username }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(414).send({ message: "User Not found." });
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
          res.status(500).send({ message: err });
          return;
        }
        res.status(200).send(user);
      });
    });
  } catch (e) {
    console.log("err: ", e);
    res.status(400).send;
  }
};

exports.uploadImage = (req, res) => {
  const uid = req.params.id;
  console.log(uid)
  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }

    const filters = {_id: uid}
    const update = { imageUrls: req.file.location };
    
    Item.findByIdAndUpdate(filters, update, { new: true })
      .then((item) => res.status(200).json({ success: true, item: item }))
      .catch((err) => res.status(400).json({ success: false, error: err }));
    Item.findOne(filters)
      .then((item) => console.log(item)) //add functionality to reducer!!
  });
}
