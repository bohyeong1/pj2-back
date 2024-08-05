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

/////////////////////////////////////////////////////////////////////////////////////////////////////////라우터
////////////////////////숙소 리스트 메인 페이지 - 카테고리 별 분류 api
router.post('/',expressAsyncHandler(async(req,res,next)=>{
    const counts = req.body.counts
    const field = req.body.filter
    const keyword = req.body.keyword      

    try{
        if(req.body.filter && req.body.keyword){
                  
            const query = {[`${field}.name`] : keyword}
            const accomodations = await Accomodation.find(query).limit(counts)
           
            res.json({
                code:200,
                accomodations})
        }else if(req.body.filter && !req.body.keyword){
            // 전체 도시 분류
            if(req.body.filter === 'city'){
                const search = await Search.find({}).limit(counts)
                res.json({
                    code:200,
                    search}) 
            }
            // 할인상품
            else if(req.body.filter === 'discount'){
                const accommodations = await Accomodation.find({
                    discount: { $exists: true }
                  }).limit(counts)
                  
                res.json({
                    code:200,
                    accommodations}) 
            }
            // 전체
            else if(req.body.filter === 'all'){
                const accomodations = await Accomodation.find({}).limit(counts)

                res.json({
                    code:200,
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
            code:429,
            message:e
        })
    }
}))


//////////////////////////////////숙소 리스트 서브 페이지 - 카테고리 별 분류 api(중복 허용) / 페이지네이션 백엔드에서 처리 
router.post('/sub', expressAsyncHandler(async(req,res,next)=>{
    // 필터링 조건
    const city = {search_adress : req.body.city}
    const filters = req.body.filters
    const query = {...city, ...filters} // 필터 쿼리문

    // 페이지네이션 관련 쿼리문(연습해볼겸 쿼리스트링으로 실어서 해보기)
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * 10

    try{
        if(city && filters){
            const [total_count, accomodations] = await Promise.all([
                Accomodation.countDocuments(query),
                Accomodation.find(query).skip(skip).limit(10)
            ])            

            res.json({
                code:200,
                accomodations,
                totalPages: Math.ceil(total_count / limit),
                currentPage: page
            })
        }else{
            throw new Error('쿼리문 작성 불량 or 데이터 전송 에러')
        }
    }catch(e){
        console.log(e)
        res.status(429).json({
            code:429,
            message:e
        })
    }
}))

//////////////////////////////////////////////host페이지 등록 숙소
router.post('/host', expressAsyncHandler(async(req,res,next)=>{
    try{
        const accomodations = await Accomodation.find({
            seller : req.body.sellerid
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

/////////////////////////////////////숙소 한개 
router.post('/sellect',expressAsyncHandler(async(req,res,next)=>{
    try{
        const accomodations = await Accomodation.findOne({_id:req.body._id}).populate('seller')  //숙소 data
        const seller = accomodations.seller 

        //평가 data
        const evaluations = await Evaluation.find({
            homeid : req.body._id
        }).populate('writerid')

        // 총 데이터의 평균 평점 집계하기
        const aggreEvalu = await Evaluation.aggregate([
            {$match : {homeid: new ObjectId(req.body._id) }},
            {$unwind : "$evaluation" },
            {$group : {
                _id : {title: '$evaluation.title', url: '$evaluation.url'},
                average : {$avg : "$evaluation.grade"},
                count : {$sum : 1},
            }},
            {
                $sort : {"_id.title" : -1}
            }           
        ])

        console.log(aggreEvalu)

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