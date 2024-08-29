const error_dto = require('../dto/error_dto')

class accomodation_dto{
    constructor(data){ 
        // 구현
        this.sell_step = (data.sell_step >= 0) ? data.sell_step : null

        // 폼 타입검사 미구현
    }

    // =================================================
    // sell step 형식 & 타입검사 //
    validate_sell_step(){
        if(this.sell_step >= 0){
            if(typeof this.sell_step !== 'number'){
                throw new error_dto({
                    code: 401,
                    message: 'sell step 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            if(this.sell_step < 0 || this.sell_step > 11){
                throw new error_dto({
                    code: 401,
                    message: 'sell step 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }
}

module.exports = accomodation_dto