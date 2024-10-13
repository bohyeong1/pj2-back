const admin = require('../../../config/firebase_config')
const User = require('../../../models/User')
const Evaluation = require('../../../models/Evaluation')
const Accomodation = require('../../../models/Accomodation')
const error_dto = require('../../../dto/error_dto')
const {get_detail_evaluation} = require('../../../pipelines/accomodation-pipe')
const e = require('express')

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
}

module.exports = common_get_service