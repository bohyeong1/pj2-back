const host_information_service = require('../../service_layer/host_information_service')
const user_dto = require('../../dto/user_dto')
const host_dto = require('../../dto/host_dto')
const async_handler = require('express-async-handler')

// =================================================
// 마이페이지 업데이트 //
async function host_mypage_controller(req, res, next){

    const img_files = req.files.userImg
    const delete_prev_img = req.body.delete_prev_img || null
    const host_text = req.body.host_text || null
    const initial_message = req.body.initial_message || null
    const reservation_rule = req.body.reservation_rule !== undefined ? JSON.parse(req.body.reservation_rule) : null
    const refund_rule = req.body.refund_rule ? JSON.parse(req.body.refund_rule) : null

    const user = new user_dto(
        {
            profileImg : img_files ? img_files[0].mimetype : null,
            delete_prev_img : delete_prev_img,
            token : req.cookies.auth_token
        }
    )
    const host = new host_dto(
        {
            host_text : host_text,
            initial_message : initial_message,
            reservation_rule : reservation_rule,
            refund_rule : refund_rule
        }
    )

    const host_information_service_layer = new host_information_service()
    const result = await host_information_service_layer.update_host_mypage(user, host, img_files)
    res.status(200).json(result)
}

module.exports = {
    host_mypage_controller : async_handler(host_mypage_controller)
}