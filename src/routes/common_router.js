// 공통
const express = require('express')
const Accomodation = require('../models/Accomodation')
const User = require('../models/User')
const Search = require('../models/Search')
const City = require('../models/City')
const Evaluation = require('../models/Evaluation')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

// =================================================
// controller //
// get
const {acc_get_detail_controller} = require('../controllers/common_controller/get/acc_get_detail_controller')
const acc_filter_controller = require('../controllers/common_controller/piece_controller/acc_filter_controller')
const acc_limit_controller = require('../controllers/common_controller/piece_controller/acc_limit_controller')
const acc_skip_controller = require('../controllers/common_controller/piece_controller/acc_skip_controller')
const acc_sort_controller = require('../controllers/common_controller/piece_controller/acc_sort_controller')
const {common_get_search_controller} = require('../controllers/common_controller/get/common_get_search_controller')
const {common_get_private_acc_user_controller} = require('../controllers/common_controller/get/common_get_private_acc_user_controller')

// main controller
const {acc_subapp_controller} = require('../controllers/common_controller/main_controller/acc_subapp_controller')



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
                const search = await City.find({}).limit(limit)
                res.json({
                    code:200,
                    search}) 
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
// subapp - list - api //
router.post('/sub', acc_filter_controller, acc_sort_controller, acc_skip_controller, acc_limit_controller, acc_subapp_controller)

// =================================================
// subapp - modal - api //
router.post('/submodal', acc_filter_controller, acc_sort_controller, acc_limit_controller, acc_subapp_controller)

// =================================================
// 숙소 상세 페이지 //
router.post('/detail/:house', acc_get_detail_controller)

// =================================================
// 검색어 출력 api //
router.post('/search', common_get_search_controller)

// =================================================
// login check, 숙소 정보 api //
router.post('/private/accomodation-user/:house', common_get_private_acc_user_controller)












//////////////////////////////////////////////host페이지 등록 숙소
router.post('/host', expressAsyncHandler(async(req,res,next)=>{
    try{
        const accomodations = await Accomodation.find({
            seller:req.body.sellerid
        })
            res.json({
            code:200,
            accomodations})

    }catch(e){
        console.log(e)
        res.status(429).json({
            code:429,
            message:'서버로 부터 데이터를 받는데 실패하였습니다.'
        })
    }
}))



module.exports = router