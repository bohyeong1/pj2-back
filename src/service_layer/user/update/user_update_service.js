const admin = require('../../../config/firebase_config')
const User = require('../../../models/User')
const Reqcount = require('../../../models/Reqcount')
const Authcode = require('../../../models/Authcode')
const config = require('../../../config/env_config')
const {create_code} = require('../../../util_function/util_function')
const {send_code_email} = require('../../../util_function/util_function')
const error_dto = require('../../../dto/error_dto')
const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')
const {is_valid_user} = require('../../../util_function/util_function')
const _ = require('lodash')
const Wishlist = require('../../../models/Wishlist')

class user_update_service{
    // =================================================
    // 유저 비밀번호 변경 //
    async update_user_password(user_dto){
        user_dto.validate_token()
        user_dto.validate_password()
        user_dto.validate_password_confirm()
        user_dto.validate_prev_password()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const check_user = await User.findOne({
                userId : user.userId,
                password : user_dto.prev_password
            })   

            if(!check_user){
                throw new error_dto({
                    code: 401,
                    message: '현재 비밀번호가 올바르지 않습니다.',
                    server_state: false,
                    ui_action : 'retry'
                })
            }

            if(!_.isEqual(user, check_user)){
                throw new error_dto({
                    code: 401,
                    message: '현재 비밀번호가 올바르지 않습니다.',
                    server_state: false,
                    ui_action : 'retry'
                })
            }

            user.password = user_dto.password
            await user.save()

            return {
                code : 200,
                message : '비밀번호 변경이 완료되었습니다.',
                server_state : true
            }

        }catch(e){
            if(e instanceof error_dto){
                throw e
            }
            else{
                throw new error_dto({
                    code: 500,
                    message: '서버에서 문제가 발생 하였습니다.',
                    server_state: false,
                    error : e
                })
            }
        }   
    }

    // =================================================
    // 유저 정보 변경 //
    async update_user_information(user_dto, files){
        user_dto.validate_token()
        if(user_dto.profileImg) user_dto.validate_img()
        if(user_dto.delete_prev_img) user_dto.validate_delete_prev_img()        
        if(user_dto.name) user_dto.validate_name()
        if(user_dto.nickname) user_dto.validate_nickname()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            // naver object storage 생성 
            const S3 = new AWS.S3({
                endpoint: new AWS.Endpoint(config.ENDPOINT),
                region: 'kr-standard',
                credentials: {
                    accessKeyId: config.ACCESS_KEY,
                    secretAccessKey: config.SECRET_KEY,
                },
            })
            

            let img_url = null

            // storage 전송  
            // img upload
            if(user_dto.profileImg){
                const image_name = uuidv4()

                await S3.putObject({
                    Bucket: config.BUCKET_NAME,
                    Key: `${image_name}.PNG`,
                    ACL: 'public-read',
                    Body: files[0].buffer,
                    ContentType: 'image/png', 
                }).promise()
    
                img_url = `${config.ENDPOINT}/${config.BUCKET_NAME}/${image_name}.PNG`
            }

            // delete prev img
            if(user_dto.delete_prev_img){
                const split_url = user_dto.delete_prev_img.split('/')
                const img_key = split_url[split_url.length-1]
                console.log('삭제')
                await S3.deleteObject({
                    Bucket: config.BUCKET_NAME,
                    Key: img_key
                }).promise()
            }

            if(user_dto.profileImg){
                user.profileImg = img_url 

            }
            if(user_dto.name) user.name = user_dto.name
            if(user_dto.nickname) user.nickname = user_dto.nickname
            
            await user.save()

            return {
                code : 200,
                message : '내 정보 변경이 완료되었습니다.',
                server_state : true,
                user_data : user
            }
        }catch(e){
            throw new error_dto({
                code: 500,
                message: '서버에서 에러가 발생 하였습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // 유저 찜하기 업데이트 //
    async update_user_wishlist(user_dto, accomodation_dto){
        user_dto.validate_alter_under_id()
        accomodation_dto.validate_alter_under_id()

        try{
            const wishlist = await Wishlist.findOne(
                {
                    user_id : user_dto._id,
                    accomodation_id : accomodation_dto._id
                }
            )
            
            if(wishlist){
                await Wishlist.deleteOne({
                    user_id : user_dto._id,
                    accomodation_id : accomodation_dto._id
                })

                return { 
                    code : 200,
                    server_state : true,
                    wishlist : false
                }
            }
            else{
                const new_wishlist = await Wishlist.create(
                    {
                        user_id : user_dto._id,
                        accomodation_id : accomodation_dto._id
                    }
                )
                return { 
                    code : 200,
                    server_state : true,
                    wishlist : true
                }
            }

        }
        catch(e){
            if(e instanceof error_dto){
                throw e
            }
            else{
                throw new error_dto({
                    code: 500,
                    message: '서버에서 문제가 발생 하였습니다.',
                    server_state: false,
                    error : e
                })
            } 
        }
    }
}

module.exports = user_update_service