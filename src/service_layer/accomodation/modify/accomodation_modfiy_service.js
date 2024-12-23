const Accomodation = require('../../../models/Accomodation')
const error_dto = require('../../../dto/error_dto')
const config = require('../../../config/env_config')
const {is_valid_user} = require('../../../util_function/util_function')
const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')

class accomodation_modfiy_service{
    // =================================================
    // title 수정 //
    async modify_title(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_title()
        accomodation_dto.validate_alter_under_id()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // title 업데이트
            accomodation.title = accomodation_dto.title

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // category 수정 //
    async modify_category(user_dto, accomodation_dto){
        user_dto.validate_token()
        await accomodation_dto.validate_category()
        await accomodation_dto.validate_space_category()
        accomodation_dto.validate_alter_under_id()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // category, space_category 업데이트
            accomodation.category = accomodation_dto.category
            accomodation.space_category = accomodation_dto.space_category

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // service facility 수정 //
    async modify_service_facility(user_dto, accomodation_dto){
        user_dto.validate_token()
        await accomodation_dto.validate_service_facility()
        accomodation_dto.validate_alter_under_id()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // service facility 업데이트
            accomodation.service_facility = accomodation_dto.service_facility

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // keyword 수정 //
    async modify_keyword(user_dto, accomodation_dto){
        user_dto.validate_token()
        await accomodation_dto.validate_keywords()
        accomodation_dto.validate_alter_under_id()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // keywords 업데이트
            accomodation.keywords = accomodation_dto.keywords

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // photo 수정 //
    async modify_photo(user_dto, accomodation_dto, files){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        if(accomodation_dto.main_img){
            accomodation_dto.validate_main_img()
            accomodation_dto.validate_delete_main_img()
        }
        if(accomodation_dto.sub_img){
            accomodation_dto.validate_sub_img()
        }
        if(accomodation_dto.delete_sub_img){
            accomodation_dto.validate_delete_sub_img()
        }

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            const S3 = new AWS.S3({
                endpoint: new AWS.Endpoint(config.ENDPOINT),
                region: 'kr-standard',
                credentials: {
                    accessKeyId: config.ACCESS_KEY,
                    secretAccessKey: config.SECRET_KEY,
                },
            })
        
            let main_img_url = null
            const upload_sub_imgs = []
            let updated_sub_imgs = []

            // main_img upload & delete
            if(accomodation_dto.main_img){
                const image_name = uuidv4()
                await S3.putObject({
                    Bucket: config.BUCKET_NAME,
                    Key: `${image_name}.PNG`,
                    ACL: 'public-read',
                    Body: files.mainImg[0].buffer,
                    ContentType: 'image/png', 
                }).promise()

                const split_url = accomodation_dto.delete_main_img.split('/')
                const main_img_key = split_url[split_url.length-1]

                await S3.deleteObject({
                    Bucket: config.BUCKET_NAME,
                    Key: main_img_key
                }).promise()
    
                main_img_url = `${config.ENDPOINT}/${config.BUCKET_NAME}/${image_name}.PNG`
            }

            // sub_img upload
            if(accomodation_dto.sub_img){
                for(let i = 0; i<files.subImg.length; i++){
                    const image_name = uuidv4()
    
                    await S3.putObject({
                        Bucket: config.BUCKET_NAME,
                        Key: `${image_name}.PNG`,
                        ACL: 'public-read',
                        Body: files.subImg[i].buffer,
                        ContentType: 'image/png', 
                    }).promise()
    
                    upload_sub_imgs.push(`${config.ENDPOINT}/${config.BUCKET_NAME}/${image_name}.PNG`)
                }   
            }

            // sub_img delete
            if(accomodation_dto.delete_sub_img){
                const delete_sub_img = accomodation_dto.delete_sub_img

                for(const file of delete_sub_img){
                    const split_url = file.split('/')
                    const sub_img_key = split_url[split_url.length-1]

                    await S3.deleteObject({
                        Bucket: config.BUCKET_NAME,
                        Key: sub_img_key
                    }).promise()
                }

                updated_sub_imgs = accomodation.sub_img.filter((el)=>{
                    return !delete_sub_img.includes(el)
                })
            }

            const final_sub_img = [...updated_sub_imgs, ...upload_sub_imgs]

            // db img modify
            accomodation.main_img = main_img_url ? main_img_url : accomodation.main_img
            accomodation.sub_img = final_sub_img.length ? final_sub_img : accomodation.sub_img    

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // price 수정 //
    async modify_price(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        if(accomodation_dto.price){
            accomodation_dto.validate_price()
        }
        if(accomodation_dto.price){
            accomodation_dto.validate_addPrice()
        }
        if(accomodation_dto.discount){
            await accomodation_dto.validate_discount()
        }

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // price, add price, discount 업데이트
            accomodation.price = accomodation_dto.price ? accomodation_dto.price : accomodation.price
            accomodation.addPrice = accomodation_dto.addPrice ? accomodation_dto.addPrice : accomodation.addPrice
            accomodation.discount = accomodation_dto.discount ? accomodation_dto.discount : accomodation.discount

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // capacity 수정 //
    async modify_capacity(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        accomodation_dto.validate_capacity()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // capacity 업데이트
            accomodation.capacity = accomodation_dto.capacity

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // summary 수정 //
    async modify_summary(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        accomodation_dto.validate_summary()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // summary 업데이트
            accomodation.summary = accomodation_dto.summary

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // rule 수정 //
    async modify_rule(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        accomodation_dto.validate_rules()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // rule 업데이트
            accomodation.rules = accomodation_dto.rules

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // check in 수정 //
    async modify_checkin(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        if(accomodation_dto.check_in){
            await accomodation_dto.validate_check_in()
        }
        if(accomodation_dto.check_in_method){
            await accomodation_dto.validate_check_in_method()
        }

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }
 
            if(!accomodation_dto.check_in && !accomodation_dto.check_in_method){
                throw new error_dto({
                    code: 401,
                    message: '수정 요청 데이터가 전달되지 않았습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // check in 업데이트
            accomodation.check_time.check_in = accomodation_dto.check_in ? 
                                               accomodation_dto.check_in : 
                                               accomodation.check_time.check_in 
            accomodation.check_method.check_in = accomodation_dto.check_in_method ? 
                                                 accomodation_dto.check_in_method : 
                                                 accomodation.check_method.check_in

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // check out 수정 //
    async modify_checkout(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        if(accomodation_dto.check_out){
            await accomodation_dto.validate_check_out()
        }
        if(accomodation_dto.check_out_method){
            await accomodation_dto.validate_check_out_method()
        }

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }
 
            if(!accomodation_dto.check_out && !accomodation_dto.check_out_method){
                throw new error_dto({
                    code: 401,
                    message: '수정 요청 데이터가 전달되지 않았습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // check out 업데이트
            accomodation.check_time.check_out = accomodation_dto.check_out ? 
                                                accomodation_dto.check_out : 
                                                accomodation.check_time.check_out 
            accomodation.check_method.check_out = accomodation_dto.check_out_method ? 
                                                  accomodation_dto.check_out_method : 
                                                  accomodation.check_method.check_out

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // custom navigation 수정 //
    async modify_custom_navigation(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        accomodation_dto.validate_custom_navigation()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // custom navigaton 업데이트
            accomodation.custom_navigation = accomodation_dto.custom_navigation

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // manual 수정 //
    async modify_manual(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        accomodation_dto.validate_manual()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // manual 업데이트
            accomodation.manual = accomodation_dto.manual

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // comunication 수정 //
    async modify_comunication(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        await accomodation_dto.validate_comunication()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // comunication 업데이트
            accomodation.comunication = accomodation_dto.comunication

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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
    // wifi 수정 //
    async modify_wifi(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        accomodation_dto.validate_wifi_id()
        accomodation_dto.validate_wifi_password()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state: false,
                    error : e
                }) 
            }

            // wifi 업데이트
            accomodation.wifi_information.id = accomodation_dto.wifi_id
            accomodation.wifi_information.password = accomodation_dto.wifi_password

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation,
                server_state : true
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

module.exports = accomodation_modfiy_service