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

// 파이프라인 모듈
const {accomodation_pipe, accomodation_sort_pipe} = require('../pipelines/accomodation-pipe')

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
            // 전체 도시 분류 // limit 있음
            if(req.body.filter === 'city' && counts){
                const search = await Search.find({}).limit(counts)
                res.json({
                    code:200,
                    search}) 
            }
            // 전체 도시 분류 // limit 없음 검색어 컴포넌트에서 사용
            else if(req.body.filter === 'city' && !counts){
                const search = await Search.find({})
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
                    code : 200,
                    accommodations}) 
            }
            // 전체
            else if(req.body.filter === 'all'){
                const accomodations = await Accomodation.find({}).limit(counts)

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


//////////////////////////////////숙소 리스트 서브 페이지 - 카테고리 별 분류 api(중복 허용) / 페이지네이션 백엔드에서 처리 
router.post('/sub', expressAsyncHandler(async(req,res,next)=>{
    // 필터링 조건
    const city = {search_adress : req.body.city}
    const filters = req.body.filters
    const query = {...city, ...filters} // 필터 쿼리문

    // 분류 조건
    const sort = req.body.sort
    
    // 페이지네이션 관련 쿼리문(연습해볼겸 쿼리스트링으로 실어서 해보기)
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * 10

    // console.log(sort)

    try{
        if(city && filters && sort){
            // 최신순 정렬
            if(sort === 'createAt'){
                const [total_counts, accomodations] = await Promise.all([
                    Accomodation.countDocuments(query),
                    Accomodation.aggregate([
                        {$match : query},
                        ...accomodation_pipe(),
                        {$sort :{[sort]:-1}},
                        {$skip : skip},
                        {$limit : limit}
                    ])
                ])                        
                res.json({
                    code : 200,
                    accomodations,
                    total_pages : Math.ceil(total_counts / limit),
                    total_counts : total_counts
                })
            }
            // 비싼 가격순 정렬
            else if(sort === 'price%2Fmax'){
                const [total_counts, accomodations] = await Promise.all([
                    Accomodation.countDocuments(query),
                    Accomodation.aggregate([
                        {$match : query},
                        ...accomodation_pipe(),
                        ...accomodation_sort_pipe('price',-1),
                        {$skip : skip},
                        {$limit : limit}
                    ])
                ])             
                res.json({
                    code : 200,
                    accomodations,
                    total_pages : Math.ceil(total_counts / limit),
                    total_counts : total_counts
                })
            }
            // 싼 가격순 정렬
            else if(sort === 'price%2Fmin'){
                const [total_counts, accomodations] = await Promise.all([
                    Accomodation.countDocuments(query),
                    Accomodation.aggregate([
                        {$match : query},
                        ...accomodation_pipe(),
                        ...accomodation_sort_pipe('price',1),
                        {$skip : skip},
                        {$limit : limit}
                    ])
                ])             
                res.json({
                    code:200,
                    accomodations,
                    total_pages: Math.ceil(total_counts / limit),
                    total_counts:total_counts
                })
            }
            // 리뷰 많은 순 정렬
            else if(sort === 'replay%2Fmax'){
                const [total_counts, accomodations] = await Promise.all([
                    Accomodation.countDocuments(query),
                    Accomodation.aggregate([
                        {$match : query},
                        ...accomodation_pipe(),
                        ...accomodation_sort_pipe('counts_review',-1),
                        {$skip : skip},
                        {$limit : limit}
                    ])
                ])             
                res.json({
                    code:200,
                    accomodations,
                    total_pages: Math.ceil(total_counts / limit),
                    total_counts:total_counts
                })
            }
            // 평점 높은 순 정렬
            else if(sort === 'evaluation%2Fmax'){
                const [total_counts, accomodations] = await Promise.all([
                    Accomodation.countDocuments(query),
                    Accomodation.aggregate([
                        {$match : query},
                        ...accomodation_pipe(),
                        ...accomodation_sort_pipe('average', -1),
                        {$skip : skip},
                        {$limit : limit}
                    ])
                ])             
                res.json({
                    code:200,
                    accomodations,
                    total_pages:Math.ceil(total_counts / limit),
                    total_counts:total_counts
                })
            }else{
                throw new Error(e)
            }

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

/////////////////////////////////////숙소 한개 
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