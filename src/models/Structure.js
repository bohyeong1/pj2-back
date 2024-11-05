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
//     name : 'refund_rule',
//     structure : [
//         {
//             title :'유연',
//             name : '게스트가 체크인 하루 전까지 예약을 취소하면 전액 환불됩니다.',
//             content : [
//                 '게스트는 체크인 24시간 전까지 예약을 취소할 경우 전액 환불받을 수 있으며, 호스트에게는 대금이 지급되지 않습니다.',
//                 '그 후에 취소하는 경우, 이미 숙박한 일수와 하루치의 숙박비 전액이 호스트에게 지급됩니다.'
//             ]
//         },
//         {
//             title :'일반',
//             name : '게스트가 체크인 5일 전까지 예약을 취소하면 전액 환불됩니다.',
//             content : [
//                 '게스트가 체크인 5일 전까지 예약을 취소한다면 전액 환불받을 수 있으며, 호스트에게는 대금이 지급되지 않습니다.',
//                 '그 후에 취소하는 경우, 이미 숙박한 일수와 하루치의 숙박비 전액이 호스트에게 지급됩니다.'
//             ]
//         },
//         {
//             title :'비교적 엄격',
//             name : '게스트가 체크인 14일 전까지 예약을 취소하면 전액 환불됩니다.',
//             content : [
//                 '게스트는 체크인까지 14일 이상 남은 시점에 예약을 취소해야 전액 환불을 받을 수 있습니다.',
//                 '체크인까지 7~14일이 남은 시점에 예약을 취소하면, 숙박비의 50%가 호스트에게 지급됩니다.',
//                 '체크인까지 7일이 채 남지 않은 시점에 예약을 취소하면, 숙박비 전액이 호스트에게 지급됩니다.'
//             ]
//         },
//         {
//             title :'엄격',
//             name : '게스트가 예약 후 48시간 이내에 취소하고 체크인까지 14일 이상 남은 경우 전액 환불됩니다.',
//             content : [
//                 '게스트는 예약 후 48시간 이내에 취소하고 체크인까지 14일 이상이 남은 경우에만 전액 환불을 받을 수 있습니다.',
//                 '체크인까지 7~14일이 남은 시점에 예약을 취소하면, 숙박비의 50%가 호스트에게 지급됩니다.',
//                 '체크인까지 7일이 채 남지 않은 시점에 예약을 취소하면, 숙박비 전액이 호스트에게 지급됩니다.'
//             ]
//         }
//     ]
// })

// acc_structure.save().then(console.log('structure set'))





