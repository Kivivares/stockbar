const mongoose = require('mongoose')

function getNumber(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString()).toFixed(2);
    }
    return value;
}

const drinkSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    basePrice: {
        type: mongoose.Decimal128,
        required: true,
        get: getNumber
    },
    minPrice: {
        type: mongoose.Decimal128,
        required: true,
        get: getNumber
    },
    maxPrice: {
        type: mongoose.Decimal128,
        required: true,
        get: getNumber
    },
}, {
    timestamps: true,
    toJSON: {getters: true},
    toObject: {getters: true}
})

module.exports = mongoose.model('Drink', drinkSchema)