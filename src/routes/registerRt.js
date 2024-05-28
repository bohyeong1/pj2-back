const express = require('express')
const Accomodation = require('../models/Accomodation')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()
const multer = require('multer')
const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')
const config = require('../../config')


const storage = multer.memoryStorage();

const upload = multer({ storage })



/////////////////////////////////////////////////////////////////////////////////////////////////////////라우터
//////////////숙소등록
router.post('/register',expressAsyncHandler(async(req,res,next)=>{
    try{
        const accomodation = new Accomodation({
            main_img : req.body.main_img,
            img_inv : req.body.img_inv,
            title : req.body.title,
            cityName : req.body.cityName,
            price : req.body.price,
            adress : req.body.adress,
            category : req.body.category,
            grade : req.body.grade,
            summary : req.body.summary,
            base_facility : req.body.base_facility, 
            service_facility : req.body.service_facility,
            discount:req.body.discount,
            keyword:req.body.keyword
        })

        const newAccomodation = await accomodation.save()
        const {title, cityName, price, adress, category, summary,keyword} = newAccomodation
        res.json({
            code:200,
            title,cityName, price, adress, category, summary,keyword
        })
    }catch(e){
        res.status(401).json('에러발생')
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
router.post('/imgs',upload.array('homeImage',5) ,expressAsyncHandler(async(req,res,next)=>{

  console.log(req.files)


  const S3 = new AWS.S3({
      endpoint: new AWS.Endpoint(config.ENDPOINT),
      region: 'kr-standard',
      credentials: {
        accessKeyId: config.ACCESS_KEY,
        secretAccessKey: config.SECRET_KEY,
      },
    });     
    
    const imageLinks = []            //////////db에 저장하는 이미지 링크 string값

    ///////////////////이미지 오브젝트 스토리지로 전송 /////하나하나 전송해야 하는지? 동시에 전송하는 방법없는지????
    for(let i = 0; i<req.files.length; i++){
      const imageName = uuidv4(); // 랜덤 이미지 이름 생성

      await S3.putObject({
        Bucket: config.BUCKET_NAME,
        Key: `${imageName}.PNG`,
        ACL: 'public-read',
        // ACL을 지우면 전체공개가 되지 않습니다.
        Body: req.files[i].buffer,
        ContentType: 'image/png', // 파일 타입을 png로 지정
      }).promise();   

      imageLinks.push(`${config.ENDPOINT}/${config.BUCKET_NAME}/${imageName}.PNG`)
    }
    
    res.json({
      imageLink: imageLinks,
    });
}))




module.exports = router