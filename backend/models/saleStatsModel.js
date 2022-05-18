const mongoose = require('mongoose')

function getNumber(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString()).toFixed(2);
    }
    return value;
}

const saleStatsSchema = mongoose.Schema({
    drinkSales: [new mongoose.Schema({
        drink: {
            type: mongoose.ObjectId,
            required: true,
            ref: 'Drink'
        },
        amount: {
            type: Number,
            required: true,
        }
    }, {toJSON: {getters: true}})],
    totalSales: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {getters: true},
    toObject: {getters: true}
})

module.exports = mongoose.model('SaleStats', saleStatsSchema)