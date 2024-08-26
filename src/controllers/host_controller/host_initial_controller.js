const host_information_service = require('../../service_layer/host_information_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// host 자격 등록 //
async function host_initial_controller(req, res, next){
    const user = new user_dto({token : req.cookies.auth_token, userId : req.body.userId})
    const host_information_service_layer = new host_information_service()
    const result = await host_information_service_layer.regist_host(user, res)
    res.status(200).json(result)
}

module.exports = {
    host_initial_controller : async_handler(host_initial_controller)
}