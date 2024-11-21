const user_update_service = require('../../../service_layer/user/update/user_update_service')
const user_dto = require('../../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// user password update //
async function user_update_password_controller(req, res, next){

    const user = new user_dto(
        {
            token : req.cookies.auth_token,
            password : req.body.password,
            password_confirm : req.body.password_confirm,
            prev_password : req.body.prev_password
        }
    )
    const user_update_service_layer = new user_update_service()

    const result = await user_update_service_layer.update_user_password(user)
    res.status(200).json(result)
}

module.exports = {
    user_update_password_controller : async_handler(user_update_password_controller)
}