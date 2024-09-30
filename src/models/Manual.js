const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const manualSchema = new Schema({
    accomodation_id : {
        type : ObjectId,
        require : true
    },
    text : {
        type: String,
        required: true
    }
})

const Manual = mongoose.model('Manual', manualSchema)

module.exports = Manual
