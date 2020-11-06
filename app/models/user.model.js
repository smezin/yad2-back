const mongoose = require('mongoose');
const Item = require('./item.model');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  favoriteItems: [{
      type: String,
      required: false
  }],
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
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
  tokens: [{
    token: {
      type: String,
      required: false
    }
  }],
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
}, {
  timestamps: true
})

userSchema.virtual('itemsV', {
  ref: Item,
  localField: '_id',
  foreignField: 'owner'
})

const User = mongoose.model('User', userSchema)
module.exports = User;