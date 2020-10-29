const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  
  favoriteItems: [{
      type: String,
      required: false
  }],
  items: [
    {
      type: String,
      required: false
    }
  ],
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  previousSearches: [{
    type: String,
    required: false
  }],
  username: {
    type: String,
    required: true,
    unique: true
  },
})

const User = mongoose.model('User', userSchema)
module.exports = User;