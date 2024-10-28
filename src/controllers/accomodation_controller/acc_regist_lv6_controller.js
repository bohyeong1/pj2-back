const accomodation_regist_service = require('../../service_layer/accomodation_regist_service')
const user_dto = require('../../dto/user_dto')
const accomodation_dto = require('../../dto/accomodation_dto')
const async_handler = require('express-async-handler')
const {get_files_type} = require('../../util_function/util_function')
const {check_array} = require('../../util_function/util_function')

// =================================================
// 숙소 등록 컨트롤러 //
async function acc_regist_lv6_controller(req, res, next){

    const accomodation_id = req.params.house
    const img_files = req.files
    const delete_main_img = req.body.delete_main_img ? req.body.delete_main_img : null
    const parsing_delete_sub_img = req.body.delete_sub_img ? JSON.parse(req.body.delete_sub_img) : null
    const delete_sub_img = check_array(parsing_delete_sub_img) && parsing_delete_sub_img.length ? parsing_delete_sub_img : null

    const user = new user_dto({token : req.cookies.auth_token})
    const accomodation = new accomodation_dto(
        {
            acc_step : parseInt(req.body.acc_step),
            main_img : img_files.mainImg ? img_files.mainImg[0].mimetype : null, 
            sub_img : img_files.subImg && img_files.subImg.length ? get_files_type(img_files.subImg) : null,
            delete_main_img : delete_main_img ? delete_main_img : null,
            delete_sub_img : delete_sub_img ? delete_sub_img : null,
            _id : accomodation_id
        }
    )

    const accomodation_regist_service_layer = new accomodation_regist_service()

    const result = await accomodation_regist_service_layer.regist_lv6(user, accomodation, img_files)
    res.status(200).json(result)
}

module.exports = {
    acc_regist_lv6_controller : async_handler(acc_regist_lv6_controller)
}