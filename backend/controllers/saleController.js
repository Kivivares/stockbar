const asyncHandler = require('express-async-handler')

const Drink = require('../models/drinkModel')
const Sale = require('../models/saleModel')

const saveSingleSale = asyncHandler(async (req, res) => {
    if (!req.body.drink) {
        res.status(400)
        throw new Error('No drink')
    }

    const drink = await Drink.findById(req.body.drink)
    if (!drink) {
        res.status(404)
        throw new Error('Drink not found')
    }

    const sale = await Sale.create({
        drink: drink._id,
        amount: 1,
    })

    res.status(200).json(sale)
})

module.exports = {
    saveSale: saveSingleSale,
}
