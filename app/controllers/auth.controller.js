const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    mobile: req.body.mobile,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400 // 24 hours
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(201).send({
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      token
    });
  });
};

exports.signin = async (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
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
          message: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        token
      });
    });
};

// exports.edit = async (req, res) => {   
//   console.log('edit', req.body)
//   const user = req.body.user
//   const updates = req.body.updates 
//   const updatesKeys = Object.keys(updates)
//   try {
//       User.findOne(
//         {username: req.body.username})
//           .exec ((err, user) => {
//             if (err) {
//               res.status(500).send({ message: err });
//               return;
//             }
//             if (!user) {
//               return res.status(404).send({ message: "User Not found." });
//             }
//             updatesKeys.forEach((update) => user[update] = updates[update])
//             user.save((err, user) => {
//               if (err) {
//                 res.status(500).send({ message: err });
//                 return;
//               }
//               res.status(201).send(user);
//             });
//           }
//         )
      
//       console.log(req.body.user,'\n-----', req.body.updates, '\n----', updatesKeys)      
//       res.status(200).send(user)
//   } catch (e) {
//       console.log('err: ', e)
//       res.status(400).send
//   }
// }