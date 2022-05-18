const express = require('express')
const router = express.Router()
const {getDrinks, setDrink, updateDrink, deleteDrink, setStonks} = require('../controllers/drinkController')
const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getDrinks).post(protect, setDrink)
router.route('/stonks').post(setStonks)
router.route('/:id').put(protect, updateDrink).delete(protect, deleteDrink)

module.exports = router