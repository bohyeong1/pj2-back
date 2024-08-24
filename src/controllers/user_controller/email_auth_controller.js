const user_service = require('../../service_layer/user_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')


// =================================================
// 이메일 인증코드 체크 컨트롤러 //
async function email_auth_controller(req, res, next){
    const user = new user_dto({email : req.body.email, code : req.body.code, userId : req.body.userId})
    const user_service_layer = new user_service()

    const result = await user_service_layer.user_email(user)
    res.status(200).json(result)
}

module.exports = {
    email_auth_controller : async_handler(email_auth_controller)
}