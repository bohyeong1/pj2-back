const error_dto = require('../dto/error_dto')
const {check_string} = require('../util_function/util_function')

class search_dto{
    constructor(data){ 
        this.input = data.input || null

    }

    // =================================================
    // input 형식 & 타입검사 //
    validate_input(){        
        if(this.input){
            if(!check_string(this.input)){
                throw new error_dto({
                    code: 400,
                    message: 'token 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }
}

module.exports = search_dto
