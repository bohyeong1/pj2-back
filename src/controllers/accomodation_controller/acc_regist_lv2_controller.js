const accomodation_regist_service = require('../../service_layer/accomodation_regist_service')
const user_dto = require('../../dto/user_dto')
const accomodation_dto = require('../../dto/accomodation_dto')
const async_handler = require('express-async-handler')


// =================================================
// 숙소 등록 컨트롤러 //
async function acc_regist_lv2_controller(req, res, next){
    const user = new user_dto({token : req.cookies.auth_token})
    const accomodation = new accomodation_dto({acc_step : req.body.acc_step, space_category : req.body.space_category})
    const accomodation_regist_service_layer = new accomodation_regist_service()
    console.log('확인')
    const result = await accomodation_regist_service_layer.regist_lv2(user, accomodation)
    res.status(200).json(result)
}

module.exports = {
    acc_regist_lv2_controller : async_handler(acc_regist_lv2_controller)
}