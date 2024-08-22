const {body} = require('express-validator')

const isFieldEmpty = (field) => { // Form 필드가 비어있는지 검사
    return body(field)
    .not()
    .isEmpty()
    .withMessage(`user ${field} is required`)
    .bail() // if email is empty, the following will not be run
    .trim() // 공백제거
}
const validateUserName = () => {
    return isFieldEmpty("name")
    .isLength({ min: 2, max: 20 }) // 2~20자
    .withMessage("user name length must be between 2 ~ 20 characters")
}

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