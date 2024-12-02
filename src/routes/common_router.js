const express = require('express')
const Accomodation = require('../models/Accomodation')
const City = require('../models/City')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()
const mongoose = require('mongoose')

// =================================================
// controller //
// get
const {acc_get_detail_controller} = require('../controllers/common_controller/get/acc_get_detail_controller')
const {common_get_list_acc_controller} = require('../controllers/common_controller/get/common_get_list_acc_controller')
const {common_get_search_controller} = require('../controllers/common_controller/get/common_get_search_controller')
const {common_get_private_acc_user_controller} = require('../controllers/common_controller/get/common_get_private_acc_user_controller')
const {common_get_search_result_check_contoller} = require('../controllers/common_controller/get/common_get_search_result_check_contoller')



// =================================================
// ================== 라 우 터 =================== //
// =================================================

// =================================================
// subapp - main - api //
router.post('/',expressAsyncHandler(async(req,res,next)=>{
    const limit = req.body.counts
    const field = req.body.filter
    const keyword = req.body.keyword      

    try{
        if(req.body.filter && req.body.keyword){                  
            const query = {[`${field}.name`] : keyword}
            const accomodations = await Accomodation.find(query).limit(limit)     
            res.json({
                code:200,
                accomodations})
        }else if(req.body.filter && !req.body.keyword){
            // 전체 도시 분류 // limit 있음
            if(req.body.filter === 'city' && limit){
                const city = await City.find({}).limit(limit)
                res.json({
                    code:200,
                    city}) 
            }
            // 할인상품
            else if(req.body.filter === 'discount'){
                const accommodations = await Accomodation.find({
                    discount: { $exists: true }
                  }).limit(limit)
                  
                res.json({
                    code : 200,
                    accommodations}) 
            }
            // 전체
            else if(req.body.filter === 'all'){
                const accomodations = await Accomodation.find({}).limit(limit)

                res.json({
                    code : 200,
                    accomodations
                })
            }
            else{
                throw new Error('요청 불량')
            } 
        }
        // 요청불량
        else{
            throw new Error('요청 불량')
        }       
    }catch(e){
        console.log(e)
        res.status(429).json({
            code : 429,
            message : e
        })
    }
}))


// =================================================
// 숙소 list page //
router.get('/list', common_get_list_acc_controller)

// =================================================
// 숙소 상세 페이지 //
router.post('/detail/:house', acc_get_detail_controller)

// =================================================
// 검색어 출력 api //
router.post('/search', common_get_search_controller)

// =================================================
// login check, 숙소 정보 api //
router.post('/private/accomodation-user/:house', common_get_private_acc_user_controller)

// =================================================
// 검색어 체크, 유효한 검색어 일 시 검색어 db update //
router.post('/search-check', common_get_search_result_check_contoller)















module.exports = router