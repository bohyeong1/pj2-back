const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const pathSchema = new Schema({
    accomodation_id : {
        type : ObjectId,
        require : true
    },
    navigation_data : {
        type: Array,
        required: true
    }

})

const Path = mongoose.model('Path', pathSchema)

module.exports = Path




    
