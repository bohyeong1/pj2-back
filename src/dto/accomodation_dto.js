const error_dto = require('../dto/error_dto')
const Structure = require('../models/Structure')
const mongoose = require('mongoose')
const _ = require('lodash')
const {check_object, check_string, check_array} = require('../util_function/util_function')

class accomodation_dto{
    constructor(data){ 
        // 구현
        this._id = data._id || null,
        this.acc_step = (data.acc_step >= 0) ? data.acc_step : null,
        this.category = data.category || null
        this.space_category = data.space_category || null
        this.base_facility = data.base_facility || null   
        this.service_facility = data.service_facility || null     
        this.main_adress = data.main_adress || null
        this.sub_adress = data.sub_adress || null
        this.search_adress = data.search_adress || null
        this.main_img = data.main_img || null
        this.sub_img = data.sub_img || null
        this.keywords = data.keywords || null
    }
    // =================================================
    // _id 형식 & 타입검사 & objectId 타입 변환 //
    validate_alter_under_id(){
        if(this._id){
            if(typeof this._id !== 'string'){
                throw new error_dto({
                    code: 401,
                    message: '_id 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 변환
            try{
                this._id = new mongoose.Types.ObjectId(this._id)
            }catch(e){
                throw new error_dto({
                    code: 401,
                    message: '_id가 유효한 ObjectId 형식이 아닙니다.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // sell step 형식 & 타입검사 //
    validate_acc_step(){
        if(this.acc_step >= 0){
            if(typeof this.acc_step !== 'number'){
                throw new error_dto({
                    code: 401,
                    message: 'sell step 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            if(this.acc_step < 0 || this.acc_step > 11){
                throw new error_dto({
                    code: 401,
                    message: 'sell step 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // category 형식 & 타입검사 //
    async validate_category(){
        if(this.category){
            if(typeof this.category !== 'object' || this.category === null || Array.isArray(this.category)){
                throw new error_dto({
                    code: 401,
                    message: 'category 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            const category_structure = await Structure.findOne({
                name : 'category'
            })
            // db에 저장되 있는 category 항목인지 검사
            if(!_.some(category_structure.structure, (item) => {return _.isMatch(item, this.category)})){
                throw new error_dto({
                    code: 401,
                    message: 'category 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // space_category 형식 & 타입검사 //
    async validate_space_category(){
        if(this.space_category){
            if(typeof this.space_category !== 'object' || this.space_category === null || Array.isArray(this.space_category)){
                throw new error_dto({
                    code: 401,
                    message: 'space_category 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            const space_category_structure = await Structure.findOne({
                name : 'space_category'
            })
            // db에 저장되 있는 space_category 항목인지 검사
            if(!_.some(space_category_structure.structure, (item) => {return _.isMatch(item, this.space_category)})){
                console.log(space_category_structure)
                throw new error_dto({
                    code: 401,
                    message: 'space_category 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // base_facility 형식 & 타입검사 //
    async validate_base_facility(){
        if(this.base_facility){
            if(!Array.isArray(this.base_facility) || this.base_facility.length === 0){
                throw new error_dto({
                    code: 401,
                    message: 'base_facility 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 배열 요소 객체인지 검사
            if(!this.base_facility.every((item) => {return typeof item === 'object' && item !== null && !Array.isArray(item)})){
                throw new error_dto({
                    code: 401,
                    message: 'base_facility 배열의 요소들이 객체 타입이 아닙니다',
                    server_state: false
                })
            }

            const base_facility_structure = await Structure.findOne({
                name : 'base_facility'
            })
            // db에 저장되 있는 base_facility 항목인지 검사
            const check_req = _.every(this.base_facility, (ele) => {
                return _.some(base_facility_structure.structure, (el) => {
                    return _.isMatch(el, {name: ele.name, url: ele.url})
                    })
                }
            )
            if(!check_req){
                throw new error_dto({
                    code: 401,
                    message: 'base_facility 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // service_facility 형식 & 타입검사 //
    async validate_service_facility(){
        if(this.service_facility){
            if(!Array.isArray(this.service_facility) || this.service_facility.length === 0){
                throw new error_dto({
                    code: 401,
                    message: 'service_facility 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 배열 요소 객체인지 검사
            if(!this.service_facility.every((el) => {return typeof el === 'object' && el !== null && !Array.isArray(el)})){
                throw new error_dto({
                    code: 401,
                    message: 'service_facility 배열의 요소들이 객체 타입이 아닙니다',
                    server_state: false
                })
            }

            const service_facility_structure = await Structure.findOne({
                name : 'service_facility'
            })
            // db에 저장되 있는 service_facility 항목인지 검사
            const check_req = _.every(this.service_facility, (ele) => {
                return _.some(service_facility_structure.structure, (el) => {
                    return _.isMatch(el, ele)
                    })
                }
            )
            if(!check_req){
                throw new error_dto({
                    code: 401,
                    message: 'service_facility 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // adress 형식 & 타입검사 //
    async validate_adress(){
        if(this.main_adress && this.sub_adress && this.search_adress){
            // 타입 검사
            if(!check_object(this.main_adress) || !check_object(this.sub_adress) || !check_string(this.search_adress)){
                throw new error_dto({
                    code: 401,
                    message: 'adress 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 형식 검사
            if(!check_string(this.main_adress.name) || !check_string(this.sub_adress.name) || !check_array(this.main_adress.coor, 2) || !check_array(this.sub_adress.coor, 2)){
                throw new error_dto({
                    code: 401,
                    message: 'adress의 형식이 잘못 되었습니다.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // main_img 형식 & 타입검사 //
    async validate_main_img(){
        if(this.main_img){
            const file_format = ['image/jpeg', 'image/png', 'image/webp']
            if(!file_format.includes(this.main_img)){
                throw new error_dto({
                    code: 401,
                    message: '이미지 파일은 jpeg, png, webg로 넣어 주세요.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }        
    

    // =================================================
    // sub_img 형식 & 타입검사 //
    async validate_sub_img(){
        if(this.sub_img && Array.isArray(this.sub_img)){
            const file_format = ['image/jpeg', 'image/png', 'image/webp']
            const is_valid_format = this.sub_img.every((el)=>{
                return file_format.includes(el)
            })
            if(!is_valid_format){
                throw new error_dto({
                    code: 401,
                    message: '이미지 파일은 jpeg, png, webg로 넣어 주세요.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // keywords 형식 & 타입검사 //
    async validate_keywords(){
        if(this.keywords){
            if(!Array.isArray(this.keywords) || this.keywords.length === 0){
                throw new error_dto({
                    code: 401,
                    message: 'keywords 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 배열 요소 객체인지 검사
            if(!this.keywords.every((el) => {return typeof el === 'object' && el !== null && !Array.isArray(el)})){
                throw new error_dto({
                    code: 401,
                    message: 'keywords 배열의 요소들이 객체 타입이 아닙니다',
                    server_state: false
                })
            }

            const keywords_structure = await Structure.findOne({
                name : 'keywords'
            })
            // db에 저장되 있는 keywords 항목인지 검사
            const check_req = _.every(this.keywords, (ele) => {
                return _.some(keywords_structure.structure, (el) => {
                    return _.isMatch(el, ele)
                    })
                }
            )

            if(!check_req){
                throw new error_dto({
                    code: 401,
                    message: 'keywords 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 401,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }        
    }
}

module.exports = accomodation_dto
