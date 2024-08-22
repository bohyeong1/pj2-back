const form_data = require('form-data')
const Mailgun = require('mailgun.js')
const config = require('../config/env_config')
const mailgun = new Mailgun(form_data)
const error_dto = require('../dto/error_dto')

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





module.exports = {
    create_code : create_code,
    send_code_email : send_code_email
}