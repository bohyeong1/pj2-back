const mongoose = require('mongoose')
const {Schema} = mongoose

const reqcountSchema = new Schema({
    userId : {
        type : String,
        required : true 
    },
    email : {
        type : String,
        required : true 
    },
    count : {
        type: Number,
        default : 1 
    },
    createAt : {
        type : Date,
        default : Date.now,
        expires : 3600 * 24 
    },
    requestAt : {
        type: Date
    }
})

const Reqcount = mongoose.model('Reqcount', reqcountSchema)

module.exports = Reqcount
