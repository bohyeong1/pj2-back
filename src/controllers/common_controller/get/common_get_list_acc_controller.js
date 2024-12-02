const common_get_service = require('../../../service_layer/common/get/common_get_service')
const async_handler = require('express-async-handler')

// =================================================
// 리스트 페이지 숙소 요청 컨트롤러 //
async function common_get_list_acc_controller(req, res, next){
    const decode_query = Object.fromEntries(
        Object.entries(req.query).map(([key, value]) => [
            key, 
            Array.isArray(value) ? 
            value.map((v) => decodeURIComponent(v)) : 
            decodeURIComponent(value)
        ])
    )

    const common_get_service_layer = new common_get_service()
    const result = await common_get_service_layer.common_get_list_accomodation(decode_query)

    res.status(200).json(result)
}

module.exports = {
    common_get_list_acc_controller : async_handler(common_get_list_acc_controller)
}