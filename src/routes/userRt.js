const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const {validationResult} = require('express-validator')
const router = express.Router()
const {isAdmin, isAuth, generateToken} = require('../../auth')
const {
    validateUserName,
    validateUserEmail,
    validateUserPassword,
    validateUserId
} = require('../../validator')

const multer = require('multer')
const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')
const config = require('../../config')
const storage = multer.memoryStorage();
const upload = multer({ storage })
const multiImg = upload.fields([{ name: 'userImg', maxCount: 1 }, {name:'userData', maxCount:100}]) 

/////////////////////////////////////////////////////////////////////////////////////////////////////////라우터
//////////////////////////////////////////회원가입
router.post('/register', expressAsyncHandler(async(req,res,next)=>{
    console.log(req.body)
    try{
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            userId:req.body.userId,
            password:req.body.password,
            nickname:req.body.nickname
        })
        const newUser = await user.save()

        // console.log(newUser)

        res.json({
            code:200,
            newUser, 
            token : generateToken(newUser)
        })
    }catch(e){
        res.status(401).json({
            code : 401,
            message : '유효하지 않은 정보를 입력하셨습니다.',
            e
        })
    }
}))

/////////////////토큰으로 유저data get
// router.get('/loginState', isAuth)

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
            const {name, email, userId, isAdmin, createdAt, cashInv, profileImg,createAt,hostText} = loginUser
            res.json({
                code:200,
                name, email, userId, isAdmin, createdAt, cashInv,profileImg,createAt,hostText,
                token : generateToken(loginUser),
                message : '관리자 로그인'
            })                                                                                                                                                                              
        }else{
            const {name, email, userId, isAdmin, createdAt, _id, cashInv,profileImg,createAt,hostText} = loginUser
            res.json({
                code:200,
                name, email, userId, isAdmin, createdAt,_id, cashInv,profileImg,createAt,hostText,
                token : generateToken(loginUser)
            })
        }       
    }
}))


///////////////////////이미지 등록
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



//////////////////////////////////// 회원정보 수정하기
//인증폼

router.put('/update',[validateUserName(),
    validateUserEmail(),
    validateUserId()] ,expressAsyncHandler(async(req, res, next) => {

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



/////////////////////////////////////////호스트 정보 수정하기
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




///////////////////////////////////////// 회원정보 삭제하기
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