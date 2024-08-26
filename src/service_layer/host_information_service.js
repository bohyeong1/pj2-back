const admin = require('../config/firebase_config')
const User = require('../models/User')
const config = require('../config/env_config')
const error_dto = require('../dto/error_dto')
const {v4 : uuidv4} = require('uuid')

class host_information_service{
    // =================================================
    // host 등록 //
    async regist_host(user_dto){
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
                    log_state : false
                }
            }

            user.host_state = true
            await user.save()

            return {
                code : 200,
                host_state : user.host_state,
                log_state : true
            }
        }catch(e){
            throw new Error(e.massage)
        }
    }
}

module.exports = host_information_service