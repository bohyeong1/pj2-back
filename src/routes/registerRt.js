const express = require('express')
const Accomodation = require('../models/Accomodation')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()
const multer = require('multer')
const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')
const config = require('../../config')
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

const storage = multer.memoryStorage();

const upload = multer({ storage })
const multiImg = upload.fields([{ name: 'mainImg', maxCount: 1 }, { name: 'subImg', maxCount: 4 },{name:'userData', maxCount:100}]) ////////main sub 이미지 동시에 받기


/////////////////////////////////////////////////////////////////////////////////////////////////////////라우터
//////////////숙소초기 등록
router.post('/register',expressAsyncHandler(async(req,res,next)=>{
    try{
        const accomodation = new Accomodation({
          seller:req.body.seller         
        })
        const newAccomodation = await accomodation.save()
        console.log(newAccomodation)
        if(newAccomodation){
          res.json({
            code:200,
            message:'숙소 등록 완료'
          })
        }else{
          res.status(401).json({
            code:401,
            message:'에러발생'
          })
        }

    }catch(e){
        res.status(401).json('에러발생')
    }
}))



//////////////////숙소 등록 후 업데이트
router.put('/register/update',expressAsyncHandler(async(req,res,next)=>{
  console.log(req.body)
  try{
    const accomodation = await Accomodation.findOne({
      seller:req.body.seller
    })

    // console.log(accomodation)

    if(!accomodation){
      res.status(404).json({ code: 404, message: '숙소 정보를 찾을 수 없습니다.'})
    }else{
      
      accomodation.title = req.body.title || accomodation.title
      accomodation.category = req.body.category || accomodation.category
      accomodation.main_img = req.body.main_img || accomodation.main_img
      accomodation.sub_img = req.body.sub_img || accomodation.sub_img
      accomodation.main_adress = req.body.main_adress || accomodation.main_adress
      accomodation.sub_adress = req.body.sub_adress || accomodation.sub_adress
      accomodation.sellState = req.body.sellState || accomodation.sellState
      accomodation.search_adress = req.body.search_adress || accomodation.search_adress
      accomodation.price = req.body.price || accomodation.price
      accomodation.addPrice = req.body.addPrice || accomodation.addPrice
      accomodation.space_category = req.body.space_category || accomodation.space_category
      accomodation.base_facility = req.body.base_facility || accomodation.base_facility
      accomodation.service_facility = req.body.service_facility || accomodation.service_facility
      accomodation.keywords = req.body.keywords || accomodation.keywords
      accomodation.capacity = req.body.capacity || accomodation.capacity
      accomodation.summary = req.body.summary || accomodation.summary
      accomodation.rules = req.body.rules || accomodation.rules
      accomodation.discount = req.body.discount || accomodation.discount
      accomodation.sellState = req.body.sellState || accomodation.sellState      


      const updatedaccomodation = await accomodation.save()
      
      // console.log(updatedaccomodation)

      res.json({
        code:200,
        updatedaccomodation
      })
    }
  }catch(e){
      res.status(401).json(e)
  }
}))


///////////////////////이미지 한개 날리기
router.post('/img',upload.single('homeImage') ,expressAsyncHandler(async(req,res,next)=>{

    console.log(req.file)

    const S3 = new AWS.S3({
        endpoint: new AWS.Endpoint(config.ENDPOINT),
        region: 'kr-standard',
        credentials: {
          accessKeyId: config.ACCESS_KEY,
          secretAccessKey: config.SECRET_KEY,
        },
      });    
      

    
      const imageName = uuidv4(); // 랜덤 이미지 이름 생성
      await S3.putObject({
        Bucket: config.BUCKET_NAME,
        Key: `${imageName}.PNG`,
        ACL: 'public-read',
        // ACL을 지우면 전체공개가 되지 않습니다.
        Body: req.file.buffer,
        ContentType: 'image/png', // 파일 타입을 png로 지정
      }).promise();
    
      res.json({
        imageLink: `${config.ENDPOINT}/${config.BUCKET_NAME}/${imageName}.PNG`,
      });
}))





///////////////////////이미지 여러개 날리기/ 초기 등록 5개로 제한
router.post('/imgs',multiImg ,expressAsyncHandler(async(req,res,next)=>{
  const text = await new Response(req.files.userData[0].buffer).text()     ///id 값   
  const parsingText = JSON.parse(text)         
  // console.log(JSON.parse(text))

  console.log(req.files.mainImg[0])


  // 네이버 오브젝트 스토리지에 이미지 저장 링크문자데이터만 db에 저장하기 
  const S3 = new AWS.S3({
      endpoint: new AWS.Endpoint(config.ENDPOINT),
      region: 'kr-standard',
      credentials: {
        accessKeyId: config.ACCESS_KEY,
        secretAccessKey: config.SECRET_KEY,
      },
    });     
    
    let mainImgUrls = ''
    const subImgUrls = []            //////////db에 저장하는 이미지 링크 string값


    ///////////////////이미지 오브젝트 스토리지로 전송 /////하나하나 전송해야 하는지? 동시에 전송하는 방법없는지????

    // 메인이미지 저장
    const imageName = uuidv4(); // 랜덤 이미지 이름 생성
    await S3.putObject({
      Bucket: config.BUCKET_NAME,
      Key: `${imageName}.PNG`,
      ACL: 'public-read',
      // ACL을 지우면 전체공개가 되지 않습니다.
      Body: req.files.mainImg[0].buffer,
      ContentType: 'image/png', // 파일 타입을 png로 지정
    }).promise();

    mainImgUrls = `${config.ENDPOINT}/${config.BUCKET_NAME}/${imageName}.PNG` ///메인 이미지 데이터 url값 저장


    // 서브 이미지 옵젝스토리지 저장
    for(let i = 0; i<req.files.subImg.length; i++){
      const imageName = uuidv4(); 

      await S3.putObject({
        Bucket: config.BUCKET_NAME,
        Key: `${imageName}.PNG`,
        ACL: 'public-read',
        Body: req.files.subImg[i].buffer,
        ContentType: 'image/png', 
      }).promise();  

      subImgUrls.push(`${config.ENDPOINT}/${config.BUCKET_NAME}/${imageName}.PNG`)
    }   


    // 문자 url db에 저장하기 ㅇ
    try{
      const accomodation = await Accomodation.findOne({
        seller:parsingText
      })

    if(!accomodation){
      res.status(404).json({ code: 404, message: '숙소 정보를 찾을 수 없습니다.'})
    }else{      
      
      accomodation.main_img = mainImgUrls || accomodation.main_img
      accomodation.sub_img = subImgUrls || accomodation.sub_img           

      const updatedaccomodation = await accomodation.save()
      
      console.log(updatedaccomodation)

      res.json({
        code:200,
        imgUrls :[...mainImgUrls, ...subImgUrls],
        message:'데이터 저장 성공'
      })
    }

    }catch(e){
      res.status(401).json(e)
    }

}))




module.exports = router