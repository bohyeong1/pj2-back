class custom_error extends Error {
    constructor({code, message, server_state, ui_action}) {
        super(message)
        this.code = code
        this.server_state = server_state
        this.ui_action = ui_action
    }
}

module.exports = custom_error


// if (err instanceof CustomError) {
//     // 커스텀 에러 처리
//     return res.status(err.code).json({
//         message: err.message,
//         code_state: err.code_state
//     });
// } else {
//     // 일반 에러 처리
//     return res.status(500).json({
//         message: 'Internal Server Error',
//         code_state: false
//     });
// }



