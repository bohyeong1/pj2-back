const accomodation_regist_service = require('../../service_layer/accomodation_regist_service')
const user_dto = require('../../dto/user_dto')
const accomodation_dto = require('../../dto/accomodation_dto')
const async_handler = require('express-async-handler')
const {get_files_type} = require('../../util_function/util_function')

// =================================================
// 숙소 등록 컨트롤러 //
async function acc_regist_lv6_controller(req, res, next){
    const accomodation_id = req.params.house
    const img_files = req.files
    const user = new user_dto({userId : req.body.userId})

    const accomodation = new accomodation_dto({
        main_img : img_files.mainImg[0].mimetype,
        sub_img : get_files_type(img_files.subImg),
        _id : accomodation_id
    })
    const accomodation_regist_service_layer = new accomodation_regist_service()

    const result = await accomodation_regist_service_layer.regist_lv6(user, accomodation, img_files)
    res.status(200).json(result)
}

module.exports = {
    acc_regist_lv6_controller : async_handler(acc_regist_lv6_controller)
}