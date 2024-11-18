const reservation_update_service = require('../../../service_layer/reservation/update/reservation_update_service')
const user_dto = require('../../../dto/user_dto')
const accomodation_dto = require('../../../dto/accomodation_dto')
const async_handler = require('express-async-handler')
const evaluation_dto = require('../../../dto/evaluation_dto')
const reservation_dto = require('../../../dto/reservation_dto')

// =================================================
// 숙소 예약상품 평가 //
async function reservation_evaluation_controller(req, res, next){

    const user = new user_dto({token : req.cookies.auth_token})
    const accomodation = new accomodation_dto({_id : req.body.accomodation_id})
    const reservation = new reservation_dto({_id : req.body.reservation_id})
    const evaluation = new evaluation_dto(
        {
            rating : req.body.rating,
            text : req.body.text,
            total_average : req.body.total_average
        }
    )

    const reservation_update_service_layer = new reservation_update_service()
    const result = await reservation_update_service_layer.evaluation_reservation(user, accomodation, evaluation, reservation)
    res.status(200).json(result)
}

module.exports = {
    reservation_evaluation_controller : async_handler(reservation_evaluation_controller)
}
