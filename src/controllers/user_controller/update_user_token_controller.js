const user_service = require('../../service_layer/user_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')


// =================================================
// user token 업데이트(1시간 주기) //

async function update_user_token_controller(req, res, next){
    const user = new user_dto({token : req.headers.authorization})
    const user_service_layer = new user_service()

    const result = await user_service_layer.update_user_token(user, res)

    res.status(200).json(result)
}

module.exports = {
    update_user_token_controller : async_handler(update_user_token_controller)
}