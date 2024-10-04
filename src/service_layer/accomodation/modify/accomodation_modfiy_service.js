const admin = require('../../../config/firebase_config')
const User = require('../../../models/User')
const Accomodation = require('../../../models/Accomodation')
const error_dto = require('../../../dto/error_dto')
const config = require('../../../config/env_config')
const Path = require('../../../models/Path')
const {kakao_close_location_fetch, is_valid_user} = require('../../../util_function/util_function')
const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')

class accomodation_modfiy_service{
    // =================================================
    // title 수정 //
    async modify_title(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_title()
        accomodation_dto.validate_alter_under_id()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // title 업데이트
            accomodation.title = accomodation_dto.title

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
            }

        }catch(e){
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false,
                error : e
            })
        }
    }

    // =================================================
    // category 수정 //
    async modify_category(user_dto, accomodation_dto){
        user_dto.validate_token()
        await accomodation_dto.validate_category()
        await accomodation_dto.validate_space_category()
        accomodation_dto.validate_alter_under_id()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // category, space_category 업데이트
            accomodation.category = accomodation_dto.category
            accomodation.space_category = accomodation_dto.space_category

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
            }

        }catch(e){
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false,
                error : e
            })
        }
    }
}

module.exports = accomodation_modfiy_service