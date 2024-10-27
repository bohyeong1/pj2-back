const common_get_service = require('../../../service_layer/common/get/common_get_service')
const async_handler = require('express-async-handler')
const user_dto = require('../../../dto/user_dto')
const accomodation_dto = require('../../../dto/accomodation_dto')

// =================================================
// 예약 페이지 사용자 & 숙소 인증 컨트롤러 //
async function common_get_private_acc_user_controller(req, res, next){
    const accomodation_id = req.params.house

    const user = new user_dto({token : req.cookies.auth_token})
    const accomodation = new accomodation_dto({_id : accomodation_id})
    const common_get_service_layer = new common_get_service()

    const result = await common_get_service_layer.get_private_one_accomodation(user, accomodation)
    res.status(200).json(result)
}

module.exports = {
    common_get_private_acc_user_controller : async_handler(common_get_private_acc_user_controller)
}