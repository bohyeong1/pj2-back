const common_get_service = require('../../../service_layer/common/get/common_get_service')
const async_handler = require('express-async-handler')
const search_dto = require('../../../dto/search_dto')

// =================================================
// 검색어 컨트롤러 //
async function common_get_search_controller(req, res, next){

    const search = new search_dto({input : req.body.input})
    const common_get_service_layer = new common_get_service()

    const result = await common_get_service_layer.common_get_search_data(search)
    res.status(200).json(result)
}

module.exports = {
    common_get_search_controller : async_handler(common_get_search_controller)
}