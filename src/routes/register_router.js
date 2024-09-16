const express = require('express')
const Accomodation = require('../models/Accomodation')
const Search = require('../models/Search')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()

const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')
const config = require('../config/env_config')
// =================================================
// multer //
const {initail_acc_regist_multer} = require('../middlewares/common_middle/multer_middle')
// =================================================
// controller //
const {acc_regist_lv0_controller} = require('../controllers/accomodation_controller/acc_regist_lv0_controller')
const {acc_regist_lv1_controller} = require('../controllers/accomodation_controller/acc_regist_lv1_controller')
const {acc_regist_lv2_controller} = require('../controllers/accomodation_controller/acc_regist_lv2_controller')
const {acc_regist_lv3_controller} = require('../controllers/accomodation_controller/acc_regist_lv3_controller')
const {acc_regist_lv4_controller} = require('../controllers/accomodation_controller/acc_regist_lv4_controller')
const {acc_regist_lv5_controller} = require('../controllers/accomodation_controller/acc_regist_lv5_controller')
const {acc_regist_lv6_controller} = require('../controllers/accomodation_controller/acc_regist_lv6_controller')
const {acc_regist_lv7_controller} = require('../controllers/accomodation_controller/acc_regist_lv7_controller')

// =================================================
// ================== 라 우 터 =================== //
// =================================================

// =================================================
// regist lv0 //
router.post('/registLv0', acc_regist_lv0_controller)

// =================================================
// regist lv1 //
router.put('/registLv1', acc_regist_lv1_controller)

// // =================================================
// // regist lv2 //
router.put('/registLv2', acc_regist_lv2_controller)

// // =================================================
// // regist lv3 //
router.put('/registLv3', acc_regist_lv3_controller)

// // =================================================
// // regist lv4 //
router.put('/registLv4', acc_regist_lv4_controller)

// // =================================================
// // regist lv5 //
router.put('/registLv5', acc_regist_lv5_controller)

// // =================================================
// // regist lv6 //
router.put('/registLv6/:house', initail_acc_regist_multer, acc_regist_lv6_controller)

// // =================================================
// // regist lv7 //
router.put('/registLv7/:house', acc_regist_lv7_controller)

// // =================================================
// // regist lv8 //
// router.put('/registLv1', acc_regist_lv1_controller)

// // =================================================
// // regist lv9 //
// router.put('/registLv1', acc_regist_lv1_controller)

// // =================================================
// // regist lv10 //
// router.put('/registLv1', acc_regist_lv1_controller)

// // =================================================
// // regist lv11 //
// router.put('/registLv1', acc_regist_lv1_controller)

module.exports = router