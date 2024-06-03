const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const evaluationSchema = new Schema({
    //작성자(구매자)
    writerid : {
        type:ObjectId,
        ref:'User'
    },
    writerNickname:{
        type:String
    },
    writerImg:{
        type:String
    },
    //판매자
    sellerid : {
        type:ObjectId,
        ref:'User'
    },
    //숙소
    homeid : {
        type:ObjectId,
        ref:'Accomodation'
    },
    //작성일
    createAt:{
        type:Date,
        default:Date.now()
    },
    //수정일/ => 디폴트 = 작성일
    lastModifiedAt:{
        type:Date,
        default:Date.now()
    },
    //작성내용
    text:{
        type:String
    },
    //숙소평가
    evaluation:{
        type:Array
    }


})

const Evaluation = mongoose.model('Evaluation', evaluationSchema)

module.exports = Evaluation