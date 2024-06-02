//숙소예약
const express = require('express')
const Accomodation = require('../models/Accomodation')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

const router = express.Router()




router.post('/reserv', expressAsyncHandler(async(req,res,next)=>{
    
    const accomodation = await Accomodation.findOne({
        _id : req.body.homeid
    }) 

    // const buyer = await 
    const seller = await accomodation.populate('seller')


    // console.log('accomodation')
    console.log(seller)
    res.json(accomodation)
    // try{
    //     const reservationInfo = await new Accomodation({
    //       title:accomodation.title,
    //       main_img:accomodation.main_img,
    //       seller: seller._id,
    //       buyer: buyer._id,
    //       accomodation: accomodation._id,
    //       main_adress : accomodation.main_adress,
    //       sub_adress : accomodation.sub_adress,
    //       category : accomodation.category,
    //       totalPrice : req.body. ,
    //       capacity : req.body. ,
    //       price : req.body. ,
    //       restDay : req.body. ,
    //       summary : accomodation.summary,
    //       rules : accomodation.reles         
    //     })
    //     const newReservationInfo = await reservationInfo.save()
    //     console.log(newReservationInfo)
    //     if(newReservationInfo){
    //       res.json({
    //         code:200,
    //         message:'숙소 예약 완료'
    //       })
    //     }else{
    //       res.status(401).json({
    //         code:401,
    //         message:'에러발생'
    //       })
    //     }

    // }catch(e){
    //     res.status(401).json('에러발생')
    // }
}))







module.exports = router