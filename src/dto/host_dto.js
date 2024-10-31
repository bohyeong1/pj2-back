const error_dto = require('../dto/error_dto')
const mongoose = require('mongoose')
const {check_object, check_string, check_array, check_integer} = require('../util_function/util_function')
const Structure = require('../models/Structure')
const _ = require('lodash')

class host_dto{
    constructor(data){ 
        // 구현
        this.min_reservation_date = data.min_reservation_date || null
        this.max_reservation_date = data.max_reservation_date || null
        this.possible_date = data.possible_date || null
        this.reservation_deadline = data.reservation_deadline || null
        this.before_date = data.before_date || null
        this.impossible_reservation = data.impossible_reservation || null
    }

    // =================================================
    // min_reservation_date 형식 & 타입검사 //
    validate_min_reservation_date(){     
        if(this.min_reservation_date){
            if(!check_integer(this.min_reservation_date)){
                throw new error_dto({
                    code: 400,
                    message: 'min_reservation_date가 유효한 타입이 아닙니다.',
                    server_state: false
                })
            }
            if(this.min_reservation_date >= this.max_reservation_date || this.min_reservation_date < 2){
                throw new error_dto({
                    code: 400,
                    message: 'min_reservation_date가 유효한 형식이 아닙니다.',
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
    // max_reservation_date 형식 & 타입검사 //
    validate_max_reservation_date(){     
        if(this.max_reservation_date){
            if(!check_integer(this.max_reservation_date)){
                throw new error_dto({
                    code: 400,
                    message: 'max_reservation_date 유효한 타입이 아닙니다.',
                    server_state: false
                })
            }
            if(this.min_reservation_date >= this.max_reservation_date || this.max_reservation_date > 30){
                throw new error_dto({
                    code: 400,
                    message: 'max_reservation_date 유효한 형식이 아닙니다.',
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
    // possible_date 형식 & 타입검사 //
    async validate_possible_date(){
        if(this.possible_date){
            if(!check_object(this.possible_date)){
                throw new error_dto({
                    code: 400,
                    message: 'possible_date 유효한 타입이 아닙니다.',
                    server_state: false
                })
            }

            const possible_date_structure = await Structure.findOne({
                name : 'possible_date'
            })

            // db에 저장되 있는 possible_date 항목인지 검사
            const check_req = _.some(possible_date_structure.structure, (el)=>{
                return _.isEqual(el, this.possible_date)
            })

            if(!check_req){
                throw new error_dto({
                    code: 400,
                    message: 'possible_date 유효한 형식이 아닙니다.',
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
    // reservation_deadline 형식 & 타입검사 //
    async validate_reservation_deadline(){
        if(this.reservation_deadline){
            if(!check_object(this.reservation_deadline)){
                throw new error_dto({
                    code: 400,
                    message: 'reservation_deadline 유효한 타입이 아닙니다.',
                    server_state: false
                })
            }

            const reservation_deadline_structure = await Structure.findOne({
                name : 'reservation_deadline'
            })

            // db에 저장되 있는 reservation_deadline 항목인지 검사
            const check_req = _.some(reservation_deadline_structure.structure, (el)=>{
                return _.isEqual(el, this.reservation_deadline)
            })

            if(!check_req){
                throw new error_dto({
                    code: 400,
                    message: 'reservation_deadline 유효한 형식이 아닙니다.',
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
    // before_date 형식 & 타입검사 //
    async validate_before_date(){
        if(this.before_date){
            if(!check_object(this.before_date)){
                throw new error_dto({
                    code: 400,
                    message: 'before_date 유효한 타입이 아닙니다.',
                    server_state: false
                })
            }

            const before_date_structure = await Structure.findOne({
                name : 'before_date'
            })

            // db에 저장되 있는 before_date 항목인지 검사
            const check_req = _.some(before_date_structure.structure, (el)=>{
                return _.isEqual(el, this.before_date)
            })

            if(!check_req){
                throw new error_dto({
                    code: 400,
                    message: 'before_date 유효한 형식이 아닙니다.',
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
    // impossible_reservation 형식 & 타입검사 //
    async validate_impossible_reservation(){
        if(this.impossible_reservation){
            if(!check_array(this.impossible_reservation)){
                throw new error_dto({
                    code: 400,
                    message: 'impossible_reservation 유효한 타입이 아닙니다.',
                    server_state: false
                })
            }

            const impossible_reservation_structure = await Structure.findOne({
                name : 'impossible_reservation'
            })

            // db에 저장되 있는 impossible_reservation 항목인지 검사
            const check_req = _.every(this.impossible_reservation, (el)=>{
                return _.some(impossible_reservation_structure.structure, (ele)=>{
                    return _.isMatch(el, ele)
                })
            })

            if(!check_req){
                throw new error_dto({
                    code: 400,
                    message: 'impossible_reservation 유효한 형식이 아닙니다.',
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

module.exports = host_dto