const express = require('express')
const Accomodation = require('../models/Accomodation')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()


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



module.exports = router