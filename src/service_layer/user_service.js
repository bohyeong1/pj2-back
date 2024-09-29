const admin = require('../config/firebase_config')
const User = require('../models/User')
const Reqcount = require('../models/Reqcount')
const Authcode = require('../models/Authcode')
const config = require('../config/env_config')
const {create_code} = require('../util_function/util_function')
const {send_code_email} = require('../util_function/util_function')
const error_dto = require('../dto/error_dto')
const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')

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
                return {
                    code : 200,
                    log_state : false
                }
            }
        }catch(e){
            throw new Error(e.massage)
        }   
    }

    // =================================================
    // 사용자 기본 정보 제공 && 로그인 유지 //
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
                return {
                    code : 200,
                    log_state : false
                }
            }
            return {
                code : 200,
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
            }
        }catch(e){
            throw new Error(e.massage)
        }
    }

    // =================================================
    // user token 업데이트 //
    async update_user_token(user_dto, res){
        if(!user_dto.token){
            return {
                code : 200,
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
                sameSite : 'none'
            })
            return({
                code:200,
                log_state : true,
                message : 'token값 업데이트'
            })
        }catch(e){
            throw new error_dto({
                code: 401,
                message: 'cookie 저장 중 오류가 발생하였습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // user nickname 업데이트 //
    async update_nickname(user_dto){
        if(!user_dto.nickname || !user_dto.userId || !user_dto.defaultProfile){
            return {
                code : 200,
                log_state : false
            }
        }

        user_dto.validate_id()
        user_dto.validate_nickname()
        user_dto.validate_default_profile()

        try{
            const user = await User.findOne({
                userId : user_dto.userId
            })
            if(user){
                user.nickname = user_dto.nickname
                user.defaultProfile = user_dto.defaultProfile
                await user.save()
                return {
                    code : 200,
                    duplicate_text : 'nickname 업데이트 성공',
                    log_state : true,
                    user : user
                }
            }else{
                return {
                    code : 200,
                    duplicate_text : 'id값이 정확하지 않습니다.',
                    log_state : false
                }
            }
        }catch(e){
            throw e
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
        if(!user_dto.userId){
            return {
                code : 200, 
                massage : 'login 실패', 
                log_state : false
            }
        }
        user_dto.validate_token()
        user_dto.validate_id()

        const real_token = user_dto.token

        try{        
            res.cookie('auth_token', real_token, {
                path:'/',
                httpOnly : true, 
                secure : true, 
                sameSite : 'none'
            })

            const user = await User.findOne({
                userId : user_dto.userId
            })

            if(user){
                return {
                    code : 200, 
                    massage : 'login 성공', 
                    log_state : true,
                    userId : user.userId
                }
            }else{
                return {
                    code : 200, 
                    massage : 'login 실패', 
                    log_state : false
                }
            }
        }catch(e){
            throw new Error(e.massage)
        }
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

    
    // =================================================
    // user email 코드 발급 //
    async verification_code(user_dto){
        if(!user_dto.email){
            return {
                code : 200, 
                massage : '이메일을 입력해 주세요.', 
                code_state : false
            }
        }

        // 코드 발급 회수 체크
        const req_count = await Reqcount.findOne({userId : user_dto.userId})

        try{
            // 처음 인증 코드 발급 시 or 하루 지낫을 시
            if(!req_count){
                // 하루 3번 인증 db 생성
                const new_req_count = await Reqcount.create({
                    userId : user_dto.userId,
                    email : user_dto.email,
                    requestAt : Date.now()
                })

                // 인증코드 생성
                const injung_code = create_code()

                // 1번의 인증당 3번의 기회 db 생성
                const new_auth_code = await Authcode.create({
                    code : injung_code,
                    email : user_dto.email
                })

                // email 발송
                await send_code_email(user_dto.email, injung_code)

                return {
                    code : 200,
                    message : `이메일 인증 코드 발급이 성공하였습니다. 요청회수 ${new_req_count.count}/3`,
                    code_state : true,
                    count : new_req_count.count
                }
            }
            // 2번째 부터
            else{
                // 아이디당 코드 발급 3회 초과 시
                if(req_count.count >= 3){
                    return {
                        code : 200,
                        message : '아이디 당 코드 발급 회수는 1일 3회로 제한되어 있습니다. 3/3',
                        code_state : false
                    }
                }

                req_count.requestAt = Date.now()
                req_count.count += 1
                // 인증코드 생성
                const injung_code = create_code()

                const auth_code = await Authcode.findOne({email : user_dto.email})

                // 새로운 이메일로 인증 코드 발급 시
                if(!auth_code){
                    req_count.email = user_dto.email
                    const new_auth_code = await Authcode.create({
                        code : injung_code,
                        email : user_dto.email
                    })
                }
                // 기존 이메일로 인증 코드 재발급 시
                else{
                    auth_code.createAt = Date.now()
                    auth_code.code = injung_code
                    await auth_code.save()
                }
                await req_count.save()

                // email 발송
                await send_code_email(user_dto.email, injung_code)

                return {
                    code : 200,
                    message : `이메일 인증 코드 발급이 성공하였습니다. 요청회수 ${req_count.count}/3`,
                    code_state : true,
                    count : req_count.count
                }
            }
        }
        catch(e){
            throw new error_dto({
                code: 401,
                message: 'DB 업데이트 중 문제가 발생 하였습니다.',
                server_state: false
            })
        }
    }


    // =================================================
    // user email 인증 //
    async user_email(user_dto){
        if(!user_dto.email){
            return {
                code : 200, 
                massage : '이메일을 입력해 주세요.', 
                code_state : false
            }
        }
        if(!user_dto.code){
            return {
                code : 200, 
                massage : '코드를 입력해 주세요.', 
                code_state : false
            }
        }
        if(!user_dto.userId){
            return {
                code : 200, 
                massage : '로그인을 해주세요.', 
                code_state : false
            }
        }

        try{
            const auth_code = await Authcode.findOne({
                email : user_dto.email
            })
            // 인증 시간 초과 시
            if(!auth_code){
                return {
                    code : 200,
                    message : '인증 시간을 초과하셨습니다.',
                    code_state : false,
                }
            }

            // 인증회수 3회 초과 시
            if(auth_code.attemp >= 3){
                return {
                    code : 200,
                    message : '인증 시도가 3회를 초과하셨습니다. 3/3',
                    code_state : false,
                    count : auth_code.attemp
                }
            }

            auth_code.attemp += 1

            // 인증번호 일치
            if(auth_code.code === user_dto.code){
                const user = await User.findOne({
                    userId : user_dto.userId
                })
                console.log(user)
                if(user){
                    user.email = user_dto.email

                    await user.save()
    
                    await Authcode.deleteOne({
                        email: user_dto.email
                    })
                    return {
                        code : 200,
                        message : `이메일 인증이 완료되었습니다. 요청회수 ${auth_code.attemp}/3`,
                        code_state : true
                    }
                }else{
                    return {
                        code : 200,
                        message : `로그인 후 이용해 주세요.`,
                        code_state : false
                    }
                }
            }
            // 인증번호 불일치
            else{
                await auth_code.save()
                return {
                    code : 200,
                    message : `올바른 인증코드를 입력해 주세요. 요청회수 ${auth_code.attemp}/3`,
                    code_state : false,
                    count : auth_code.attemp
                }
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
    // user img, nickname update //
    async user_profile(user_dto, files){
        if(!user_dto.userId){
            return {
                code : 200, 
                massage : '로그인을 해 주세요.', 
                code_state : false
            }
        }
        if(!user_dto.nickname){
            return {
                code : 200, 
                massage : '닉네임을 입력해 주세요.', 
                code_state : false
            }
        }
        if(!files){
            return {
                code : 200, 
                massage : '이미지를 등록해 주세요.', 
                code_state : false
            }
        }

        user_dto.validate_id()
        user_dto.validate_nickname()
        user_dto.validate_img()
      
        // naver object storage 생성
        const S3 = new AWS.S3({
            endpoint: new AWS.Endpoint(config.ENDPOINT),
            region: 'kr-standard',
            credentials: {
              accessKeyId: config.ACCESS_KEY,
              secretAccessKey: config.SECRET_KEY,
            },
          })    
    
        // storage 전송      
        const image_name = uuidv4()

        await S3.putObject({
            Bucket: config.BUCKET_NAME,
            Key: `${image_name}.PNG`,
            ACL: 'public-read',
            Body: files.buffer,
            ContentType: 'image/png',
        }).promise()
      
        const image_url = `${config.ENDPOINT}/${config.BUCKET_NAME}/${image_name}.PNG` ///유저 이미지 데이터 url값 저장 
    
        // 문자 url db에 저장하기 
        try{
            const user = await User.findOne({
                userId : user_dto.userId
            })

            if(user){
                user.profileImg = image_url || null
                user.nickname = user_dto.nickname            

                await user.save()

                return{
                    code:200,
                    code_state : true,
                    message:'이미지 저장 성공'
                }
            }else{             
                return{
                    code : 200, 
                    massage : '유저를 찾을 수 없습니다.', 
                    code_state : false
                }
            }    
        }catch(e){
            throw new error_dto({
                code: 401,
                message: 'db 업데이트 중 문제가 발생 하였습니다.',
                server_state: false
            })
        }

    }
}



module.exports = user_service