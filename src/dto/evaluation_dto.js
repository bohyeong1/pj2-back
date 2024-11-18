const error_dto = require('../dto/error_dto')
const {check_object, check_string, check_array, check_integer} = require('../util_function/util_function')
const Structure = require('../models/Structure')
const _ = require('lodash')

class evaluation_dto{
    constructor(data){ 
        this.rating = data.rating || null
        this.text = data.text || null
        this.total_average = data.total_average || null
    }

    // =================================================
    // text 형식 & 타입검사 //
    validate_text(){
        if(this.text){
            if(!check_string(this.text)){
                throw new error_dto({
                    code: 400,
                    message: 'text 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            if(this.text.length > 500){
                throw new error_dto({
                    code: 400,
                    message: 'text 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }
        else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            }) 
        }
    }

    // =================================================
    // rating 형식 & 타입검사 //
    async validate_rating(){
        if(this.rating){
            if(!check_array(this.rating)){
                throw new error_dto({
                    code: 400,
                    message: 'rating 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            if(!this.rating.every((el) => {
                return check_object(el)
            })){
                throw new error_dto({
                    code: 400,
                    message: 'rating 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            const evaluation_structure = await Structure.findOne({
                name : 'evaluation'
            })

            const bool = _.every(evaluation_structure.structure, (el) => {return _.some(this.rating, (ele) => {
                return _.isMatch(el, {
                    name : ele.name,
                    title : ele.title,
                    url : ele.url
                })
            })})

            if(!bool){
                throw new error_dto({
                    code: 400,
                    message: 'rating 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }
        else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            }) 
        }
    }

    // =================================================
    // total_average 형식 & 타입검사 //
    validate_total_average(){
        if(this.total_average){
            if(!check_object(this.total_average)){
                throw new error_dto({
                    code: 400,
                    message: 'total_average 전달 타입이 잘못 되었습니다',
                    server_state: false
                }) 
            }

            let total_rating = 0

            for(const rating of this.rating){
                total_rating += rating.grade
            }
    
            const total_average = total_rating / this.rating.length

            if(this.total_average.grade !== total_average){
                throw new error_dto({
                    code: 400,
                    message: 'total_average 전달 형식이 잘못 되었습니다',
                    server_state: false
                }) 
            }
        }
        else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            }) 
        }
    }
}

module.exports = evaluation_dto
