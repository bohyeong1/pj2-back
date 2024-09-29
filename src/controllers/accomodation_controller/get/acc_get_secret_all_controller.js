const accomodation_get_service = require('../../../service_layer/accomodation_get_service')
const user_dto = require('../../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// host page 등록된 모든 숙소 정보 제공 api //
async function acc_get_secret_all_controller(req, res, next){
    const user = new user_dto({_id : req.body._id})
    const accomodation_get_service_layer = new accomodation_get_service()

    const result = await accomodation_get_service_layer.secret_all_get(user)
    res.status(200).json(result)
}

module.exports = {
    acc_get_secret_all_controller : async_handler(acc_get_secret_all_controller)
}