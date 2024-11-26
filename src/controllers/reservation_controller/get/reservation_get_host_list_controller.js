const reservation_get_service = require('../../../service_layer/reservation/get/reservation_get_service')
const user_dto = require('../../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// 숙소 예약목록 리스트 //
async function reservation_get_host_list_controller(req, res, next){

    const user = new user_dto({_id : req.body.user_id})
    const reservation_get_service_layer = new reservation_get_service()
    const result = await reservation_get_service_layer.get_reservation_host_list(user)
    res.status(200).json(result)
}

module.exports = {
    reservation_get_host_list_controller : async_handler(reservation_get_host_list_controller)
}