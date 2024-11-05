const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const {validationResult} = require('express-validator')
const router = express.Router()

// =================================================
// multer //
const {user_multer} = require('../middlewares/common_middle/multer_middle')
// =================================================
// validator //
const {validateUserEmail} = require('../validation/validator')
// =================================================
// controller //
// get
const {user_get_login_check_controller} = require('../controllers/user_controller/get/user_get_login_check_controller')
const {user_getuser_controller} = require('../controllers/user_controller/user_getuser_controller')
const {user_duplicate_controller} = require('../controllers/user_controller/user_duplicate_controller')
const {user_login_controller} = require('../controllers/user_controller/user_login_controller')
const {verification_code_controller} = require('../controllers/user_controller/verification_code_controller')
const {email_auth_controller} = require('../controllers/user_controller/email_auth_controller')
// regist
const {user_initial_join_controller} = require('../controllers/user_controller/user_initial_join_controller')
const {user_nickname_controller} = require('../controllers/user_controller/user_nickname_controller')
const {user_profile_controller} = require('../controllers/user_controller/user_profile_controller')
// modify

// delete

// host
const {host_initial_controller} = require('../controllers/host_controller/host_initial_controller')
const {host_information_controller} = require('../controllers/host_controller/host_information_controller')
const {host_min_reservation_date_controller} = require('../controllers/host_controller/host_min_reservation_date_controller')
const {host_max_reservation_date_controller} = require('../controllers/host_controller/host_max_reservation_date_controller')
const {host_possible_date_contoller} = require('../controllers/host_controller/host_possible_date_contoller')
const {host_reservation_deadline_controller} = require('../controllers/host_controller/host_reservation_deadline_controller')
const {host_before_date_controller} = require('../controllers/host_controller/host_before_date_controller')
const {host_impossible_reservation_controller} = require('../controllers/host_controller/host_impossible_reservation_controller')
const {host_mypage_controller} = require('../controllers/host_controller/host_mypage_controller')

// refresh token
const {update_user_token_controller} = require('../controllers/user_controller/update_user_token_controller')


// =================================================
// ============= user 라 우 터 =================== //
// =================================================

// =================================================
// login //
router.post('/login',user_login_controller)

// =================================================
// update token(1시간 마다) //
router.get('/updateToken',update_user_token_controller)

// =================================================
// 로그인 체크 *사용자 정보 제공 //
router.get('/getuser',user_getuser_controller)

// =================================================
// 로그인 체크 *사용자 정보 미제공 db조회 안함 //
router.get('/login-check', user_get_login_check_controller)

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
// user 닉네임 업데이트 //
router.post('/nickname',user_nickname_controller)



// =================================================
// ============= host 라 우 터 =================== //
// =================================================

// =================================================
// host 자격 등록 //
router.post('/hostinitial',host_initial_controller)

// =================================================
// host text 초기 등록 및 수정 //
router.post('/hostinformation',host_information_controller)

// =================================================
// host 최소 숙박 일정 수정 //
router.put('/min-reservation-date', host_min_reservation_date_controller)

// =================================================
// host 최대 숙박 일정 수정 //
router.put('/max-reservation-date', host_max_reservation_date_controller)

// =================================================
// host 숙박 가능 기간 수정 //
router.put('/possible-date', host_possible_date_contoller)

// =================================================
// host 예약 마감 시한 수정 //
router.put('/reservation-deadline', host_reservation_deadline_controller)

// =================================================
// host 준비 기간 수정 //
router.put('/before-date', host_before_date_controller)

// =================================================
// host 예약 가능일 수정 //
router.put('/impossible-reservation', host_impossible_reservation_controller)

// =================================================
// host 마이페이지 수정 //
router.put('/host-mypage', user_multer, host_mypage_controller)
















// =================================================
// 회원정보 수정 //
router.put('/update',validateUserEmail ,expressAsyncHandler(async(req, res, next) => {

    // console.log(req.body)
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.status(400).json({
            code:400,
            message:'형식에 맞지 않는 데이터입니다',
            error : errors.array()
        })
    }else{
        const user = await User.findOne({
            userId : req.body.userId})  
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