const express = require('express')
const Accomodation = require('../models/Accomodation')
const Search = require('../models/Search')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()
// =================================================
// multer //
const {initail_acc_regist_multer} = require('../middlewares/common_middle/multer_middle')
// =================================================
// controller //
// regist
const {acc_regist_lv0_controller} = require('../controllers/accomodation_controller/acc_regist_lv0_controller')
const {acc_regist_lv1_controller} = require('../controllers/accomodation_controller/acc_regist_lv1_controller')
const {acc_regist_lv2_controller} = require('../controllers/accomodation_controller/acc_regist_lv2_controller')
const {acc_regist_lv3_controller} = require('../controllers/accomodation_controller/acc_regist_lv3_controller')
const {acc_regist_lv4_controller} = require('../controllers/accomodation_controller/acc_regist_lv4_controller')
const {acc_regist_lv5_controller} = require('../controllers/accomodation_controller/acc_regist_lv5_controller')
const {acc_regist_lv6_controller} = require('../controllers/accomodation_controller/acc_regist_lv6_controller')
const {acc_regist_lv7_controller} = require('../controllers/accomodation_controller/acc_regist_lv7_controller')
const {acc_regist_lv8_controller} = require('../controllers/accomodation_controller/acc_regist_lv8_controller')
const {acc_regist_lv9_controller} = require('../controllers/accomodation_controller/acc_regist_lv9_controller')
const {acc_regist_lv10_controller} = require('../controllers/accomodation_controller/acc_regist_lv10_controller')
const {acc_regist_lv11_controller} = require('../controllers/accomodation_controller/acc_regist_lv11_controller')
// get
const {acc_get_local_average_contrller} = require('../controllers/accomodation_controller/get/acc_get_local_average_contrller')
const {acc_get_secret_all_controller} = require('../controllers/accomodation_controller/get/acc_get_secret_all_controller')
const {acc_get_secret_controller} = require('../controllers/accomodation_controller/get/acc_get_secret_controller')
// modify
const {acc_modify_title_controller} = require('../controllers/accomodation_controller/modify/acc_modify_title_controller')
const {acc_modify_category_controller} = require('../controllers/accomodation_controller/modify/acc_modify_category_controller')
const {acc_modify_service_facility_controller} = require('../controllers/accomodation_controller/modify/acc_modify_service_facility_controller')
const {acc_modifiy_keyword_controller} = require('../controllers/accomodation_controller/modify/acc_modifiy_keyword_controller')
// delete


// ===================================================
// =============== regist 라우터 =================== //
// ===================================================

// =================================================
// regist lv0 //
router.post('/registLv0', acc_regist_lv0_controller)

// =================================================
// regist lv1 //
router.put('/registLv1', acc_regist_lv1_controller)

// =================================================
// regist lv2 //
router.put('/registLv2', acc_regist_lv2_controller)

// =================================================
// regist lv3 //
router.put('/registLv3', acc_regist_lv3_controller)

// =================================================
// regist lv4 //
router.put('/registLv4', acc_regist_lv4_controller)

// =================================================
// regist lv5 //
router.put('/registLv5', acc_regist_lv5_controller)

// =================================================
// regist lv6 //
router.put('/registLv6/:house', initail_acc_regist_multer, acc_regist_lv6_controller)

// =================================================
// regist lv7 //
router.put('/registLv7/:house', acc_regist_lv7_controller)

// =================================================
// regist lv8 //
router.put('/registLv8/:house', acc_regist_lv8_controller)

// =================================================
// regist lv9 //
router.put('/registLv9/:house', acc_regist_lv9_controller)

// =================================================
// regist lv10 //
router.put('/registLv10/:house', acc_regist_lv10_controller)

// =================================================
// regist lv11 //
router.put('/registLv11/:house', acc_regist_lv11_controller)

// =================================================
// 해당 지역의 평균 가격 //
router.post('/regist/localAverage/:house',acc_get_local_average_contrller)

// =================================================
// host page 등록된 모든 숙소 조회
router.post('/get/secret-all',acc_get_secret_all_controller)

// =================================================
// host page 등록된 하나의 숙소 조회
router.post('/get/secret-one/:house',acc_get_secret_controller)


// ===================================================
// =============== modify 라우터 =================== //
// ===================================================

// =================================================
// title modify //
router.put('/modify/title/:house', acc_modify_title_controller)

// =================================================
// category modify //
router.put('/modify/category/:house', acc_modify_category_controller)

// =================================================
// service facility modify //
router.put('/modify/service-facility/:house', acc_modify_service_facility_controller)

// =================================================
// keyword modify //
router.put('/modify/keyword/:house', acc_modifiy_keyword_controller)




module.exports = router