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
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()

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

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = new Accomodation({
                acc_step : accomodation_dto.acc_step,
                seller : user._id
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
    async regist_lv1(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }
        if(!accomodation_dto.category){
            return {
                code : 200,
                acc_state : false,
                message : 'category 값 없음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        await accomodation_dto.validate_category()

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

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // category 업데이트
            accomodation.category = accomodation_dto.category

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
                server_state: false,
                error : e
            })
        }
    }

    // =================================================
    // 숙소 등록 절차 lv2 //
    async regist_lv2(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }
        if(!accomodation_dto.space_category){
            return {
                code : 200,
                acc_state : false,
                message : 'space_category 값 없음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        await accomodation_dto.validate_space_category()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // space_category 업데이트
            accomodation.space_category = accomodation_dto.space_category

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
                server_state: false,
                error : e
            })
        }

    }

    // =================================================
    // 숙소 등록 절차 lv3 //
    async regist_lv3(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }
        if(accomodation_dto.base_facility.length === 0){
            return {
                code : 200,
                acc_state : false,
                message : 'base_facility 값 없음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        await accomodation_dto.validate_base_facility()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // base_facility 업데이트
            accomodation.base_facility = accomodation_dto.base_facility

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
                server_state: false,
                error : e
            })
        }
    }

    // =================================================
    // 숙소 등록 절차 lv4 //
    async regist_lv4(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }
        if(accomodation_dto.service_facility.length === 0){
            return {
                code : 200,
                acc_state : false,
                message : 'service_facility 값 없음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        await accomodation_dto.validate_service_facility()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // base_facility 업데이트
            accomodation.service_facility = accomodation_dto.service_facility

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
                server_state: false,
                error : e
            })
        }
    }
}

module.exports = accomodation_regist_service