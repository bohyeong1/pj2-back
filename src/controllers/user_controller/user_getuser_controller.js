const user_service = require('../../service_layer/user_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// 유저 정보 http cookie로 획득 //

async function user_getuser_controller(req, res, next){
    const user = new user_dto({token : req.headers.authorization})
    const user_service_layer = new user_service()

    const result = await user_service_layer.getuser_user(user)
    // console.log(result)
    res.status(200).json(result)
}

module.exports = {
    user_getuser_controller : async_handler(user_getuser_controller)
}