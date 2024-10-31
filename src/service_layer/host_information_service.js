const admin = require('../config/firebase_config')
const User = require('../models/User')
const Hostinformation = require('../models/Hostinformation')
const error_dto = require('../dto/error_dto')
const {is_valid_user} = require('../util_function/util_function')

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
                    host : user._id,
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

    // =================================================
    // update min reservation date //    
    async update_min_reservation_date(user_dto, host_dto){
        user_dto.validate_token()
        host_dto.validate_min_reservation_date()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const host = await Hostinformation.findOne({
                host : user._id
            })

            if(!host){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 호스트 정보를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // 최소 숙박 일수 수정
            host.min_reservation_date = host_dto.min_reservation_date

            await host.save()

            return {
                code : 200,
                host_state : user.host_state,
                host : host,
                server_state : true
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
    // update max reservation date //  
    async update_max_reservation_date(user_dto, host_dto){
        user_dto.validate_token()
        host_dto.validate_max_reservation_date()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const host = await Hostinformation.findOne({
                host : user._id
            })

            if(!host){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 호스트 정보를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // 최대 숙박 일수 수정
            host.max_reservation_date = host_dto.max_reservation_date

            await host.save()

            return {
                code : 200,
                host_state : user.host_state,
                host : host,
                server_state : true
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
    // update possible date //  
    async update_possible_date(user_dto, host_dto){
        user_dto.validate_token()
        await host_dto.validate_possible_date()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const host = await Hostinformation.findOne({
                host : user._id
            })

            if(!host){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 호스트 정보를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // 예약 가능 기간 수정
            host.possible_date = host_dto.possible_date

            await host.save()

            return {
                code : 200,
                host_state : user.host_state,
                host : host,
                server_state : true
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
    // update reservation deadline //  
    async update_reservation_deadline(user_dto, host_dto){
        user_dto.validate_token()
        await host_dto.validate_reservation_deadline()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const host = await Hostinformation.findOne({
                host : user._id
            })

            if(!host){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 호스트 정보를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // 예약 마감 시한 수정
            host.reservation_deadline = host_dto.reservation_deadline

            await host.save()

            return {
                code : 200,
                host_state : user.host_state,
                host : host,
                server_state : true
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
    // update before date //  
    async update_before_date(user_dto, host_dto){
        user_dto.validate_token()
        await host_dto.validate_before_date()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const host = await Hostinformation.findOne({
                host : user._id
            })

            if(!host){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 호스트 정보를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // 준비 기간 수정
            host.before_date = host_dto.before_date

            await host.save()

            return {
                code : 200,
                host_state : user.host_state,
                host : host,
                server_state : true
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
    // update impossible reservation //  
    async update_impossible_reservation(user_dto, host_dto){
        user_dto.validate_token()
        await host_dto.validate_impossible_reservation()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const host = await Hostinformation.findOne({
                host : user._id
            })

            if(!host){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 호스트 정보를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // 예약 가능일 수정
            host.impossible_reservation = host_dto.impossible_reservation

            await host.save()

            return {
                code : 200,
                host_state : user.host_state,
                host : host,
                server_state : true
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