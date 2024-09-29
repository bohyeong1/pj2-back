const accomodation_get_service = require('../../../service_layer/accomodation_get_service')
const user_dto = require('../../../dto/user_dto')
const accomodation_dto = require('../../../dto/accomodation_dto')
const async_handler = require('express-async-handler')

// =================================================
// host page 등록된 1개 숙소 정보 제공 api(cookie & accomodation _id값 필요) //
async function acc_get_secret_controller(req, res, next){
    const accomodation_id = req.params.house

    const user = new user_dto({token : req.cookies.auth_token})
    const accomodation = new accomodation_dto({_id : accomodation_id})
    const accomodation_get_service_layer = new accomodation_get_service()

    const result = await accomodation_get_service_layer.secret_get(user, accomodation)
    res.status(200).json(result)
}

module.exports = {
    acc_get_secret_controller : async_handler(acc_get_secret_controller)
}