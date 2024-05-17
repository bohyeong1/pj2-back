const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const {validationResult} = require('express-validator')
const router = express.Router()




/////////////////////////////////////////////////////////////////////////////////////////////////////////라우터
//////////////////////////////////////////회원가입
router.post('/register', expressAsyncHandler(async(req,res,next)=>{
    try{

        const user = new User({
            name:req.body.name,
            email:req.body.email,
            userId:req.body.userId,
            password:req.body.password
        })
        const newUser = await user.save()

        console.log(newUser)

        const {name, email, userId, password} = newUser
        res.json({
            code:200,
            name, email, userId, password
        })
    }catch(e){
        res.status(401).json({
            code : 401,
            message : '유효하지 않은 정보를 입력하셨습니다.',
            e
        })
    }
}))

module.exports = router