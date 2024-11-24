const user_get_service = require('../../../service_layer/user/get/user_get_service')
const user_dto = require('../../../dto/user_dto')
const accomodation_dto = require('../../../dto/accomodation_dto')
const async_handler = require('express-async-handler')

// =================================================
// uesr target wisi list get //
async function user_get_target_wish_list_controller(req, res, next){

    const user = new user_dto({_id : req.body.user_id})
    const accomodation = new accomodation_dto({_id : req.body.accomodation_id})
    const user_get_service_layer = new user_get_service()

    const result = await user_get_service_layer.get_my_target_wisi_lists(user, accomodation)
    res.status(200).json(result)
}

module.exports = {
    user_get_target_wish_list_controller : async_handler(user_get_target_wish_list_controller)
}