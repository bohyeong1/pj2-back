const common_get_service = require('../../../service_layer/common/get/common_get_service')
const async_handler = require('express-async-handler')
const search_dto = require('../../../dto/search_dto')

// =================================================
// 검색 데이터 체크 및 검색어 db update 컨트롤러 //
async function common_get_search_result_check_contoller(req, res, next){

    const search = new search_dto(
        {
            location : req.body.location,
            date : {
                ...req.body.date,
                checkin : new Date(req.body.date.checkin),
                checkout : new Date(req.body.date.checkout)
            },
            capacity : req.body.capacity
        }
    )
    const common_get_service_layer = new common_get_service()

    const result = await common_get_service_layer.common_get_search_result_check(search)
    res.status(200).json(result)
}

module.exports = {
    common_get_search_result_check_contoller : async_handler(common_get_search_result_check_contoller)
}