const user_service = require('../../service_layer/user_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// http cookie에 로그인 유지 되었나 체크 //

async function user_maintain_controller(req, res, next){
    const user = new user_dto({token : req.cookies.auth_token})
    const user_service_layer = new user_service()

    const result = await user_service_layer.maintain_user(user)
    // console.log(result)
    res.status(200).json(result)
}

module.exports = {
    user_maintain_controller : async_handler(user_maintain_controller)
}