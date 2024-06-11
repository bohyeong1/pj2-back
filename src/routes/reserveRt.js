//숙소예약
const express = require('express')
const Accomodation = require('../models/Accomodation')
const User = require('../models/User')
const Reservaiton = require('../models/Reservation')
const expressAsyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

const router = express.Router()



/////////////예약 등록
router.post('/reserv', expressAsyncHandler(async(req,res,next)=>{

    console.log(req.body.homeid)
    
    await Accomodation.updateOne({_id : req.body.homeid},{
        $set:{
            buyer : req.body.buyerid
        }
    }) 

    const accomodation = await Accomodation.findOne({_id : req.body.homeid})

    console.log(accomodation)

    const seller = await User.updateOne({_id: accomodation.seller},{
        $inc:{
            cashInv : req.body.totalPrice
        }
    })

    const buyer = await User.updateOne({_id : req.body.buyerid},{
        $inc:{
            cashInv : -req.body.totalPrice
        }
    })

    try{
        if(accomodation){
            const reservationInfo = new Reservaiton({
                title:accomodation.title,
                main_img:accomodation.main_img,
                seller: accomodation.seller,
                buyer: accomodation.buyer,
                accomodation: accomodation._id,
                main_adress : accomodation.main_adress,
                sub_adress : accomodation.sub_adress,
                category : accomodation.category,
                totalPrice : req.body.totalPrice ,
                capacity : req.body.capacity ,
                price : req.body.price ,
                restDay : req.body.restDay ,
                summary : accomodation.summary,
                rules : accomodation.rules         
              })

              const newReservationInfo = await reservationInfo.save()
            //   console.log(newReservationInfo)
              if(newReservationInfo){
                res.json({
                  code:200,
                  message:'숙소 예약 완료'
                })
              }else{
                res.status(401).json({
                  code:401,
                  message:'예약실패'
                })
              }
        }else{
            throw new Error('숙소 데이터 로드 실패')
        }


    }catch(e){
        res.status(401).json({
            code:401,
            error:e
        })
    }
}))

////////////예약 리스트 얻기<게스트용>
router.post('/', expressAsyncHandler(async(req,res,next)=>{
    const reservation = await Reservaiton.find({
        buyer : req.body.userId
    }).populate('seller')
    console.log(reservation)
    res.json(reservation)
}))


////////////예약 리스트 얻기<호스트용>
router.post('/host', expressAsyncHandler(async(req,res,next)=>{
    console.log(req.body)
    const reservation = await Reservaiton.find({
        seller : req.body.userId
    }).populate('buyer')

    res.json(reservation)
}))




module.exports = router