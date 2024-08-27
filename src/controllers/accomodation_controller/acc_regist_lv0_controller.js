const user_service = require('../../service_layer/user_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')


// =================================================
// 숙소 등록 컨트롤러 //
async function acc_regist_lv0_controller(req, res, next){
    const user = new user_dto({token : req.cookies.auth_token})
    const user_service_layer = new user_service()

    const result = await user_service_layer.user_email(user)
    res.status(200).json(result)
}

module.exports = {
    acc_regist_lv0_controller : async_handler(acc_regist_lv0_controller)
}