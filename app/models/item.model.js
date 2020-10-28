const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema ({
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
    address: {
        type: addressSchema,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    rooms: {
        type: Number,
        required: false,
        min: 1,
        max: 12
    },
    floor: {
        type: Number,
        required: false,
        min: -10,
        max: 50
    }    
})

const Item = mongoose.model('Item', itemSchema)
module.exports = Item