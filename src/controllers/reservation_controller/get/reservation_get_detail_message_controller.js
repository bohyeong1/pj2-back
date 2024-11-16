const reservation_get_service = require('../../../service_layer/reservation/get/reservation_get_service')
const user_dto = require('../../../dto/user_dto')
const reservation_dto = require('../../../dto/reservation_dto')
const async_handler = require('express-async-handler')

// =================================================
// 숙소 host, guest massage //
async function reservation_get_detail_message_controller(req, res, next){
    const reservation_id = req.params.reservation

    const user = new user_dto({token : req.cookies.auth_token})
    const reservation = new reservation_dto({_id : reservation_id})
    const reservation_get_service_layer = new reservation_get_service()
    const result = await reservation_get_service_layer.get_reservation_detail_message(user, reservation)
    res.status(200).json(result)
}

module.exports = {
    reservation_get_detail_message_controller : async_handler(reservation_get_detail_message_controller)
}