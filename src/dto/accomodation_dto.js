const error_dto = require('../dto/error_dto')
const Structure = require('../models/Structure')
const mongoose = require('mongoose')
const _ = require('lodash')
const {check_object, check_string, check_array, check_integer} = require('../util_function/util_function')
const config = require('../config/env_config')

class accomodation_dto{
    constructor(data){ 
        this._id = data._id || null
        this.acc_step = (data.acc_step >= 0) ? data.acc_step : null
        this.category = data.category || null
        this.space_category = data.space_category || null
        this.base_facility = data.base_facility || null   
        this.service_facility = data.service_facility || null     
        this.main_adress = data.main_adress || null
        this.sub_adress = data.sub_adress || null
        this.search_adress = data.search_adress || null
        this.main_img = data.main_img || null
        this.delete_main_img = data.delete_main_img || null
        this.sub_img = data.sub_img || null
        this.delete_sub_img = data.delete_sub_img || null
        this.keywords = data.keywords || null
        this.title = data.title || null
        this.capacity = data.capacity || null
        this.summary = data.summary || null
        this.rules = data.rules || null
        this.price = data.price || null
        this.addPrice = data.addPrice || null
        this.discount = data.discount || null
    }

    // =================================================
    // _id 형식 & 타입검사 & objectId 타입 변환 //
    validate_alter_under_id(){
        if(this._id){
            if(typeof this._id !== 'string'){
                throw new error_dto({
                    code: 400,
                    message: '_id 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 변환
            try{
                this._id = new mongoose.Types.ObjectId(this._id)
            }catch(e){
                throw new error_dto({
                    code: 400,
                    message: '_id가 유효한 ObjectId 형식이 아닙니다.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
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
                    code: 400,
                    message: 'sell step 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            if(this.acc_step < 0 || this.acc_step > 11){
                throw new error_dto({
                    code: 400,
                    message: 'sell step 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
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
                    code: 400,
                    message: 'category 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            const category_structure = await Structure.findOne({
                name : 'category'
            })

            // db에 저장되 있는 category 항목인지 검사
            if(!_.some(category_structure.structure, (el) => {return _.isEqual(el, this.category)})){
                throw new error_dto({
                    code: 400,
                    message: 'category 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
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
                    code: 400,
                    message: 'space_category 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            const space_category_structure = await Structure.findOne({
                name : 'space_category'
            })
            // db에 저장되 있는 space_category 항목인지 검사
            if(!_.some(space_category_structure.structure, (el) => {return _.isMatch(el, this.space_category)})){

                throw new error_dto({
                    code: 400,
                    message: 'space_category 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
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
                    code: 400,
                    message: 'base_facility 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 배열 요소 객체인지 검사
            if(!this.base_facility.every((el) => {return typeof el === 'object' && el !== null && !Array.isArray(item)})){
                throw new error_dto({
                    code: 400,
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
                    code: 400,
                    message: 'base_facility 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
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
                    code: 400,
                    message: 'service_facility 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 배열 요소 객체인지 검사
            if(!this.service_facility.every((el) => {return typeof el === 'object' && el !== null && !Array.isArray(el)})){
                throw new error_dto({
                    code: 400,
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
                    return _.isMatch(ele, el)
                    })
                }
            )
            if(!check_req){
                throw new error_dto({
                    code: 400,
                    message: 'service_facility 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
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
                    code: 400,
                    message: 'adress 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 형식 검사
            if(!check_string(this.main_adress.name) || !check_string(this.sub_adress.name) || !check_array(this.main_adress.coor, 2) || !check_array(this.sub_adress.coor, 2)){
                throw new error_dto({
                    code: 400,
                    message: 'adress의 형식이 잘못 되었습니다.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // search adress 형식 & 타입검사 //
    validate_search_adress(){
        if(this.search_adress){
            // 타입 검사
            if(!check_string(this.search_adress)){
                throw new error_dto({
                    code: 400,
                    message: 'search_adress 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // main_img 형식 & 타입검사 //
    validate_main_img(){
        if(this.main_img){
            const file_format = ['image/jpeg', 'image/png', 'image/webp']
            if(!file_format.includes(this.main_img)){
                throw new error_dto({
                    code: 400,
                    message: '이미지 파일은 jpeg, png, webg로 넣어 주세요.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }    

    // =================================================
    // delete_main_img 형식 & 타입검사 //
    validate_delete_main_img(){
        if(this.delete_main_img){
            const file_format = ['PNG', config.ENDPOINT, config.BUCKET_NAME]
            if(!file_format.every((el)=>{
                return  this.delete_main_img.includes(el)
            })){
                throw new error_dto({
                    code: 400,
                    message: '이미지 파일은 jpeg, png, webg로 넣어 주세요.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }
    
    
    // =================================================
    // sub_img 형식 & 타입검사 //
    validate_sub_img(){
        if(this.sub_img && Array.isArray(this.sub_img)){
            const file_format = ['image/jpeg', 'image/png', 'image/webp']
            const is_valid_format = this.sub_img.every((el)=>{
                return file_format.includes(el)
            })
            if(!is_valid_format){
                throw new error_dto({
                    code: 400,
                    message: '이미지 파일은 jpeg, png, webg로 넣어 주세요.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // delete_sub_img 형식 & 타입검사 //
    validate_delete_sub_img(){
        if(this.delete_sub_img && check_array(this.delete_sub_img) && this.delete_sub_img.length){
            const file_format = ['PNG', config.ENDPOINT, config.BUCKET_NAME]
            const is_valid_format = this.delete_sub_img.every((el)=>{
                return file_format.every((ele)=>{
                    return el.includes(ele)
                })
            })

            if(!is_valid_format){
                throw new error_dto({
                    code: 400,
                    message: '이미지 파일은 jpeg, png, webg로 넣어 주세요.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
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
                    code: 400,
                    message: 'keywords 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            // 배열 요소 객체인지 검사
            if(!this.keywords.every((el) => {return check_object(el)})){
                throw new error_dto({
                    code: 400,
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
                    return _.isMatch(ele, el)
                    })
                }
            )

            if(!check_req){
                throw new error_dto({
                    code: 400,
                    message: 'keywords 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }        
    }

    // =================================================
    // title 형식 & 타입검사 //
    validate_title(){
        if(this.title){
            if(!check_string(this.title)){
                throw new error_dto({
                    code: 400,
                    message: 'title 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            const title_rgx = /^[가-힣a-zA-Z0-9][가-힣a-zA-Z0-9\s]{0,18}[가-힣a-zA-Z0-9]$/
            if(!title_rgx.test(this.title)){
                throw new error_dto({
                    code: 400,
                    message: `title은 시작점과 끝지점 공백이 불가하고, 
                              1 ~ 20글자 완성된 문자 + 특수문자 사용이 불가합니다.`,
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        } 
    }

    // =================================================
    // capacity 형식 & 타입검사 //
    validate_capacity(){
        if(this.capacity){
            if(!check_integer(this.capacity, 0, 31)){
                throw new error_dto({
                    code: 400,
                    message: 'capacity 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        } 
    }

    // =================================================
    // summary 형식 & 타입검사 //
    validate_summary(){
        if(this.summary){
            if(this.summary.trim().length === 0){
                throw new error_dto({
                    code: 400,
                    message: 'summary 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
            if(!check_string(this.summary)){
                throw new error_dto({
                    code: 400,
                    message: 'summary 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        } 
    }

    // =================================================
    // rules 형식 & 타입검사 //
    async validate_rules(){
        if(this.rules && this.rules.length === 5){
            if(!check_array(this.rules, 5) || !this.rules.every((el)=>{return check_object(el)})){
                throw new error_dto({
                    code: 400,
                    message: 'rules 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }

            const rules_structure = await Structure.findOne({
                name : 'rules'
            })

            // db에 저장되 있는 rules 항목인지 검사
            const check_req = _.every(this.rules, (ele) => {
                const is_match_structure = _.some(rules_structure.structure, (el) => {
                    return _.isMatch(el, {text : ele.text, name : ele.name})
                })

                const req_type = typeof ele.state === 'boolean'
                const req_summary = !ele.hasOwnProperty('summary') || typeof ele.summary === 'string'

                return is_match_structure && req_type && req_summary
            })

            if(!check_req){
                throw new error_dto({
                    code: 400,
                    message: 'rules 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        } 
    }

    // =================================================
    // price 형식 & 타입검사 //
    validate_price(){
        if(this.price){
            if(!check_integer(this.price)){
                throw new error_dto({
                    code: 400,
                    message: 'price 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            if(String(this.price).length > 6){
                throw new error_dto({
                    code: 400,
                    message: 'price 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        } 
    }

    // =================================================
    // addPrice 형식 & 타입검사 //
    validate_addPrice(){
        if(this.addPrice){
            if(!check_integer(this.addPrice)){
                throw new error_dto({
                    code: 400,
                    message: 'addPrice 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            if(String(this.addPrice).length > 6){
                throw new error_dto({
                    code: 400,
                    message: 'addPrice 전달 형식이 잘못 되었습니다',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        } 
    }

    // =================================================
    // discount 형식 & 타입검사 //
    async validate_discount(){
        if(this.discount){
            if(!check_object(this.discount)){
                throw new error_dto({
                    code: 400,
                    message: 'discount 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            if(!this.discount.rate || !this.discount.date){
                throw new error_dto({
                    code: 400,
                    message: 'discount 의 key가 정확하지 않습니다.',
                    server_state: false
                })
            }

            if(!check_integer(this.discount.rate) || 
               !check_object(this.discount.date) ||
               !check_integer(this.discount.date.date) ||
               !check_string(this.discount.date.name)){
                throw new error_dto({
                    code: 400,
                    message: 'discount 의 value의 타입이 잘못 되었습니다.',
                    server_state: false
                })
            }

            const discount_date_structure = await Structure.findOne({
                name : 'discount_date'
            })

            if(this.discount.rate > 50 || this.discount.rate < 0 || !_.some(discount_date_structure.structure, (el)=>{
                return _.isEqual(el, this.discount.date)
            })){
                throw new error_dto({
                    code: 400,
                    message: 'discount 의 value의 형식이 잘못 되었습니다.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        } 
    }
}

module.exports = accomodation_dto
