const mongoose = require('mongoose')
const {Schema} = mongoose

const structureSchema = new Schema({
    name : {
        type : String,
        require : true
    },
    structure : {
        type : Array,
        require : true
    },
    createAt : {
        type : Date,
        default : Date.now,
    },
    modifyAt : {
        type : Date,
    }
})

const Structure = mongoose.model('Structure', structureSchema)

module.exports = Structure


// const acc_structure = new Structure({
//     name : 'impossible_reservation',
//     structure : [
//         {
//             name : '일요일',
//             data : 0
//         },
//         {
//             name : '월요일',
//             data : 1
//         },
//         {
//             name : '화요일',
//             data : 2
//         },
//         {
//             name : '수요일',
//             data : 3
//         },
//         {
//             name : '목요일',
//             data : 4
//         },
//         {
//             name : '금요일',
//             data : 5
//         },
//         {
//             name : '토요일',
//             data : 6
//         }
//     ]
// })

// acc_structure.save().then(console.log('structure set'))





