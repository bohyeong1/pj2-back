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
const Wishlist = require('../../../models/Wishlist')

class user_get_service{
    // =================================================
    // user 로그인 / 비로그인 체크 //
    async check_optimistic_user(user_dto){
        user_dto.validate_token()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return {
                    code : 200,
                    user_data : null,
                    server_state : true
                }
            }

            const user = user_data.user

            return {
                code : 200,
                user_data : {
                    _id : user._id || null,
                    name : user.name || null,
                    email : user.email || null,
                    userId : user.userId || null,
                    isAdmin : user.isAdmin || null,
                    createdAt : user.createAt || null,
                    cashInv : user.cashInv || null,
                    profileImg : user.profileImg || null,
                    host_text : user.host_text || null,
                    nickname : user.nickname || null,
                    host_state : user.host_state || null,
                    defaultProfile : user.defaultProfile || null
                },
                server_state : true
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
                user_evaluations : user_evaluations.length ? user_evaluations[0] : null
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
    // 유저 wish list target get //
    async get_my_target_wisi_lists(user_dto, accomodation_dto){
        user_dto.validate_alter_under_id()
        accomodation_dto.validate_alter_under_id()

        try{
            const wishlist = await Wishlist.findOne(
                {
                    user_id : user_dto._id,
                    accomodation_id : accomodation_dto._id
                }
            )

            return {
                code : 200,
                server_state : true,
                wishlist : wishlist ? true : false
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
    // 유저 wish list all get //
    async get_my_all_wisi_lists(user_dto){
        user_dto.validate_alter_under_id()

        try{
            const wishlists = await Wishlist.find(
                {
                    user_id : user_dto._id
                }
            ).populate({
                path : 'accomodation_id'
            })

            return {
                code : 200,
                server_state : true,
                wishlists
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