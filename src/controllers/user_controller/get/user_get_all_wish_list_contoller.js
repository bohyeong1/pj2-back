const user_get_service = require('../../../service_layer/user/get/user_get_service')
const user_dto = require('../../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// uesr wisi list all get //
async function user_get_all_wish_list_contoller(req, res, next){
    const user = new user_dto({_id : req.body.user_id})
    const user_get_service_layer = new user_get_service()

    const result = await user_get_service_layer.get_my_all_wisi_lists(user)
    res.status(200).json(result)
}

module.exports = {
    user_get_all_wish_list_contoller : async_handler(user_get_all_wish_list_contoller)
}