const user_service = require('../../service_layer/user_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// 로그인 //
async function user_login_controller(req, res, next){
    const user = new user_dto({token : req.headers.authorization, userId : req.body.userId})
    const user_service_layer = new user_service()
    const result = await user_service_layer.login_user(user, res)
    res.status(200).json(result)
}

module.exports = {
    user_login_controller : async_handler(user_login_controller)
}