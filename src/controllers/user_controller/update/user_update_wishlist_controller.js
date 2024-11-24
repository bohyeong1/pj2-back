const user_update_service = require('../../../service_layer/user/update/user_update_service')
const user_dto = require('../../../dto/user_dto')
const accomodation_dto = require('../../../dto/accomodation_dto')
const async_handler = require('express-async-handler')

// =================================================
// user wishlist update //
async function user_update_wishlist_controller(req, res, next){

    const user = new user_dto({_id : req.body.user_id})
    const accomodation = new accomodation_dto({_id : req.body.accomodation_id})
    const user_update_service_layer = new user_update_service()

    const result = await user_update_service_layer.update_user_wishlist(user, accomodation)
    res.status(200).json(result)
}

module.exports = {
    user_update_wishlist_controller : async_handler(user_update_wishlist_controller)
}