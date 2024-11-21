const admin = require('../../../config/firebase_config')
const User = require('../../../models/User')
const Reqcount = require('../../../models/Reqcount')
const Authcode = require('../../../models/Authcode')
const config = require('../../../config/env_config')
const {create_code} = require('../../../util_function/util_function')
const {send_code_email} = require('../../../util_function/util_function')
const error_dto = require('../../../dto/error_dto')
const {is_valid_user} = require('../../../util_function/util_function')
const _ = require('lodash')
const {get_user_evaluations} = require('../../../pipelines/user_pipe')

class user_get_service{
    // =================================================
    // 비밀번호를 통한 유저 인증 체크 //
    async check_user_password(user_dto){
        user_dto.validate_token()
        user_dto.validate_password()
        user_dto.validate_password_confirm()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const check_user = await User.findOne({
                userId : user.userId,
                password : user_dto.password
            })            
            if(!check_user){
                throw new error_dto({
                    code: 401,
                    message: '비밀번호가 올바르지 않습니다.',
                    server_state: false,
                    ui_action : 'retry'
                })
            }

            if(!_.isEqual(user, check_user)){
                throw new error_dto({
                    code: 401,
                    message: '비밀번호가 올바르지 않습니다.',
                    server_state: false,
                    ui_action : 'retry'
                })
            }

            return {
                code : 200,
                message : '인증이 완료되었습니다.',
                server_state : true,
                auth_state : true
            }

        }catch(e){
            if(e instanceof error_dto){
                throw e
            }
            else{
                throw new error_dto({
                    code: 500,
                    message: '서버에서 문제가 발생 하였습니다.',
                    server_state: false,
                    error : e
                })
            }
        }   
    }
    
    // =================================================
    // 유저 평가 항목 get //
    async get_my_evaluations(user_dto){
        user_dto.validate_alter_under_id()

        try{
            const pipe_line = get_user_evaluations()
            const user_evaluations = await User.aggregate([
                {$match : {_id : user_dto._id}},
                ...pipe_line
            ])

            if(!user_evaluations){
                throw new error_dto({
                    code : 400,
                    message : '인증절차 중 문제가 발생 하였습니다.',
                    server_state : false,
                    error : e
                })
            }

            return {
                code : 200,
                server_state : true,
                user_evaluations : user_evaluations[0]
            }

        }catch(e){
            if(e instanceof error_dto){
                throw e
            }
            else{
                throw new error_dto({
                    code: 500,
                    message: '서버에서 문제가 발생 하였습니다.',
                    server_state: false,
                    error : e
                })
            } 
        }
    }
}

module.exports = user_get_service