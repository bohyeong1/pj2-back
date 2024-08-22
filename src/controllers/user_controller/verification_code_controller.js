const user_service = require('../../service_layer/user_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')


// =================================================
// 인증 코드 발급 컨트롤러 //
async function verification_code_controller(req, res, next){
    const user = new user_dto({userId : req.body.userId, email : req.body.email})
    const user_service_layer = new user_service()

    const result = await user_service_layer.verification_code(user)
    res.status(200).json(result)
}

module.exports = {
    verification_code_controller : async_handler(verification_code_controller)
}