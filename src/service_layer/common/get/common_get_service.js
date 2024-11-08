const admin = require('../../../config/firebase_config')
const User = require('../../../models/User')
const Evaluation = require('../../../models/Evaluation')
const Accomodation = require('../../../models/Accomodation')
const error_dto = require('../../../dto/error_dto')
const {get_detail_evaluation} = require('../../../pipelines/accomodation-pipe')
const {get_search_data} = require('../../../util_function/search_function')

class common_get_service{
    // =================================================
    // 숙소 상세 페이지 //
    async common_get_detail_accomodation(accomodation_dto){

        accomodation_dto.validate_alter_under_id()

        try{
            const accomodation = await Accomodation.findOne({_id : accomodation_dto._id}).populate([{
                    path : 'seller',
                    populate : {path : 'host_text'}
                },
                {
                    path : 'navigation_data'
                }
            ])

            const filter_pipe_line = get_detail_evaluation()
            
            const evaluations = await Evaluation.aggregate([
                {$match : {homeid : accomodation_dto._id}},
                ...filter_pipe_line
            ])

            if(accomodation){
                return {
                    server_state : true,
                    code:200,
                    accomodation, 
                    seller : accomodation.seller, 
                    evaluations
                }
            }
            else{
                throw new error_dto({
                    code: 401,
                    message: '유효한 파라미터가 아닙니다.',
                    server_state: false,
                    error : e
                })
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
    // 검색어 출력 //
    async common_get_search_data(search_dto){
        search_dto.validate_input()
        try{
            const result = await get_search_data(search_dto.input)
            
            if(result.length){
                return {
                    server_state : true,
                    code:200,
                    message : '검색어가 존재합니다',
                    result : result
                }
            }
            else{
                return {
                    server_state : true,
                    code:200,
                    message : '검색어가 존재하지 않습니다.',
                    result : null
                }    
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
    // user login, cookies, accomodation 인증 요청 //
    async get_private_one_accomodation(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                user_data : {
                    code : 200,
                    message : '로그인 되어 있지 않습니다.'
                },
                server_state : true,
                log_state : false,
                accomodation : null
            }
        }
        
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    user_data : {
                        code : 200,
                        message : '유효한 토큰이 아닙니다.'
                    },
                    server_state : true,
                    log_state : false,
                    accomodation : null
                }
            }

            const accomodation = await Accomodation.findOne({
                _id : accomodation_dto._id
            }).populate(
                {
                    path : 'seller',
                    populate : {path : 'host_text'}
                }
            )

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
                log_state : true,
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

module.exports = common_get_service