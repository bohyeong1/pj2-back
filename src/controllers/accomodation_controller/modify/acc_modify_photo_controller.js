const accomodation_modfiy_service = require('../../../service_layer/accomodation/modify/accomodation_modfiy_service')
const user_dto = require('../../../dto/user_dto')
const accomodation_dto = require('../../../dto/accomodation_dto')
const async_handler = require('express-async-handler')
const {check_array} = require('../../../util_function/util_function')
const {get_files_type} = require('../../../util_function/util_function')
// =================================================
// 숙소 사진 수정 컨트롤러 //
async function acc_modify_photo_controller(req, res, next){
    const accomodation_id = req.params.house
    const img_files = req.files
    const delete_main_img = req.body.delete_main_img ? req.body.delete_main_img : null
    const parsing_delete_sub_img = req.body.delete_sub_img ? JSON.parse(req.body.delete_sub_img) : null
    const delete_sub_img = check_array(parsing_delete_sub_img) && parsing_delete_sub_img.length ? parsing_delete_sub_img : null

    const user = new user_dto({token : req.cookies.auth_token})
    const accomodation = new accomodation_dto(
        {
            main_img : img_files.mainImg ? img_files.mainImg[0].mimetype : null, 
            sub_img : img_files.subImg && img_files.subImg.length ? get_files_type(img_files.subImg) : null,
            delete_main_img : delete_main_img ? delete_main_img : null,
            delete_sub_img : delete_sub_img ? delete_sub_img : null,
            _id : accomodation_id
        }
    )

    const accomodation_modfiy_service_layer = new accomodation_modfiy_service()

    const result = await accomodation_modfiy_service_layer.modify_photo(user, accomodation, img_files)
    res.status(200).json(result)
}

module.exports = {
    acc_modify_photo_controller : async_handler(acc_modify_photo_controller)
}