const {body} = require('express-validator')

// =================================================
// e-mail //
function validateUserEmail(){
    return[
        body('email')
        .notEmpty()
        .withMessage('이메일을 입력해 주세요.')
        .isEmail()
        .withMessage("이메일이 유효하지 않습니다.")
    ]
} 

module.exports = {
    validateUserEmail
}