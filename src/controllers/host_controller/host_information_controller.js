const host_information_service = require('../../service_layer/host_information_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// host 자격 등록 //
async function host_information_controller(req, res, next){
    const user = new user_dto({token : req.cookies.auth_token, host_text : req.body.host_text})
    const host_information_service_layer = new host_information_service()
    const result = await host_information_service_layer.host_information(user)
    res.status(200).json(result)
}

module.exports = {
    host_information_controller : async_handler(host_information_controller)
}