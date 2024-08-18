const user_service = require('../../service_layer/user_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')


// =================================================
// 회원가입 -> id 중복체크 //

async function user_duplicate_controller(req, res, next){
    const user = new user_dto({userId : req.body.userId})
    const user_service_layer = new user_service()

    const result = await user_service_layer.user_duplicate_id(user)

    res.status(200).json(result)
}

module.exports = {
    user_duplicate_controller : async_handler(user_duplicate_controller)
}