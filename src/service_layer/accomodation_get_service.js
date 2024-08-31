const admin = require('../config/firebase_config')
const User = require('../models/User')
const Accomodation = require('../models/Accomodation')
const error_dto = require('../dto/error_dto')

class accomodation_get_service{
    // =================================================
    // public get -> acc_id값으로 조회 / common page(client : detail page) get 요청 유저 + 평점 파이프라인 포함 //
    async public_get(accomodation_dto){
        
    }

    // =================================================
    // secret get -> user_id 값으로 조회 secret page(client : host page) 요청 //
    async secret_get(user_dto){
        if(!user_dto.token){
            return {
                code : 200,
                log_state : false
            }
        }

        user_dto.validate_token()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})
            if(!user){
                return {
                    code : 200,
                    log_state : false,
                    message : 'user를 찾을 수 없습니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })
            if(!accomodation){
                return {
                    code : 200,
                    log_state : false,
                    message : 'accomodation를 찾을 수 없습니다.'
                }
            }

            return {
                code : 200,
                accomodation : accomodation,
                log_state : true
            }
        }catch(e){
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false
            })
        }
    }
}

module.exports = accomodation_get_service