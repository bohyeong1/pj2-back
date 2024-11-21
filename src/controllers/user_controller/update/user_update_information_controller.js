const user_update_service = require('../../../service_layer/user/update/user_update_service')
const user_dto = require('../../../dto/user_dto')
const async_handler = require('express-async-handler')

// =================================================
// user information update //
async function user_update_information_controller(req, res, next){

    const img_files = req.files.userImg
    const delete_prev_img = req.body.delete_prev_img || null
    const name = req.body.name || null
    const nickname = req.body.nickname || null

    const user = new user_dto(
        {
            token : req.cookies.auth_token,
            profileImg : img_files ? img_files[0].mimetype : null,
            delete_prev_img : delete_prev_img,
            name : name,
            nickname : nickname
        }
    )
    const user_update_service_layer = new user_update_service()

    const result = await user_update_service_layer.update_user_information(user, img_files)
    res.status(200).json(result)
}

module.exports = {
    user_update_information_controller : async_handler(user_update_information_controller)
}