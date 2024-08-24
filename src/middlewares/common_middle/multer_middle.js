const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

// =================================================
// 유저 프로필 이미지 멀터 //
const user_multer = upload.fields([{ name : 'userImg', maxCount : 1 }]) 

// =================================================
// 초기 숙소 등록 이미지 멀터 //
const initail_acc_regist_multer = upload.fields([
    { name : 'mainImg', maxCount : 1 }, { name : 'subImg', maxCount : 4 }
])



module.exports = {
    user_multer : user_multer,
    initail_acc_regist_multer : initail_acc_regist_multer
}
                                  

