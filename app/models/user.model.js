const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    mobile: String,
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      }
    ]
  })
);

module.exports = User;