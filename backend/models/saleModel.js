const mongoose = require('mongoose')

function getNumber(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString()).toFixed(2);
    }
    return value;
}

const saleSchema = mongoose.Schema({
    drink: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'Drink'
    },
    amount: {
        type: Number,
        required: true,
    },
    is_processed: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {getters: true},
    toObject: {getters: true}
})

module.exports = mongoose.model('Sale', saleSchema)