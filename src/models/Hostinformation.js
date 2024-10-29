const mongoose = require('mongoose')
const {Schema} = mongoose

const hostinformationSchema = new Schema({
    userId : {
        type : String,
        require : true
    },
    host_text : {
        type : String,
        required : true
    },
    impossible_date : {
        type : Date
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