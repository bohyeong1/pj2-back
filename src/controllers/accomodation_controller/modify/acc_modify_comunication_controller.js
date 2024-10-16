const accomodation_modfiy_service = require('../../../service_layer/accomodation/modify/accomodation_modfiy_service')
const user_dto = require('../../../dto/user_dto')
const accomodation_dto = require('../../../dto/accomodation_dto')
const async_handler = require('express-async-handler')

// =================================================
// 숙소 커뮤니케이션 수정 컨트롤러 //
async function acc_modify_comunication_controller(req, res, next){
    const accomodation_id = req.params.house

    const user = new user_dto({token : req.cookies.auth_token})
    const accomodation = new accomodation_dto({comunication : req.body.comunication, _id : accomodation_id})
    const accomodation_modfiy_service_layer = new accomodation_modfiy_service()

    const result = await accomodation_modfiy_service_layer.modify_comunication(user, accomodation)
    res.status(200).json(result)
}

module.exports = {
    acc_modify_comunication_controller : async_handler(acc_modify_comunication_controller)
}