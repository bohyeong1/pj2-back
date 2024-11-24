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

class user_delete_service{
    // =================================================
    // user wish list delte //
    async delete_user_wish_list(user_dto, accomodation_dto){
        user_dto.validate_alter_under_id()
        accomodation_dto.validate_alter_under_id()

        try{
            const target_wishlist = await Wishlist.findOneAndDelete(
                {
                    user_id : user_dto._id,
                    accomodation_id : accomodation_dto._id
                }
            )

            if(!target_wishlist){
                throw new error_dto({
                    code: 500,
                    message: '삭제하려는 target을 찾을 수 없습니다.',
                    server_state: false,
                    error : e
                })
            }

            return {
                code : 200,
                server_state : true,
                message : '성공적으로 삭제되었습니다.'
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

module.exports = user_delete_service