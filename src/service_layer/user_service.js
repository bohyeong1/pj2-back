const admin = require('firebase-admin')
const User = require('../models/User')

class user_service{
    // =================================================
    // get user data //
    async getuser_user(user_dto){
        if(!user_dto){
            throw new Error('파라미터를 넣어주세요')
        }
        user_dto.validate_token()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})
            if(!user){
                throw new Error('유저가 존재하지 않습니다!')
            }
            return {
                code : 200,
                user : {
                    name : user.name,
                    email : user.email,
                    userId : user.userId,
                    isAdmin : user.isAdmin,
                    createdAt : user.createAt,
                    cashInv : user.cashInv,
                    profileImg : user.profileImg,
                    hostText : user.hostText,
                    nickname : user.nickname,
                }
            }
        }catch(e){
            throw new Error(e.massage)
        }
    }
    // =================================================
    // login user cookie에 토큰만 저장 //
    async login_user(user_dto, res){

        if(!user_dto){
            throw new Error('파라미터를 넣어주세요')
        }
        user_dto.validate_token()

        const real_token = user_dto.token

        try{        
        res.cookie('auth-token', real_token, {
            httpOnly : true, 
            secure : false, 
            sameSite : 'Lax', 
            maxAge : 3600000 * 3 //3시간짜ㅣ리
        })

        return {code : 200 , massage : 'login 성공', log_state : true}

        }catch(e){
            throw new Error(e.massage)
        }
    }

    // =================================================
    // user email 인증 //
    async user_email(user_dto){
        if(!user_dto){
            throw new Error('파라미터를 넣어주세요')
        }
        user_dto.validate()
    }

    // =================================================
    // user id 중복체크 //
    async user_duplicate_id(user_dto){
        if(!user_dto){
            throw new Error('파라미터를 넣어주세요')
        }
        user_dto.validate_id()
        
        try{
            const duplicate_user = await User.find({userId:user_dto.userId})
            // 중복체크 실패
            if(duplicate_user.length !== 0){
                return {
                    code : 200,
                    duplicate_text : '사용가능한 아이디 입니다.',
                    duplicate_state : false
                }
            }
            // 중복체크 성공
            else{
                return {
                    code : 200,
                    duplicate_text : '중복된 아이디가 존재합니다.',
                    duplicate_state : true
                }
            }
        }catch(e){
            throw new Error(e.message)
        }
    }
}
const speakeasy = require('speakeasy');

module.exports = user_service