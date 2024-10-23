const admin = require('../config/firebase_config')
const User = require('../models/User')
const Accomodation = require('../models/Accomodation')
const error_dto = require('../dto/error_dto')
const {accomodation_get_local_average_pipe} = require('../pipelines/accomodation-pipe')

class accomodation_get_service{
    // =================================================
    // public get -> acc_id값으로 조회 / common page(client : detail page) get 요청 유저 + 평점 파이프라인 포함 //
    async public_get(){
        
    }

    // =================================================
    // secret get -> user_id 값으로 조회 secret page(client : host page) 요청 //
    async secret_get(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()

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
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                return {
                    code : 200,
                    log_state : false,
                    server_state : true,
                    message : 'accomodation를 찾을 수 없습니다.'
                }
            }

            return {
                code : 200,
                accomodation : accomodation,
                user_data : {
                    user : {
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
                    log_state : true
                },
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
    // secret all get -> user._id 값으로 조회 & host가 등록한 모든 숙소 조회 //
    async secret_all_get(user_dto){
        if(!user_dto._id){
            return {
                code : 200,
                server_state : true,
                log_state : false
            }
        }

        user_dto.validate_alter_under_id()

        try{
            const accomodation = await Accomodation.find({
                seller : user_dto._id
            })

            return {
                code : 200,
                accomodation : accomodation,
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
    // client : regist page, 지역별 숙소 평균 가격 조회 //
    async local_average_get(accomodation_dto){

        accomodation_dto.validate_search_adress()

        try{
            const today_date = new Date()
            const date_range = new Date(today_date.setMonth(today_date.getMonth() - 11))
            const pipe_line = accomodation_get_local_average_pipe(date_range, accomodation_dto.search_adress)
            const accomodation_average = await Accomodation.aggregate([
                ...pipe_line
            ])

            if(!accomodation_average){
                return {
                    code : 200,
                    db_state : false,
                    server_state : true,
                    message : 'accomodation를 찾을 수 없습니다.'
                }
            }

            return {
                code : 200,
                accomodation : accomodation_average,
                server_state : true,
                db_state : true
            }

        }catch(e){
            throw new error_dto({
                code: 401,
                message: 'db 탐색ㅈ중 문제가 발생 하였습니다.',
                server_state: false
            })
        }
    }
}

module.exports = accomodation_get_service