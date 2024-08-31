const accomodation_get_service = require('../../service_layer/accomodation_get_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')


// =================================================
// 숙소 secret get //
async function acc_secret_get_controller(req, res, next){
    const user = new user_dto({token : req.cookies.auth_token})
    const accomodation_get_service_layer = new accomodation_get_service()

    const result = await accomodation_get_service_layer.regist_lv0(user)
    res.status(200).json(result)
}

module.exports = {
    acc_secret_get_controller : async_handler(acc_secret_get_controller)
}
