const express = require('express')
const router = express.Router()
// =================================================
// controller //
// regist
const {reservation_regist_accomodation_controller} = require('../controllers/reservation_controller/regist/reservation_regist_accomodation_controller')

// ===================================================
// =============== regist 라우터 =================== //
// ===================================================

// =================================================
// reservation regist router //
router.post('/regist/:house', reservation_regist_accomodation_controller)

module.exports = router