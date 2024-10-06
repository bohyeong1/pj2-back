const form_data = require('form-data')
const Mailgun = require('mailgun.js')
const config = require('../config/env_config')
const mailgun = new Mailgun(form_data)
const error_dto = require('../dto/error_dto')
const User = require('../models/User')
const admin = require('../config/firebase_config')

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
async function is_valid_user(user_dto){
    const real_token = user_dto.token.split(' ')[1]
    const verify_token = await admin.auth().verifyIdToken(real_token)
    const uid = verify_token.uid           
    const user = await User.findOne({firebase_uid: uid})

    if(!user){
        return {
            code : 200,
            user_state : false,
            acc_state : false,
            message : '유효한 토큰이 아닙니다.'
        }
    }

    if(!user.host_state){
        return {
            code : 200,
            user_state : false,
            acc_state : false,
            message : 'host_state가 false인데 숙소 업데이트를 진행하려고 시도하는 중입니다.'
        }
    }

    return {
        user_state : true,
        user : user
    }
}

module.exports = {
    create_code : create_code,
    send_code_email : send_code_email,
    check_object : check_object,
    check_string : check_string,
    check_array : check_array,
    check_integer : check_integer,
    kakao_close_location_fetch : kakao_close_location_fetch,
    get_files_type : get_files_type,
    is_valid_user : is_valid_user
}