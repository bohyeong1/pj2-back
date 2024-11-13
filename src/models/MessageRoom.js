const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const messageRoomSchema = new Schema({
    reservation_id : {
        type : ObjectId,
        require : true,
        ref : 'Reservation'
    },

    participants : [
        {
            type : ObjectId,
            require : true,
            ref : 'User'
        }
    ],

    guest_id : {
        type : String,
        require : true
    },

    host_id : {
        type : String,
        require : true
    },

    checkin : {
        type : Date,
        require : true
    },

    checkout : {
        type : Date,
        require : true
    },

    last_message : {
        type : String,
        require : true
    },

    reservation_state : {
        type : String,
        require : true
    },

    reservation_main_img : {
        type : String,
        require : true
    },

    reservation_title : {
        type : String,
        require : true
    },

    create_at : {
        type:Date,
        default:Date.now,
        require : true
    },

    updated_at : {
        type : Date,
        default:Date.now,
        require : true
    }
})

const MessageRoom = mongoose.model('MessageRoom', messageRoomSchema)

module.exports = MessageRoom
