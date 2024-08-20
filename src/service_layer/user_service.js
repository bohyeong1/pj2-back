const admin = require('../config/firebase_config')
const User = require('../models/User')
const config = require('../config/env_config')
const speakeasy = require('speakeasy')

class user_service{
    // =================================================
    // 사용자 정보까지는 필요하지 않는 심플한 로그인 유지 //
    async maintain_user(user_dto){
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
            if(verify_token && uid){
                return {
                    code : 200,
                    log_state : true
                }
            }
            else{
                throw new Error('mongoDB와 firebase token간에 연동 로직 잘못 작성되었을듯')
            }
        }catch(e){
            throw new Error(e.massage)
        }   
    }

    // =================================================
    // 사용자 상세정보 주는 로그인 유지 //
    async getuser_user(user_dto){
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
                throw new Error('token과 user mongoDB 연동 문제')
            }
            return {
                code : 200,
                user : {
                    name : user.name || null,
                    email : user.email || null,
                    userId : user.userId || null,
                    isAdmin : user.isAdmin || null,
                    createdAt : user.createAt || null,
                    cashInv : user.cashInv || null,
                    profileImg : user.profileImg || null,
                    hostText : user.hostText || null,
                    nickname : user.nickname || null,
                },
                log_state : true
            }
        }catch(e){
            throw new Error(e.massage)
        }
    }

    // =================================================
    // login user cookie에 토큰만 저장 //
    async login_user(user_dto, res){
        if(!user_dto.token){
            return {
                code : 200, 
                massage : 'login 실패', 
                log_state : false
            }
        }
        user_dto.validate_token()

        const real_token = user_dto.token

        try{        
            res.cookie('auth_token', real_token, {
                path:'/',
                httpOnly : true, 
                secure : true, 
                sameSite : 'none', 
                maxAge : 3600000 * 3 //3시간짜ㅣ리
            })

            return {
                code : 200, 
                massage : 'login 성공', 
                log_state : true
            }

        }catch(e){
            throw new Error(e.massage)
        }
    }

    // =================================================
    // user email 인증 //
    async user_email(user_dto){
        if(!user_dto.email){
            throw new Error('파라미터를 넣어주세요')
        }
        user_dto.validate()
    }

    // =================================================
    // user id 중복체크 //
    async user_duplicate_id(user_dto){
        if(!user_dto.userId){
            return {
                code : 200,
                duplicate_text : '아이디를 입력해 주세요',
                duplicate_state : false
            }
        }
        user_dto.validate_id()
        
        try{
            const duplicate_user = await User.find({userId : user_dto.userId})
            // 중복체크 실패
            if(duplicate_user.length !== 0){
                return {
                    code : 200,
                    duplicate_text : '중복된 아이디가 존재합니다.',
                    duplicate_state : false,
                    userId : user_dto.userId
                }
            }
            // 중복체크 성공
            else{
                return {
                    code : 200,
                    duplicate_text : '사용가능한 아이디 입니다.',
                    duplicate_state : true,
                    userId : user_dto.userId
                }
            }
        }catch(e){
            throw new Error(e.message)
        }
    }

    // =================================================
    // user 초기 회원가입 //
    async user_initial_join(user_dto){
        if(!user_dto.userId || !user_dto.password || !user_dto.name || !user_dto.password_confirm){
            return {
                code : 200,
                message : '정보를 모두 넣어주세요',
                join_state : false
            }
        }
        user_dto.validate_initial_join()

        try{
            // firebase 유저 데이터 생성
            const firebase_user = await admin.auth().createUser({
                email : user_dto.userId + config.MAPPING_EMAIL,
                password : user_dto.password
            })

            // mongo db user data 생성
            if(firebase_user){
                const user = new User({
                    userId : user_dto.userId,
                    password : user_dto.password,
                    name : user_dto.name,
                    firebase_uid : firebase_user.uid
                })

                const newUser = await user.save()

                if(newUser){
                    return {
                        code : 200,
                        message : 'db, firebase 데이터 업데이트 완료',
                        join_state : true
                    }
                }else{
                    // db update 실패 시 파베 계정 삭제
                    await admin.auth().deleteUser(firebase_user.uid)
                    return {
                        code : 200,
                        message : 'db 데이터 업데이트 실패',
                        join_state : false
                    }
                }
            }else{
                return {
                    code : 200,
                    message : 'firebase 데이터 업데이트 실패',
                    join_state : false
                }
            }
        }catch(e){
            throw e
        }
    }
}



module.exports = user_service