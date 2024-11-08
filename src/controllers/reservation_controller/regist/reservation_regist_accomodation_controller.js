const reservation_regist_service = require('../../../service_layer/reservation/regist/reservation_regist_service')
const user_dto = require('../../../dto/user_dto')
const accomodation_dto = require('../../../dto/accomodation_dto')
const reservation_dto = require('../../../dto/reservation_dto')
const async_handler = require('express-async-handler')

// =================================================
// 숙소 예약 등록 //
async function reservation_regist_accomodation_controller(req, res, next){
    const accomodation_id = req.params.house

    const user = new user_dto({token : req.cookies.auth_token})
    const accomodation = new accomodation_dto({_id : accomodation_id})
    const reservation = new reservation_dto(
        {
            total_price : req.body.total_price,
            capacity : req.body.capacity,
            checkin : req.body.checkin,
            checkout : req.body.checkout,
            stay_day : req.body.stay_day
        }
    )

    const reservation_regist_service_layer = new reservation_regist_service()
    const result = await reservation_regist_service_layer.regist_reservation(user, accomodation, reservation)
    res.status(200).json(result)
}

module.exports = {
    reservation_regist_accomodation_controller : async_handler(reservation_regist_accomodation_controller)
}