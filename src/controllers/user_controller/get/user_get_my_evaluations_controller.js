const user_get_service = require('../../../service_layer/user/get/user_get_service')
const user_dto = require('../../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// uesr 평가 항목 get //
async function user_get_my_evaluations_controller(req, res, next){
    const user = new user_dto({_id : req.body._id})
    const user_get_service_layer = new user_get_service()

    const result = await user_get_service_layer.get_my_evaluations(user)
    res.status(200).json(result)
}

module.exports = {
    user_get_my_evaluations_controller : async_handler(user_get_my_evaluations_controller)
}