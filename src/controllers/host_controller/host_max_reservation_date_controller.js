const host_information_service = require('../../service_layer/host_information_service')
const user_dto = require('../../dto/user_dto')
const host_dto = require('../../dto/host_dto')
const async_handler = require('express-async-handler')

// =================================================
// 최대 숙박 일수 업데이트 //
async function host_max_reservation_date_controller(req, res, next){

    const user = new user_dto({token : req.cookies.auth_token})
    const host = new host_dto(
        {
            min_reservation_date : req.body.min_reservation_date,
            max_reservation_date : req.body.max_reservation_date
        }
    )

    const host_information_service_layer = new host_information_service()
    const result = await host_information_service_layer.update_max_reservation_date(user, host)
    res.status(200).json(result)
}

module.exports = {
    host_max_reservation_date_controller : async_handler(host_max_reservation_date_controller)
}