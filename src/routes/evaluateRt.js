//숙소평가
const express = require('express')
const router = express.Router()
const Accomodation = require('../models/Accomodation')
const User = require('../models/User')
const Evaluation = require('../models/Evaluation')
const expressAsyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

///확인용
router.get('/', (req,res,next)=>{
    res.json('연동완료')
})


// writerNickname
// writerImg


///////숙소평가 and 댓글 등록
router.post('/regist', expressAsyncHandler(async(req,res,next)=>{


    const writer = await User.findOne({
        _id : req.body.writerid
    })

    const accomodation = await Accomodation.findOne({
        _id : req.body.homeid
    })

    console.log(accomodation)

    const seller = await User.findOne({
        _id : accomodation.seller
    })

    try{
        if(writer && accomodation && seller){
            const evaluation = new Evaluation({
                writerid : req.body.writerid,
                sellerid : seller._id,
                homeid : req.body.homeid,
                evaluation : req.body.evaluation,
                text : req.body.text,
                totalGrade : req.body.totalGrade
            })
            const newEvaluation = await evaluation.save()
            if(newEvaluation){
                res.json('댓글등록 성공')  
            }else{
                res.status(401).json({
                    code:401,
                    message:'댓글등록에 실패하였습니다.'
                })
            }
        }else{
            throw new Error('서버 정보를 불러오지 못했습니다.')
        }
    }catch(e){
        res.status(401).json({
            message:e.message
        })
    }

}))



module.exports = router