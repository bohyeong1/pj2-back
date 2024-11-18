const express = require('express')
const router = express.Router()
// =================================================
// controller //
// regist
const {reservation_regist_accomodation_controller} = require('../controllers/reservation_controller/regist/reservation_regist_accomodation_controller')
// get
const {reservation_get_list_controller} = require('../controllers/reservation_controller/get/reservation_get_list_controller')
const {reservation_get_target_controller} = require('../controllers/reservation_controller/get/reservation_get_target_controller')
const {reservation_get_message_list_controller} = require('../controllers/reservation_controller/get/reservation_get_message_list_controller')
const {reservation_get_detail_message_controller} = require('../controllers/reservation_controller/get/reservation_get_detail_message_controller')
const {reservation_get_success_list_controller} = require('../controllers/reservation_controller/get/reservation_get_success_list_controller')
// update
const {reservation_update_refund_controller} = require('../controllers/reservation_controller/update/reservation_update_refund_controller')
const {reservation_evaluation_controller} = require('../controllers/reservation_controller/update/reservation_evaluation_controller')

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

// =================================================
// get reservation message list router //
router.post('/get-message-list', reservation_get_message_list_controller)

// =================================================
// get reservation detail message router //
router.get('/get-message-detail/:reservation', reservation_get_detail_message_controller)

// =================================================
// get reservation success list router //
router.get('/get-success-list', reservation_get_success_list_controller)


// ===================================================
// ================= update 라우터 ================= //
// ===================================================

// =================================================
// refund accomodation router //
router.put('/refund/:house', reservation_update_refund_controller)

// =================================================
// reservation evaluation router //
router.post('/evaluation', reservation_evaluation_controller)

module.exports = router