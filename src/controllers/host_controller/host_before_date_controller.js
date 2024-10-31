const host_information_service = require('../../service_layer/host_information_service')
const user_dto = require('../../dto/user_dto')
const host_dto = require('../../dto/host_dto')
const async_handler = require('express-async-handler')

// =================================================
// 준비 기간 업데이트 //
async function host_before_date_controller(req, res, next){

    const user = new user_dto({token : req.cookies.auth_token})
    const host = new host_dto(
        {before_date : req.body.before_date}
    )

    const host_information_service_layer = new host_information_service()
    const result = await host_information_service_layer.update_before_date(user, host)
    res.status(200).json(result)
}

module.exports = {
    host_before_date_controller : async_handler(host_before_date_controller)
}