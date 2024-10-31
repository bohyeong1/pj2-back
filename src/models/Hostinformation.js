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