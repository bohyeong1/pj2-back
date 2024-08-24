const user_service = require('../../service_layer/user_service')
const user_dto = require('../../dto/user_dto')
const async_handler = require('express-async-handler')


// =================================================
// 유저 프로필(닉네임 / 이미지) 업데이트 //
async function user_profile_controller(req, res, next){
    const user = new user_dto({userId : req.body.userId, nickname : req.body.nickname, profileImg : req.files.userImg[0].mimetype})
    const user_service_layer = new user_service()

    const result = await user_service_layer.user_profile(user, req.files.userImg[0])
    res.status(200).json(result)    
}

module.exports = {
    user_profile_controller : async_handler(user_profile_controller)
}