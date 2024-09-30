const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const customPathSchema = new Schema({
    accomodation_id : {
        type : ObjectId,
        require : true
    },
    navigation_data : {
        type: String,
        required: true
    }
})

const CustomPath = mongoose.model('CustomPath', customPathSchema)

module.exports = CustomPath
