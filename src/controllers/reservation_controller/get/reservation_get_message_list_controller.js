const reservation_get_service = require('../../../service_layer/reservation/get/reservation_get_service')
const user_dto = require('../../../dto/user_dto')
const reservation_dto = require('../../../dto/reservation_dto')
const async_handler = require('express-async-handler')

// =================================================
// 숙소 message list //
async function reservation_get_message_list_controller(req, res, next){

    const user = new user_dto({token : req.cookies.auth_token})
    const reservation = new reservation_dto({type : req.body.type})

    const reservation_get_service_layer = new reservation_get_service()
    const result = await reservation_get_service_layer.get_reservation_message_list(user, reservation)
    res.status(200).json(result)
}

module.exports = {
    reservation_get_message_list_controller : async_handler(reservation_get_message_list_controller)
}