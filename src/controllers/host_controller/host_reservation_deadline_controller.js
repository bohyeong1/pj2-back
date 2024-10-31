const host_information_service = require('../../service_layer/host_information_service')
const user_dto = require('../../dto/user_dto')
const host_dto = require('../../dto/host_dto')
const async_handler = require('express-async-handler')

// =================================================
// 예약 마감 시한 업데이트 //
async function host_reservation_deadline_controller(req, res, next){

    const user = new user_dto({token : req.cookies.auth_token})
    const host = new host_dto(
        {reservation_deadline : req.body.reservation_deadline}
    )

    const host_information_service_layer = new host_information_service()
    const result = await host_information_service_layer.update_reservation_deadline(user, host)
    res.status(200).json(result)
}

module.exports = {
    host_reservation_deadline_controller : async_handler(host_reservation_deadline_controller)
}