// 공통
const express = require('express')
const Accomodation = require('../models/Accomodation')
const Category = require('../models/Category')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()

/////////////////////////////////////////////////////////////////////////////////////////////////////////라우터
////////////////////////숙소 리스트 
router.post('/',expressAsyncHandler(async(req,res,next)=>{
    console.log(req.body.query)
    try{
        const accomodations = await Accomodation.find({...req.body.query})
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

/////////////////////////////////////숙소 한개 
router.post('/sellect',expressAsyncHandler(async(req,res,next)=>{
    console.log(req.body._id)

    try{
        const accomodations = await Accomodation.find({_id:req.body._id})
        console.log(accomodations)
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

/////////////////////////////// 숙소 카테고리(도시 지역)별 분류
router.get('/cityName', expressAsyncHandler(async(req,res,next)=>{
    try{
        const citys = await Category.find({})
        // console.log(citys)
        res.json({
            code:200,
            citys
        })
    }catch(e){
        res.status(429).json({
            code:429,
            message:'서버로 부터 데이터를 받는데 실패하였습니다.'
        }) 
    }
}))


///////////////////////////////////////////////////////조건 쿼리 post로 빼서 필터링하기
// try{
//     const qs = decodeURIComponent(req.query.service_facility)
//     console.log(qs.split(','))
//     const q1 = qs ? { service_facility: { $all: qs.split(',') } } : {}
//     console.log(req.query)
//     const accomodations = await Accomodation.find({...q1})
   
//     console.log(accomodations)
//     res.json({
//         code:200,
//         accomodations})

// }catch(e){
//     console.log(e)
//     res.status(429).json({
//         code:429,
//         message:'서버로 부터 데이터를 받는데 실패하였습니다.'
//     })

// }


module.exports = router