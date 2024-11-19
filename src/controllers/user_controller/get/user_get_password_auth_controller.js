const user_get_service = require('../../../service_layer/user/get/user_get_service')
const user_dto = require('../../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// 비밀번호를 통한 user auth check //
async function user_get_password_auth_controller(req, res, next){

    const user = new user_dto(
        {
            token : req.cookies.auth_token,
            password : req.body.password,
            password_confirm : req.body.password_confirm
        }
    )
    const user_get_service_layer = new user_get_service()

    const result = await user_get_service_layer.check_user_password(user)
    res.status(200).json(result)
}

module.exports = {
    user_get_password_auth_controller : async_handler(user_get_password_auth_controller)
}