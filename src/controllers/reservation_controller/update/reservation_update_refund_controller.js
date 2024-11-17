const reservation_update_service = require('../../../service_layer/reservation/update/reservation_update_service')
const user_dto = require('../../../dto/user_dto')
const reservation_dto = require('../../../dto/reservation_dto')
const async_handler = require('express-async-handler')

// =================================================
// 숙소 예약상품 환불(자동) //
async function reservation_update_refund_controller(req, res, next){
    const reservation_id = req.params.house

    const user = new user_dto({token : req.cookies.auth_token})
    const reservation = new reservation_dto({_id : reservation_id})

    const reservation_update_service_layer = new reservation_update_service()
    const result = await reservation_update_service_layer.refund_reservation(user, reservation)
    res.status(200).json(result)
}

module.exports = {
    reservation_update_refund_controller : async_handler(reservation_update_refund_controller)
}