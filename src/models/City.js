const mongoose = require('mongoose')
const {Schema} = mongoose

const citySchema = new Schema({
    city : {
        type:String,
        require : true
    },
    regist_counts : {
        type:Number,
        require : true,
        default : 0
    },
    url:{
        type:String
    }
})

const City = mongoose.model('City', citySchema)

module.exports = City
