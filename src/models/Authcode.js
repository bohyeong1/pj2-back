const mongoose = require('mongoose')
const {Schema} = mongoose

const authcodeSchema = new Schema({
    code : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    attemp : {
        type : Number,
        default : 0
    },
    createAt : {
        type : Date,
        default : Date.now,
        expires : 600
    }
})

const Authcode = mongoose.model('Authcode', authcodeSchema)

module.exports = Authcode
