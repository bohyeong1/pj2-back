const mongoose = require('mongoose')

const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const accomodationSchema = new Schema({

})

const Accomodation = mongoose.model('Accomodation', accomodationSchema)

module.exports = Accomodation