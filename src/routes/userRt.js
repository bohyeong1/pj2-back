const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const {validationResult} = require('express-validator')
const router = express.Router()
const {isAdmin, isAuth, generateToken} = require('../jwt/auth')
const config = require('../config/env_config')
// =================================================
// multer and img storage //
const multer = require('multer')
const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')
const storage = multer.memoryStorage();
const upload = multer({ storage })
const multiImg = upload.fields([{ name: 'userImg', maxCount: 1 }, {name:'userData', maxCount:100}]) 
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
// 이미지 등록 //
router.post('/userImg',multiImg ,expressAsyncHandler(async(req,res,next)=>{

    console.log(req.files)

    const text = await new Response(req.files.userData[0].buffer).text()     ///id 값   
    const parsingText = JSON.parse(text)         
    // console.log(parsingText)

  
    // 네이버 오브젝트 스토리지에 이미지 저장 링크문자데이터만 db에 저장하기 
    const S3 = new AWS.S3({
        endpoint: new AWS.Endpoint(config.ENDPOINT),
        region: 'kr-standard',
        credentials: {
          accessKeyId: config.ACCESS_KEY,
          secretAccessKey: config.SECRET_KEY,
        },
      });         

    //   ///////////////////이미지 오브젝트 스토리지로 전송 
  
      // 유저 저장
      const imageName = uuidv4(); // 랜덤 이미지 이름 생성
      await S3.putObject({
        Bucket: config.BUCKET_NAME,
        Key: `${imageName}.PNG`,
        ACL: 'public-read',
        // ACL을 지우면 전체공개가 되지 않습니다.
        Body: req.files.userImg[0].buffer,
        ContentType: 'image/png', // 파일 타입을 png로 지정
      }).promise();
  
      const userImgUrls = `${config.ENDPOINT}/${config.BUCKET_NAME}/${imageName}.PNG` ///유저 이미지 데이터 url값 저장 
  
      // 문자 url db에 저장하기 ㅇ
      try{
        const customer = await User.findOne({
          _id : parsingText
        })
        
        console.log(customer)

      if(!customer){
        res.status(404).json({ code: 404, message: '유저 정보를 찾을 수 없습니다.'})
      }else{      
        
        customer.profileImg = userImgUrls || customer.profileImg
         
  
        const updatedcustomer = await customer.save()
        
        console.log(updatedcustomer)
  
        res.json({
          code:200,
          imgUrls :userImgUrls,
          message:'데이터 저장 성공'
        })
      }
  
      }catch(e){
        res.status(401).json(e)
      }
  
}))



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