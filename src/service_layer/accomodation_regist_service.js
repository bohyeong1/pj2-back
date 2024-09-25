const admin = require('../config/firebase_config')
const User = require('../models/User')
const Accomodation = require('../models/Accomodation')
const error_dto = require('../dto/error_dto')
const config = require('../config/env_config')
const Path = require('../models/Path')
const {kakao_close_location_fetch} = require('../util_function/util_function')
const AWS = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')

class accomodation_regist_service{
    // =================================================
    // 숙소 등록 절차 lv0 //
    async regist_lv0(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})
            if(!user){
                return {
                    code : 200,
                    acc_state : false
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = new Accomodation({
                acc_step : accomodation_dto.acc_step,
                seller : user._id
            })
            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
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
    // 숙소 등록 절차 lv1 //
    async regist_lv1(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }
        if(!accomodation_dto.category){
            return {
                code : 200,
                acc_state : false,
                message : 'category 값 없음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        await accomodation_dto.validate_category()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // category 업데이트
            accomodation.category = accomodation_dto.category

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
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
    // 숙소 등록 절차 lv2 //
    async regist_lv2(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }
        if(!accomodation_dto.space_category){
            return {
                code : 200,
                acc_state : false,
                message : 'space_category 값 없음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        await accomodation_dto.validate_space_category()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // space_category 업데이트
            accomodation.space_category = accomodation_dto.space_category

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
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
    // 숙소 등록 절차 lv3 //
    async regist_lv3(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }
        if(accomodation_dto.base_facility.length === 0){
            return {
                code : 200,
                acc_state : false,
                message : 'base_facility 값 없음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        await accomodation_dto.validate_base_facility()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // base_facility 업데이트
            accomodation.base_facility = accomodation_dto.base_facility

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
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
    // 숙소 등록 절차 lv4 //
    async regist_lv4(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }
        if(accomodation_dto.acc_step < 0){
            return {
                code : 200,
                acc_state : false,
                message : 'acc_step 잘못된 값 넣었음'
            }
        }
        if(accomodation_dto.service_facility.length === 0){
            return {
                code : 200,
                acc_state : false,
                message : 'service_facility 값 없음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        await accomodation_dto.validate_service_facility()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // base_facility 업데이트
            accomodation.service_facility = accomodation_dto.service_facility

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
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
    // 숙소 등록 절차 lv5 //
    async regist_lv5(user_dto, accomodation_dto){
        if(!user_dto.token){
            return {
                code : 200,
                acc_state : false,
                message : 'token 없음'
            }
        }

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        accomodation_dto.validate_adress()

        // error 발생 시 navigation data 삭제
        let navigation = null

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id
            })

            // 좌표 & 키워드
            const longitude = accomodation_dto.main_adress.coor[0]
            const latitude = accomodation_dto.main_adress.coor[1]
            const query = '터미널'

            // 요청할 URL 및 파라미터 설정
            const terminal_url = `https://dapi.kakao.com/v2/local/search/keyword.json?y=${latitude}&x=${longitude}&radius=20000&query=${encodeURIComponent(query)}`
            const subway_url = `https://dapi.kakao.com/v2/local/search/category.json?y=${latitude}&x=${longitude}&radius=20000&category_group_code=SW8`;

            // terminal data api 요청
            const terminal_data = await kakao_close_location_fetch(terminal_url, config.KAKAO_REST_API_KEY)
            const filtered_terminal_data = terminal_data.documents
            .filter((el) => {
                return el.category_name.includes('교통시설 > 고속,시외버스터미널')
            })
            .sort((a, b) => {
                return a.distance - b.distance
            })
            .slice(0,1)

            // subway data api 요청
            const subway_data = await kakao_close_location_fetch(subway_url, config.KAKAO_REST_API_KEY)
            const filtered_subway_data = subway_data.documents
            .sort((a, b) => {
                return a.distance - b.distance
            })
            .slice(0,2)

            // total data
            const total_data = [...filtered_terminal_data, ...filtered_subway_data]

            // navigation path api 요청
            const navigation_inventory = []
            for(const transport_hub of total_data){
                const start_x = transport_hub.x 
                const start_y = transport_hub.y  
                const end_x = accomodation_dto.sub_adress.coor[0] 
                const end_y = accomodation_dto.sub_adress.coor[1] 

                const navigation_url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${start_x},${start_y}&destination=${end_x},${end_y}&priority=RECOMMEND`;

                const navigation_response = await fetch(navigation_url, {
                    method: 'GET',
                    headers: {
                        Authorization: `KakaoAK ${config.KAKAO_REST_API_KEY}`,
                        KA: 'os=web; origin=https://localhost:3700'
                    }
                }) 

                const navigation_data = await navigation_response.json()

                // navigation data 가공
                const created_navigation_data = {
                    name : transport_hub.place_name,
                    distance : navigation_data.routes[0].summary.distance,
                    duration : navigation_data.routes[0].summary.duration,
                    guides : navigation_data.routes[0].sections[0].guides,
                    fare : {
                        taxi : navigation_data.routes[0].summary.fare.taxi,
                        toll : navigation_data.routes[0].summary.fare.toll
                    },
                    bound : navigation_data.routes[0].summary.bound
                }
                navigation_inventory.push(created_navigation_data)
            }

            // navigation data schema 생성
            navigation = new Path({
                accomodation_id : accomodation._id,
                navigation_data : navigation_inventory
            })

            await navigation.save()

            // 가장 짧은 경로 가격&거리 추출
            const near_distance_navigation = navigation_inventory.sort((a,b)=>{
                return a.distance - b.distance
            }).slice(0,1)
            
            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // adress 업데이트
            accomodation.main_adress = accomodation_dto.main_adress
            accomodation.sub_adress = accomodation_dto.sub_adress
            accomodation.search_adress = accomodation_dto.search_adress
            accomodation.navigation_data = navigation._id
            accomodation.distance_information = {distance : near_distance_navigation.distance, duration : near_distance_navigation.duration}

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
            }
        }catch(e){
            // navigation db와 adress db 사이에 error 발생시 navigation db 삭제
            if(navigation){
                await navigation.deleteOne()
            }
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false,
                error : e
            })
        }
    }

    // =================================================
    // 숙소 등록 절차 lv6 //
    async regist_lv6(user_dto, accomodation_dto, files){
        user_dto.validate_id()
        accomodation_dto.validate_alter_under_id()
        accomodation_dto.validate_main_img()
        accomodation_dto.validate_sub_img()

        const user = await User.findOne({userId: user_dto.userId})

        if(!user){
            return {
                code : 200,
                acc_state : false,
                message : '유저를 찾을 수 없습니다.'
            }
        }

        if(!user.host_state){
            return {
                code : 200,
                acc_state : false,
                message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
            }
        }

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
        // main_img
        const image_name = uuidv4()
        await S3.putObject({
            Bucket: config.BUCKET_NAME,
            Key: `${image_name}.PNG`,
            ACL: 'public-read',
            Body: files.mainImg[0].buffer,
            ContentType: 'image/png', 
        }).promise()

        const main_img_url = `${config.ENDPOINT}/${config.BUCKET_NAME}/${image_name}.PNG`
        const sub_img_urls = []

        // sub_img
        for(let i = 0; i<files.subImg.length; i++){
            const image_name = uuidv4()

            await S3.putObject({
                Bucket: config.BUCKET_NAME,
                Key: `${image_name}.PNG`,
                ACL: 'public-read',
                Body: files.subImg[i].buffer,
                ContentType: 'image/png', 
            }).promise()

            sub_img_urls.push(`${config.ENDPOINT}/${config.BUCKET_NAME}/${image_name}.PNG`)
        }   

        // 문자 url db에 저장하기 
        try{
            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(accomodation){
                accomodation.main_img = main_img_url
                accomodation.sub_img = sub_img_urls           

                await accomodation.save()
                
                return {
                    code : 200,
                    host_state : user.host_state,
                    acc_state : true,
                    accomodation : accomodation
                }
            }else{             
                throw new error_dto({
                    code: 401,
                    message: '숙소 정보를 찾을 수 없습니다.',
                    server_state: false
                })
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
    // 숙소 등록 절차 lv7 //
    async regist_lv7(user_dto, accomodation_dto){

        user_dto.validate_token()
        accomodation_dto.validate_acc_step()
        accomodation_dto.validate_alter_under_id()
        await accomodation_dto.validate_keywords()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

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

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // keywords 업데이트
            accomodation.keywords = accomodation_dto.keywords

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
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
    // 숙소 등록 절차 lv8 //
    async regist_lv8(user_dto, accomodation_dto){

        user_dto.validate_token()
        accomodation_dto.validate_title()
        accomodation_dto.validate_capacity()
        accomodation_dto.validate_alter_under_id()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

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

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // title & capacity 업데이트
            accomodation.title = accomodation_dto.title
            accomodation.capacity = accomodation_dto.capacity

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
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
    // 숙소 등록 절차 lv9 //
    async regist_lv9(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_summary()
        accomodation_dto.validate_alter_under_id()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

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

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // summary 업데이트
            accomodation.summary = accomodation_dto.summary

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
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
    // 숙소 등록 절차 lv10 //
    async regist_lv10(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        await accomodation_dto.validate_rules()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    server_state : true,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

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

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // rules 업데이트
            accomodation.rules = accomodation_dto.rules

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                accomodation : accomodation
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
    // 숙소 등록 절차 lv11 //
    async regist_lv11(user_dto, accomodation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        accomodation_dto.validate_price()
        accomodation_dto.validate_addPrice()

        const real_token = user_dto.token.split(' ')[1]
        try{
            const verify_token = await admin.auth().verifyIdToken(real_token)
            const uid = verify_token.uid           
            const user = await User.findOne({firebase_uid: uid})

            if(!user){
                return {
                    code : 200,
                    acc_state : false,
                    server_state : true,
                    message : '유효한 토큰이 아닙니다.'
                }
            }

            if(!user.host_state){
                return {
                    code : 200,
                    acc_state : false,
                    server_state : true,
                    message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
                }
            }

            const accomodation = await Accomodation.findOne({
                seller : user._id,
                _id : accomodation_dto._id
            })

            if(!accomodation){
                throw new error_dto({
                    code: 401,
                    message: '해당되는 숙소를 찾지 못했습니다.',
                    server_state : true,
                    acc_state : false,
                    error : e
                }) 
            }

            // 업데이트 단계 업데이트
            accomodation.acc_step = accomodation.acc_step !== accomodation_dto.acc_step ? 
            accomodation_dto.acc_step : accomodation.acc_step

            // price && addPrice && 숙소 업데이트 과정 완료
            accomodation.price = accomodation_dto.price
            accomodation.addPrice = accomodation_dto.addPrice
            accomodation.regist_state = true

            await accomodation.save()

            return {
                code : 200,
                host_state : user.host_state,
                acc_state : true,
                server_state : true,
                accomodation : accomodation
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

module.exports = accomodation_regist_service