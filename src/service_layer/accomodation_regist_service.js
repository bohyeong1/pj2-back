const admin = require('../config/firebase_config')
const User = require('../models/User')
const Accomodation = require('../models/Accomodation')
const error_dto = require('../dto/error_dto')

class accomodation_regist_service{
    // =================================================
    // 숙소 등록 절차 lv0 //
    async regist_lv0(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.sell_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'sell_step 잘못된값 넣었음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_sell_step()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})
            if(!user){
                return {
                    code : 200,
                    acc_state : false
                }
            }

            const accomodation = new Accomodation({
                sell_step : accomodation_dto.sell_step
            })
            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
            }
        }catch(e){
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // 숙소 등록 절차 lv1 //

    // =================================================
    // 숙소 등록 절차 lv2 //

    // =================================================
    // 숙소 등록 절차 lv3 //
}

module.exports = accomodation_regist_service