const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const {validationResult} = require('express-validator')
const router = express.Router()
const {isAdmin, isAuth, generateToken} = require('../../auth')




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


/////////////////////////////////////로그인
router.post('/login', expressAsyncHandler(async (req, res, next)=>{
    console.log(req.body)

    const loginUser = await User.findOne({
        userId : req.body.userId,
        password : req.body.password
    })

    if(!loginUser){
        console.log(loginUser)
        res.status(401).json({code:401, message : '아이디 또는 비밀번호를 잘못 입력했습니다.'})
    }else{
        if(loginUser.isAdmin){                  ////////////////관리자 로그인
         console.log('관리자 로그인')                                                                                                                                                                              
        }else{
            const {name, email, userId, isAdmin, createdAt} = loginUser
            res.json({
                code:200,
                name, email, userId, isAdmin, createdAt,
                token : generateToken(loginUser)
            })
        }       
    }
}))

module.exports = router