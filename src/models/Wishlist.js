const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const wishlistSchema = new Schema({
    accomodation_id : {
        type : ObjectId,
        require : true,
        ref : 'Accomodation'
    },

    user_id : {
        type : ObjectId,
        ref : 'User',
        require : true
    },

    create_at : {
        type:Date,
        default:Date.now
    }
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

module.exports = Wishlist
