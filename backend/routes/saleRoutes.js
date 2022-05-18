const express = require('express')
const router = express.Router()
const {saveSale} = require('../controllers/saleController')
const {protect} = require('../middleware/authMiddleware')

router.route('/single').post(protect, saveSale)

module.exports = router