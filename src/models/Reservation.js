const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const reservaitonSchema = new Schema({
    //판매자
    seller:{
        type:ObjectId,
        require:true,
        ref:'User'
    },
    //구매자
    buyer:{
        type:ObjectId,
        require:true,
        ref:'User'
    },  
    // 찾아오는 길
    navigation_date : {
        type: Array,
        required: true
    },
    //해당숙소
    accomodation:{
        type:ObjectId,
        ref:'Accomodation',
        require : true
    },       
    //최종가격
    total_price:{
        type:Number,
        require : true
    },
    //수용 인원
    capacity:{
        type:Number,
        require : true
    },
    //숙박 이용 기간
    stay_day:{
        type: Number,
        require : true
    },
    //체크인
    checkin : {
        type : Date,
        require : true
    },
    // 체크아웃
    checkout : {
        type : Date,
        require : true
    },
    // 준비 기간 포함 시작일
    final_start_date : {
        type : Date,
        require : true
    },
    // 준비 기간 포함 종료일
    final_end_date : {
        type : Date,
        require : true
    },
    //예약 상태  
    reservation_state:{
        type:String,
        require:true
    },
    // 사용 상태
    use_state : {
        type : Boolean,
        default : false,
        require : true
    },
    //예약일시
    create_at:{
        type : Date,
        default : Date.now,
        require : true
    },
    // 결제 날짜
    payment_at:{
        type:Date
    },
    // 환불 날짜
    refund_at:{
        type:Date
    },
    // 이용완료 날짜
    completed_use_at:{
        type:Date
    }
})

const Reservaiton = mongoose.model('Reservation', reservaitonSchema)

module.exports = Reservaiton    