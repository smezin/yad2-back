const mongoose = require('mongoose')
const Schema = mongoose.Schema

const locationSchema = new Schema ({
    city: {
        required: false,
        type: String
    },
    street: {
        required: false,
        type: String
    }
})
const itemSchema = new Schema ({
    availableImmediately: {
        type: Boolean,
        required: false
    },
    balcony: {
        type: Boolean,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    dealType: {
        type: String,
        required: false
    },
    entryDate: {
        type: String,
        required: false
    },
    floor: {
        type: Number,
        required: false,
        min: -10,
        max: 50
    },
    imageUrls: [{
        type:String,
        require: false
    }],
    isPromoted: {
        type: Boolean,
        required: false
    },
    location: {
        type: String,//LocationSchema,
        required: false
    },
    locationAddr: {
        type: locationSchema,
        required: false
    },
    masterCategory: {
        type: String,
        required: true
    },
    myGender: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ownerMobile: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    properties: [{
        type: String,
        required: false
    }],
    propertyType: {
        type: String,
        required: false
    },
    restroom: {
        type: String,
        required: false
    },
    rooms: {
        type: Number,
        required: false,
        min: 0,
        max: 12
    },
    securityRoom: {
        type: String,
        required: false
    },
    size: {
        type: Number,
        required: false,
        min: 0,
        max: 10000
    },
    split: {
        type: String,
        required: false
    },
    storage: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    }     
})

const Item = mongoose.model('Item', itemSchema)
const LocationAddr = mongoose.model('location', locationSchema)
module.exports = {
    Item,
    LocationAddr
}