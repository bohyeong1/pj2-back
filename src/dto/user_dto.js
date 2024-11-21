const error_dto = require('../dto/error_dto')
const mongoose = require('mongoose')
const config = require('../config/env_config')
const {check_object, check_string, check_array, check_integer} = require('../util_function/util_function')

// ***********************************************************
// e-mail 형식은 종류가 많고 복잡하므로 express validator로 검사!

class user_dto{
    constructor(data){ 
        this.token = data.token || null
        this.userId = data.userId || null 
        this._id = data._id || null
        this.password = data.password || null
        this.password_confirm = data.password_confirm || null
        this.prev_password = data.prev_password || null
        this.name = data.name || null
        this.nickname = data.nickname || null
        this.defaultProfile = data.defaultProfile || null
        this.profileImg = data.profileImg || null
        this.host_text = data.host_text || null
        this.delete_prev_img = data.delete_prev_img || null

        this.email = data.email || null
        this.isAdmin = data.isAdmin || null
        this.cashInv = data.cashInv || null
        this.hostText = data.hostText || null
        this.code = data.code || null
    }

    // =================================================
    // token 형식 & 타입검사 //
    validate_token(){        
        if(this.token){
            if(typeof this.token !== 'string'){
                throw new Error('token 전달 타입이 잘못 되었습니다')
            }
            if(!this.token.startsWith('Bearer ')){
                throw new Error('token 전달 형식이 잘못 되었습니다.')
            }
        }else{
            throw new Error('token data가 없습니다.')
        }
    }

    // =================================================
    // id 타입 & 형식검사 //
    validate_id(){
        if(!this.userId){
            throw new Error('userId data가 없습니다.')
        }
        if(typeof this.userId !== 'string'){
            throw new Error('userId  타입이 잘못 되었습니다.')
        }
        const id_rgx = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{7,15}$/
        if(!id_rgx.test(this.userId)){
            throw new Error('아이디는 7~15자 + 알파벳(+숫자)으로 구성되어야 됩니다.')
        }
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
    // nickname 타입 & 형식검사 //
    validate_nickname(){
        if(!this.nickname){
            throw new Error('userId data가 없습니다.')
        }
        if(typeof this.nickname !== 'string'){
            throw new Error('userId  타입이 잘못 되었습니다.')
        }
        const nick_rgx = /^[a-zA-Z0-9가-힣]+$/
        if(!nick_rgx.test(this.nickname)){
            throw new Error('닉네임은 한글, 영어, 숫자로 작성해 주세요.')
        }
    }

    // =================================================
    // defaultProfile 형식 & 타입검사 //
    validate_default_profile(){
        if(!this.defaultProfile){
            throw new Error('default profile data가 없습니다.')
        }
        if(typeof this.defaultProfile !== 'string'){
            throw new Error('default profile 타입이 잘못 되었습니다.')
        }
        if(this.defaultProfile.length !== 7){
            throw new Error('default profile은 7글자로 작성되어야 합니다.')
        }
    }

    // =================================================
    // prev_password type & form 체크 //
    validate_prev_password(){
        if(!this.prev_password){
            throw new error_dto({
                code: 401,
                message: 'prev_password data가 없습니다.',
                server_state: false
            })
        }
        if(!check_string(this.prev_password)){
            throw new error_dto({
                code: 401,
                message: 'prev_password type이 잘못되었습니다.',
                server_state: false
            })
        }
        const password_rgx =  /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/
        if(!password_rgx.test(this.prev_password)){
            throw new error_dto({
                code: 401,
                message: '비밀번호는 8~15자 + 최소 한개의 특수문자를 포함하여야 합니다.',
                server_state: false
            })
        }

        if(this.prev_password === this.password){
            throw new error_dto({
                code: 401,
                message: '기존의 비밀번호와 일치하는 비밀번호를 설정할 수 없습니다.',
                server_state: false,
                ui_action : 'retry'
            })
        }
    }

    // =================================================
    // password type & form 체크 //
    validate_password(){
        if(!this.password){
            throw new Error('password data가 없습니다.')
        }
        if(typeof this.password !== 'string'){
            throw new Error('password type이 잘못되었습니다.')
        }
        const password_rgx =  /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/
        if(!password_rgx.test(this.password)){
            throw new Error('비밀번호는 8~15자 + 최소 한개의 특수문자를 포함하여야 합니다.')
        }
    }

    // =================================================
    // 비밀번호 확인 type & form 체크 //
    validate_password_confirm(){
        if(!this.password_confirm){
            throw new error_dto({
                code: 401,
                message: 'password_confirm data가 없습니다.',
                server_state: false
            })
        }
        if(typeof this.password_confirm !== 'string'){
            throw new error_dto({
                code: 401,
                message: 'password_confirm type이 잘못되었습니다.',
                server_state: false
            })
        }
        if(this.password_confirm !== this.password){
            throw new error_dto({
                code: 401,
                message: '비밀번호가 일치하지 않습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // name type & form 체크 //
    validate_name(){
        if(!this.name){
            throw new Error('name data가 없습니다.')
        }
        if(typeof this.name !== 'string'){
            throw new Error('name type이 잘못되었습니다.')
        }
        const name_rgx = /^[가-힣a-zA-Z]{1,20}$/
        if(!name_rgx.test(this.name)){
            throw new Error('이름은 1~20자 영어 또는 한글로 작성되어야 합니다.')
        }
    }

    // =================================================
    // 이미지 전체가 아닌 mimetype meta data만 파라미터로 받ㄷ기 //
    validate_img(){
        if(!this.profileImg){
            throw new Error('이미지 파일을 넣어주세요.')
        }
        const file_format = ['image/jpeg', 'image/png', 'image/webp']
        if(!file_format.includes(this.profileImg)){
            throw new Error('이미지 파일은 jpeg, png, webg로 넣어 주세요.')
        }
    }
    
    // =================================================
    // delete img 형식 & 타입검사 //
    validate_delete_prev_img(){
        if(this.delete_prev_img){
            const file_format = ['PNG', config.ENDPOINT, config.BUCKET_NAME]
            if(!file_format.every((el)=>{
                return  this.delete_prev_img.includes(el)
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
    // 초기 회원가입 id & password & name 타입 & 형식검사 //
    validate_initial_join(){
        if(!this.userId || !this.password || !this.name) {
            throw new Error('회원가입에 필요한 데이터가 없습니다. userId, password, name이 필요합니다.');
        }
        // id 타입 & 형식 검사
        this.validate_id()
        // 비밀번호 타입 형식검사
        this.validate_password()
        // 비밀번호 확인 타입 형식검사
        this.validate_password_confirm()
        // 이름 타입 형식검사
        this.validate_name()
    }   

    // =================================================
    // host_text 타입 & 형식검사 //
    validate_host_text(){
        if(!this.host_text){
            throw new Error('호스트 소개 문구를 작성해 주세요.')
        }
        if(typeof this.host_text !== 'string'){
            throw new Error('호스트 소개 문구는 문자열로 작성해 주세요.')
        }
    }
}

module.exports = user_dto
