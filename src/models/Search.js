const mongoose = require('mongoose')

const {Schema} = mongoose
const {Types:{ObjectId}} = Schema


const searchSchema = new Schema({
    city : {
        type:String,
        require : true
    },
    regist_counts : {
        type:Number,
        require : true,
        default : 0
    }
    ,
    url:{
        type:String
    },

    search_counts : {
        type : Number,
        require : true,
        default : 0
    },
    url:{
        type:String
    }

})

const Search = mongoose.model('Search', searchSchema)

module.exports = Search
