const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const hostinformationSchema = new Schema({
    host : {
        type : ObjectId,
        require : true
    },

    host_text : {
        type : String,
        required : true
    },

    min_reservation_date : {
        type : Number,
        default : 2,
        min : 2
    },

    max_reservation_date : {
        type : Number,
        default : 30,
        max : 30
    },

    possible_date : {
        name : {
            type : String,
            default : '6개월 전'
        },
        data : {
            type : Number,
            default : 6
        }
    },

    impossible_reservation :{ 
        type : [
            {
                name : {
                    type : String
                },
                data : {
                    type : Number
                }
            }
        ],
        default : []
    },

    reservation_deadline : {
        name : {
            type : String,
            default : '오전 8시'
        },
        data : {
            type : Number,
            default : 8
        }
    },

    before_date : {
        name : {
            type : String,
            default : '필요 없음'
        },
        data : {
            type : Number,
            default : 0
        }
    },

    refund_rule : {
        title : {
            type : String,
            default : '유연'
        },
        name : {
            type : String,
            default : '게스트가 체크인 하루 전까지 예약을 취소하면 전액 환불됩니다.'
        },
        content : {
            type : Object,
            default : {
                text1 : '게스트는 체크인 24시간 전까지 예약을 취소할 경우 전액 환불받을 수 있으며, 호스트에게는 대금이 지급되지 않습니다.',
                text2 : '그 후에 취소하는 경우, 이미 숙박한 일수와 하루치의 숙박비 전액이 호스트에게 지급됩니다.'
            }
        }
    },

    reservation_rule : {
        type : Boolean,
        default : true
    },

    initial_message : {
        type : String,
        default : '안녕하세요, 반갑습니다! 체크인 시간과 여행목적을 알려주세요!'
    },

    createAt : {
        type : Date,
        default : Date.now
    },

    modifyAt : {
        type: Date
    }
})

const Hostinformation = mongoose.model('Hostinformation', hostinformationSchema)

module.exports = Hostinformation