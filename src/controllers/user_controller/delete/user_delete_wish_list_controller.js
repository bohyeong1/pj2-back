const user_delete_service = require('../../../service_layer/user/delete/user_delete_service')
const user_dto = require('../../../dto/user_dto')
const async_handler = require('express-async-handler')
const accomodation_dto = require('../../../dto/accomodation_dto')

// =================================================
// uesr wisi list delete //
async function user_delete_wish_list_controller(req, res, next){
    console.log(req.body)
    const user = new user_dto({_id : req.body.user_id})
    const accomodation = new accomodation_dto({_id : req.body.accomodation_id})
    const user_delete_service_layer = new user_delete_service()

    const result = await user_delete_service_layer.delete_user_wish_list(user, accomodation)
    res.status(200).json(result)
}

module.exports = {
    user_delete_wish_list_controller : async_handler(user_delete_wish_list_controller)
}