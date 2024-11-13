const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const messageSchema = new Schema({
    room_id : {
        type : ObjectId,
        require : true,
        ref : 'MessageRoom'
    },

    sender_id : {
        type : ObjectId,
        ref : 'User',
        require : true
    },

    content : {
        type : String,
        require : true
    },

    create_at : {
        type:Date,
        default:Date.now
    }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
