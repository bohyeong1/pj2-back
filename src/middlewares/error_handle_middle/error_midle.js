const error_dto = require('../../dto/error_dto')

function error_middle(err, req, res, next){

    if(err instanceof error_dto){
        console.log(err)
        return res.status(err.code).json({
            code : err.code,
            message : err.message,
            server_state : err.server_state,
            ui_action : err.ui_action ? err.ui_action : 'redirection'
        })
    }
    else{
        console.log(err)
        return res.status(500).json({
            code : 500,
            message : 'internal server error',
            server_state : false,
            ui_action : 'redirection'
        })
    }
}

module.exports = error_middle