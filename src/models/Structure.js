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
//     name : 'discount_date',
//     structure : [
//         {
//             name : '3박 이상',
//             date : 3
//         },
//         {
//             name : '5박 이상',
//             date : 5
//         },
//         {
//             name : '7박 이상',
//             date : 7
//         },
//         {
//             name : '14박 이상',
//             date : 14
//         },
//         {
//             name : '전체 적용',
//             date : -1
//         }
//     ]
// })

// acc_structure.save().then(console.log('structure set'))





