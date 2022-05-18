const asyncHandler = require('express-async-handler')

const Drink = require('../models/drinkModel')
const Stonk = require('../models/stonkModel')

const getDrinks = asyncHandler(async (req, res) => {
    const drinks = await Drink.find()

    res.status(200).json(drinks)
})

const setDrink = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400)
        throw new Error('No body')
    }

    const drink = await Drink.create({
        name: req.body.name,
        category: req.body.category,
        basePrice: req.body.basePrice,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
    })

    res.status(200).json(drink)
})

const updateDrink = asyncHandler(async (req, res) => {
    const drink = await Drink.findById(req.params.id)

    if (!drink) {
        res.status(404)
        throw new Error("Drink not found")
    }

    const updatedDrink = await Drink.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    )

    res.status(200).json(updatedDrink)
})

const deleteDrink = asyncHandler(async (req, res) => {
    const drink = await Drink.findById(req.params.id)

    if (!drink) {
        res.status(404)
        throw new Error("Drink not found")
    }

    await drink.remove()

    res.status(200).json({id: req.params.id})
})

const setStonks = asyncHandler(async (req, res) => {
    if (!req.body.stonks) {
        res.status(400)
        throw new Error('No stonks')
    }

    const stonk = new Stonk()
    const parsed = JSON.parse(req.body.stonks)
    stonk.categories = parsed.categories
    stonk.message = parsed.message
    stonk.date = parsed.date

    stonk.categories.forEach((category) => {
        console.log(category.stonks)
    })

    await stonk.save()

    global.io.emit('stonks:data', stonk.toJSON());

    res.status(200).json(true)
})

module.exports = {
    getDrinks,
    setDrink,
    updateDrink,
    deleteDrink,
    setStonks
}