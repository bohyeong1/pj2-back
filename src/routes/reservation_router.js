const express = require('express')
const router = express.Router()
// =================================================
// controller //
// regist
const {reservation_regist_accomodation_controller} = require('../controllers/reservation_controller/regist/reservation_regist_accomodation_controller')
// get
const {reservation_get_list_controller} = require('../controllers/reservation_controller/get/reservation_get_list_controller')
const {reservation_get_target_controller} = require('../controllers/reservation_controller/get/reservation_get_target_controller')

// ===================================================
// =============== regist 라우터 =================== //
// ===================================================

// =================================================
// reservation regist router //
router.post('/regist/:house', reservation_regist_accomodation_controller)

// ===================================================
// ================== get 라우터 =================== //
// ===================================================

// =================================================
// get reservation pending list router //
router.get('/get-pending-list', reservation_get_list_controller)

// =================================================
// get reservation pending list router //
router.get('/get-target/:house', reservation_get_target_controller)

module.exports = router