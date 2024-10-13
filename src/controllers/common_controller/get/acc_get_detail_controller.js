const common_get_service = require('../../../service_layer/common/get/common_get_service')
const accomodation_dto = require('../../../dto/accomodation_dto')
const async_handler = require('express-async-handler')

// =================================================
// 숙소 평균 평점, 평가 인원 요청 컨트롤러 //
async function acc_get_detail_controller(req, res, next){
    const accomodation_id = req.params.house

    const accomodation = new accomodation_dto({_id : accomodation_id})
    const common_get_service_layer = new common_get_service()

    const result = await common_get_service_layer.common_get_detail_accomodation(accomodation)
    res.status(200).json(result)
}

module.exports = {
    acc_get_detail_controller : async_handler(acc_get_detail_controller)
}