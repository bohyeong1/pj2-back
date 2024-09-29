const accomodation_get_service = require('../../../service_layer/accomodation_get_service')
const accomodation_dto = require('../../../dto/accomodation_dto')
const async_handler = require('express-async-handler')

// =================================================
// 숙소 지역 가격 평균 조회 컨트롤러 //
async function acc_get_local_average_contrller(req, res, next){
    const accomodation = new accomodation_dto({search_adress : req.body.search_adress})
    const accomodation_get_service_layer = new accomodation_get_service()

    const result = await accomodation_get_service_layer.local_average_get(accomodation)
    res.status(200).json(result)
}

module.exports = {
    acc_get_local_average_contrller : async_handler(acc_get_local_average_contrller)
}