const mongoose = require('mongoose')

function getNumber(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString()).toFixed(2);
    }
    return value;
}

const stonkSchema = mongoose.Schema({
    message: {
        type: String,
    },
    date: {
        type: Date,
    },
    categories: {
        type: Map,
        of: new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            stonks: [new mongoose.Schema({
                name: {
                    type: String,
                    required: true,
                },
                price: {
                    type: mongoose.Decimal128,
                    required: true,
                    get: getNumber
                },
                dir: {
                    type: String,
                    required: true,
                },
            }, {toJSON: {getters: true}})]
        })
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true}
})

module.exports = mongoose.model('Stonk', stonkSchema)