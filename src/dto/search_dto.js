const error_dto = require('../dto/error_dto')
const {check_string, check_integer, check_date, check_object} = require('../util_function/util_function')
const {isBefore, addMonths} = require('date-fns')

class search_dto{
    constructor(data){ 
        this.input = data.input || null
        this.location = data.location || null
        this.date = data.date || null
        this.capacity = data.capacity || null
    }

    // =================================================
    // input 형식 & 타입검사 //
    validate_input(){        
        if(this.input){
            if(!check_string(this.input)){
                throw new error_dto({
                    code: 400,
                    message: 'input 전달 타입이 잘못 되었습니다',
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

    // =================================================
    // location 형식 & 타입검사 //
    validate_location(){        
        if(this.location){
            if(!check_string(this.location)){
                throw new error_dto({
                    code: 400,
                    message: 'location 전달 타입이 잘못 되었습니다',
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

    // =================================================
    // date 형식 & 타입검사 //
    validate_date(){        
        if(this.date){
            if(!check_object(this.date)){
                throw new error_dto({
                    code: 400,
                    message: 'date 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            if(!check_date(this.date.checkin) || !check_date(this.date.checkout)){
                throw new error_dto({
                    code: 400,
                    message: 'date 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            if(isBefore(this.date.checkout, this.date.checkin)){
                throw new error_dto({
                    code: 400,
                    message: 'date 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }

            const today = new Date()
            const dead_line_date = addMonths(today, 6)
            if(isBefore(dead_line_date, this.date.checkin) || isBefore(dead_line_date, this.date.checkout)){
                throw new error_dto({
                    code: 400,
                    message: 'date 전달 형식이 잘못 되었습니다',
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

    // =================================================
    // capacity 형식 & 타입검사 //
    validate_capacity(){        
        if(this.capacity){
            if(!check_integer(this.capacity)){
                throw new error_dto({
                    code: 400,
                    message: 'capacity 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            if(this.capacity <= 0 || this.capacity > 30){
                throw new error_dto({
                    code: 400,
                    message: 'capacity 전달 형식이 잘못 되었습니다',
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
