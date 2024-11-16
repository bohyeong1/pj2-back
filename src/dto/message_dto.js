const error_dto = require('../dto/error_dto')
const {check_object, check_string, check_array, check_integer, check_date} = require('../util_function/util_function')
const _ = require('lodash')
const mongoose = require('mongoose')

class message_dto{
    constructor(data){ 
        this.content = data.content || null
        this.room_id = data.room_id || null
        this.sender_id = data.sender_id || null
    }

    // =================================================
    // content 형식 & 타입검사 //
    validate_content(){
        if(this.content){
            if(!check_string(this.content)){
                throw new error_dto({
                    code: 400,
                    message: 'contetent 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            // string length check
        }
        else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // room_id 형식 & 타입검사 & objectId 타입 변환 //
    validate_alter_under_room_id(){
        if(this.room_id){
            if(!check_string(this.room_id)){
                throw new error_dto({
                    code: 400,
                    message: 'room_id 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            try{
                this.room_id = new mongoose.Types.ObjectId(this.room_id)
            }catch(e){
                throw new error_dto({
                    code: 400,
                    message: 'room_id 유효한 ObjectId 형식이 아닙니다.',
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
    // sender_id 형식 & 타입검사 & objectId 타입 변환 //
    validate_alter_under_sender_id(){
        if(this.sender_id){
            if(!check_string(this.sender_id)){
                throw new error_dto({
                    code: 400,
                    message: 'sender_id 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            try{
                this.sender_id = new mongoose.Types.ObjectId(this.sender_id)
            }catch(e){
                throw new error_dto({
                    code: 400,
                    message: 'sender_id 유효한 ObjectId 형식이 아닙니다.',
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

module.exports = message_dto
