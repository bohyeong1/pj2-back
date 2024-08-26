const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const {validationResult} = require('express-validator')
const router = express.Router()
const {isAdmin, isAuth, generateToken} = require('../jwt/auth')
const config = require('../config/env_config')

// =================================================
// multer //
const {user_multer} = require('../middlewares/common_middle/multer_middle')
// =================================================
// validator //
const {validateUserEmail} = require('../validation/validator')
// =================================================
// controller //
const {user_getuser_controller} = require('../controllers/user_controller/user_getuser_controller')
const {user_login_controller} = require('../controllers/user_controller/user_login_controller')
const {user_duplicate_controller} = require('../controllers/user_controller/user_duplicate_controller')
const {user_initial_join_controller} = require('../controllers/user_controller/user_initial_join_controller')
const {user_maintain_controller} = require('../controllers/user_controller/user_maintain_controller')
const {verification_code_controller} = require('../controllers/user_controller/verification_code_controller')
const {email_auth_controller} = require('../controllers/user_controller/email_auth_controller')
const {user_nickname_controller} = require('../controllers/user_controller/user_nickname_controller')
const {user_profile_controller} = require('../controllers/user_controller/user_profile_controller')
const {host_initial_controller} = require('../controllers/host_controller/host_initial_controller')



////////////////////////////////////////////////////
//////////////////// 라 우 터 //////////////////////
///////////////////////////////////////////////////

// =================================================
// 마일리지 //
router.post('/mileage', expressAsyncHandler(async (req, res, next)=>{
    const logUser = await User.findOne({
        userId : req.body.userId
    })
    if(!logUser){
        res.status(401).json({code:401, message : '아이디 또는 비밀번호를 잘못 입력했습니다.'})
    }else{
        const {name, email, userId, isAdmin, createdAt, _id, cashInv, profileImg,createAt,hostText} = logUser
            res.json({
                code:200,
                name, email, userId, isAdmin, createdAt,_id, cashInv,profileImg,createAt,hostText,
                token : generateToken(logUser)
            })
    }
}))


// =================================================
// login //
router.post('/login',user_login_controller)

// =================================================
// 로그인 유지 *사용자 정보 제공 //
router.get('/getuser',user_getuser_controller)

// =================================================
// 로그인 유지 *사용자 정보 미제공 db조회 안함 //
router.get('/maintain',user_maintain_controller)

// =================================================
// user id 중복 체크 //
router.post('/duplicate',user_duplicate_controller)

// =================================================
// user 초기 회원가입 //
router.post('/initailjoin',user_initial_join_controller)

// =================================================
// user 이메일 인증 코드 발급 //
router.post('/verification',verification_code_controller)
// validateUserEmail,

// =================================================
// user 이메일 인증 확인 //
router.post('/authemail', email_auth_controller)

// =================================================
// user 이미지 + 닉네임 업데이트 //
router.post('/profile', user_multer, user_profile_controller)

// =================================================
// user 이메일 인증 확인 //
router.post('/nickname',user_nickname_controller)

// =================================================
// host 자격 등록 //
router.post('/hostinitial',host_initial_controller)


// =================================================
// 회원정보 수정 //
router.put('/update',validateUserEmail ,expressAsyncHandler(async(req, res, next) => {

    // console.log(req.body)
    const errors = validationResult(req)

    console.log(req.body)

    if(!errors.isEmpty()){
        res.status(400).json({
            code:400,
            message:'형식에 맞지 않는 데이터입니다',
            error : errors.array()
        })
    }else{
        const user = await User.findOne({
            userId : req.body.userId})  
            // console.log(user)
        if(!user){
            res.status(404).json({ code: 404, message: '유저를 찾을 수 없습니다'})
        }else{

            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.nickname = req.body.nickname || user.nickname
            user.hostText = req.body.hostText || user.hostText
            const updatedUser = await user.save()

            console.log(updatedUser)  
            res.json({
                code:200,
                updatedUser
            })
        }
    }    
}))



// =================================================
// 호스트 정보 수정 //
router.put('/host', expressAsyncHandler(async(req,res,next) => {
    const user = await User.findOne({
        userId : req.body.userId}) 

        console.log(user)

    if(!user){
        res.status(404).json({ code: 404, message: '유저를 찾을 수 없습니다'})
    }else{
        user.hostText = req.body.hostText || user.hostText

        const updatedUser = await user.save()

        console.log(updatedUser)  
        res.json({
            code:200,
            updatedUser
        })
    }
}))




// =================================================
// 회원탈퇴 //
router.delete('/delete', expressAsyncHandler(async(req, res, next) => {

    const user = await User.find({
        userId : req.body.userId,
        password : req.body.password})

    if(!user){

        res.status(404).json({code: 404, message : '유저를 찾을 수 없습니다'})
    }else{
        await User.deleteOne({
            userId : req.body.userId,
            password : req.body.password
        })


        res.status(200).json({code:200, message: '성공적으로 삭제가 완료되었습니다.'})
    }
}))




module.exports = router