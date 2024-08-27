const admin = require('../config/firebase_config')
const User = require('../models/User')
const Hostinformation = require('../models/Hostinformation')
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
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // host information //
    async host_information(user_dto){
        if(!user_dto.host_text || !user_dto.token){
            return {
                code : 200,
                log_state : false
            }
        }

        user_dto.validate_host_text()
        user_dto.validate_token()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})
            const host_text = await Hostinformation.findOne({
                userId : user.userId
            }) 

            if(!user && ! host_text){
                return {
                    code : 200,
                    log_state : false,
                    message : '로그인 정보가 올바르지 않습니다.'
                }
            }
            // host text 첫 생성
            else if(user && !host_text){
                const new_host_text = new Hostinformation({
                    host_text : user_dto.host_text
                })
                await new_host_text.save()

                user.host_text = new_host_text._id
                await user.save()
                return {
                    code : 200,
                    log_state : true,
                    message : '초기 등록 성공',
                    host_text : new_host_text
                }
            }
            // host text update
            else if(user && host_text){
                host_text.host_text = user_dto.host_text
                await host_text.save()
                return {
                    code : 200,
                    log_state : true,
                    message : '업데이트 등록 성공',
                    host_text : host_text
                }
            }
            // error
            else{
                throw new Error()
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

module.exports = host_information_service