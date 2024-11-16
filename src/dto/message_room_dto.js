const error_dto = require('../dto/error_dto')
const {check_object, check_string, check_array, check_integer, check_date} = require('../util_function/util_function')
const mongoose = require('mongoose')

class message_room_id{
    constructor(data){ 
        this._id = data._id || null
    }

    // =================================================
    // _id 형식 & 타입검사 & objectId 타입 변환 //
    validate_alter_under_id(){
        if(this._id){
            if(!check_string(this._id)){
                throw new error_dto({
                    code: 400,
                    message: '_id 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            try{
                this._id = new mongoose.Types.ObjectId(this._id)
            }catch(e){
                throw new error_dto({
                    code: 400,
                    message: '_id가 유효한 ObjectId 형식이 아닙니다.',
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

module.exports = message_room_id
