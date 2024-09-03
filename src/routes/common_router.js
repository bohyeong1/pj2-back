// 공통
const express = require('express')
const Accomodation = require('../models/Accomodation')
const User = require('../models/User')
const Search = require('../models/Search')
const Evaluation = require('../models/Evaluation')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

// =================================================
// controller //
const acc_filter_controller = require('../controllers/common_controller/piece_controller/acc_filter_controller')
const acc_limit_controller = require('../controllers/common_controller/piece_controller/acc_limit_controller')
const acc_skip_controller = require('../controllers/common_controller/piece_controller/acc_skip_controller')
const acc_sort_controller = require('../controllers/common_controller/piece_controller/acc_sort_controller')
// main controller
const {acc_subapp_controller} = require('../controllers/common_controller/main_controller/acc_subapp_controller')



// =================================================
// ================== 라 우 터 =================== //
// =================================================

// =================================================
// subapp - main - api //
router.post('/',expressAsyncHandler(async(req,res,next)=>{
    const limit = req.body.limit
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
                const search = await Search.find({}).limit(limit)
                res.json({
                    code:200,
                    search}) 
            }
            // 전체 도시 분류 // limit 없음 검색어 컴포넌트에서 사용
            else if(req.body.filter === 'city' && !limit){
                const search = await Search.find({})
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

// =================================================
// detaill_app - - api //
router.post('/sellect',expressAsyncHandler(async(req,res,next)=>{
    try{
        const accomodations = await Accomodation.findOne({_id:req.body._id}).populate('seller')  //숙소 data
        const seller = accomodations.seller 

        //평가 data
        const evaluations = await Evaluation.find({
            homeid:req.body._id
        }).populate('writerid')

        // 총 데이터의 평균 평점 집계하기
        const aggreEvalu = await Evaluation.aggregate([
            {$match:{homeid: new ObjectId(req.body._id) }},
            {$unwind:'$evaluation' },
            {$group:{
                _id:{title: '$evaluation.title', url: '$evaluation.url'},
                average:{$avg : '$evaluation.grade'},
                count:{$sum : 1},
            }},
            {
                $sort:{'_id.title' : -1}
            }           
        ])

        if(accomodations && seller){
            res.json({
                code:200,
                accomodations, seller, evaluations, aggreEvalu  })
        }else{
            throw new Error('서버로 부터 데이터를 받는데 실패하였습니다.')
        }

    }catch(e){

        res.status(429).json({
            code:429,
            message:e.message
        })
    }
}))









module.exports = router