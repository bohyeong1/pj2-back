const user_service = require('../../../service_layer/user_service')
const user_dto = require('../../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
//cookie / 로그인 체크  //
async function user_get_login_check_controller(req, res, next){
    const user = new user_dto({token : req.cookies.auth_token})
    const user_service_layer = new user_service()

    const result = await user_service_layer.check_user(user)
    res.status(200).json(result)
}

module.exports = {
    user_get_login_check_controller : async_handler(user_get_login_check_controller)
}