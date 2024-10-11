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
//     name : 'comunication',
//     structure : [
//         {
//             name : '게스트와 직접 만날 수 없으며, 앱을 통해 소통하는 것을 선호합니다.'
//         },
//         {
//             name : '게스트를 직접 맞이하고 인사를 나누는 건 좋지만, 그 외의 시간에는 혼자 있는 것을 선호합니다.'
//         },
//         {
//             name : '사람들과 어울리고 게스트와 함께 시간을 보내는 것을 좋아합니다.'
//         },
//         {
//             name : '크게 상관없습니다. 게스트 의향에 맞추겠습니다.'
//         }
//     ]
// })

// acc_structure.save().then(console.log('structure set'))





