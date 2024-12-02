const form_data = require('form-data')
const Mailgun = require('mailgun.js')
const config = require('../config/env_config')
const mailgun = new Mailgun(form_data)
const error_dto = require('../dto/error_dto')
const User = require('../models/User')
const admin = require('../config/firebase_config')
const {differenceInHours, differenceInDays} = require('date-fns')

const mg = mailgun.client({
    username : 'api',
    key: config.MAILGUN_KEY})

// =================================================
// email 인증코드 보내기 //
async function send_code_email(email, code){
    try{
        await mg.messages.create('sandboxcb64c97640094e5e8bda7d8cfe968589.mailgun.org', {
            from: "Bohyeong <bohyeongzzang@sandboxcb64c97640094e5e8bda7d8cfe968589.mailgun.org>", 
            to: [email], 
            subject: '보형짱닷컴 Email 인증절차를 진행해 주세요!',
            text: `인증코드 : ${code}`,
            html: `<div>인증코드 : <span style="background-color: gray; color: black; font-weight : bold;">${code}</span></div>`
        })
        console.log('이메일 전송 완료')
    }catch(e){
        console.log(e)
        throw new error_dto({
            code: 401,
            message: '이메일 전송 중 문제가 발생 하였습니다.',
            server_state: false
        }) 
    }
}

// =================================================
// email 인증코드 생성 //
function create_code(){
    function one_code(){
        return String(Math.floor(Math.random()*10))
    }
    return one_code() + one_code() + one_code() + one_code() + one_code() + one_code()
}

// =================================================
// 가까운 지하철 역 & 터미널 조회 api 요청 //
async function kakao_close_location_fetch(url, key){
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `KakaoAK ${key}`,
            KA: 'os=web; origin=https://localhost:3700'
        }
    })
    const data = await response.json()
    return data
}

// =================================================
// object type check //
function check_object(input_data){
    if(typeof input_data === 'object' && input_data !== null && !Array.isArray(input_data)){
        return true
    }else{
        return false
    }
}

// =================================================
// string type check //
function check_string(input_data){
    return typeof input_data === 'string' && input_data.length !== 0
}

// =================================================
// array type check //
function check_array(input_data, length = null){
    if(length === null){
        return Array.isArray(input_data)
    }else{
        return Array.isArray(input_data) && input_data.length === length
    }
}

// =================================================
// date type check //
function check_date(input_data){
    return input_data instanceof Date && !isNaN(input_data)
}

// =================================================
// integer type check //
function check_integer(input_data, start = null, end = null){
    return Number.isInteger(input_data) && 
        (start ? input_data > start : true) &&
        (end ? input_data < end : true)
}

// =================================================
// get file type //
function get_files_type(files){
    const type_inv = []
    if(!Array.isArray(files)){
        throw new error_dto({
            code: 401,
            message: '서버쪽 파라미터에 array타입으로 넣어주세요.',
            server_state: false
        }) 
    }
    for(const file of files){
        const file_type = file.mimetype
        file_type ? type_inv.push(file_type) : type_inv.push(null)
    }

    if(files.length !== type_inv.length){
        throw new error_dto({
            code: 401,
            message: 'get_files_type logic 점검 필요',
            server_state: false
        }) 
    }
    
    return type_inv
}

// =================================================
// cookie를 통한 유저 검사 //
async function is_valid_user(user_dto, user_type = 'all'){
    const real_token = user_dto.token.split(' ')[1]
    const verify_token = await admin.auth().verifyIdToken(real_token)
    const uid = verify_token.uid           
    const user = await User.findOne({firebase_uid: uid})

    if(!user){
        return {
            code : 200,
            user_state : false,
            message : '유효한 토큰이 아닙니다.'
        }
    }

    if(user_type === 'host'){
        if(!user.host_state){
            return {
                code : 200,
                user_state : false,
                message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
            }
        }
    }

    if(user_type !== 'host' && user_type !== 'all'){
        return {
            code : 200,
            user_state : false,
            message : '유효한 토큰이 아닙니다.'
        }
    }

    return {
        user_state : true,
        user : user
    }
}

// =================================================
// 예약 유형 검사 //
function check_reservation_category(category, checkin, total_price, stay_day){

    const today_date = new Date()

    if(category === '유연'){
        if(differenceInHours(checkin, today_date) < 24){
            const difference_in_days = differenceInDays(checkin, today_date) - 1
            const result_price = difference_in_days * (total_price / stay_day)

            return {
                result : total_price + result_price
            }
        }

        return {
            result : total_price
        }
    }
    else if(category === '일반'){
        if(differenceInDays(checkin, today_date) <= 5){
            const difference_in_days = differenceInDays(checkin, today_date) > 0 ? 0 : differenceInDays(checkin, today_date)
            const result_price = (difference_in_days - 1) * (total_price / stay_day)

            return {
                result : total_price + result_price
            }
        }

        return {
            result : total_price
        }
    }
    else if(category === '비교적 엄격'){
        if(differenceInDays(checkin, today_date) <= 14 && differenceInDays(checkin, today_date) > 7){
            return {
                result : total_price +  - (total_price / 2)
            }
        }

        if(differenceInDays(checkin, today_date) < 7){
            return {
                result : 0
            }
        }

        return {
            result : total_price
        }
    }
    else if(category === '엄격'){
        if(differenceInDays(checkin, today_date) > 14 && differenceInHours(checkin, today_date) > 48){
            return {
                result : total_price
            }

        }

        if(differenceInDays(checkin, today_date) < 7){
            return {
                result : 0
            }
        }

        return {
            result : total_price - (total_price / 2)
        }
    }
    else{
        return false
    }
}

// =================================================
// get query case //
function get_query_case(query){
    const match_query = {}       
    const sort_query = {}      
    const limit_query = {}
    const skip_query = {}
    const date_query = {}

    for(const value of Object.keys(query)){
        switch(value){
            case 'limit' :
                limit_query['limit'] = parseInt(query['limit'])
                break

            case 'page' : 
                skip_query['skip'] = (parseInt(query['page']) - 1) * parseInt(query['limit'])
                break

            case 'discount' :
                match_query[value] = {$exists : true}
                break
        
            case 'price-min' :
                match_query['price'] = {
                    ...match_query['price'],
                    $gte : parseInt(query['price-min'])
                }
                break

            case 'price-max' :
                if(query['price-max'] !== '500000'){
                    match_query['price'] = {
                        ...match_query['price'],
                        $lte : parseInt(query['price-max'])
                    }
                }
                break    
            
            case 'search-adress' : 
                match_query['search_adress'] = {$eq : query[value]}
                break

            case 'capacity' :
                match_query[value] = {$gte : query['capacity']}
                break   

            case 'sort' :
                sort_query[value] = query['sort']
                break  
            
            case 'checkin' :
                date_query[value] = query['checkin']
                break
            
            case 'checkout' :
                date_query[value] = query['checkout']
                break

            default :
                match_query[`${value}.name`] = {$all : Array.isArray(query[value]) ? [...query[value]] : [query[value]]}
                break
        }      
    }

    return {
        match_query,
        sort_query,
        limit_query,
        skip_query,
        date_query : Object.keys(date_query).length ? date_query : false
    }
}

module.exports = {
    create_code,
    send_code_email,
    check_object,
    check_string,
    check_array,
    check_integer,
    kakao_close_location_fetch,
    get_files_type,
    is_valid_user,
    check_date,
    check_reservation_category,
    get_query_case
}