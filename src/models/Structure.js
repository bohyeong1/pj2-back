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
//     name : 'rules',
//     structure : [
//         {text:'반려동물 동반 가능',
//         name:'aniaml',
//         state:null,
//         count:0},
        
//         {text:'이벤트 허용',
//         name:'event',
//         state:null},

//         {text:'흡연, 베이핑, 전자담배 허용',
//         name:'vaping',
//         state:null},

//         {text:'상업적 사진 및 동영상 촬영 허용',
//         name:'recoding',
//         state:null,
//         },

//         {text:'추가 규칙',
//         name:'addrule',
//         state:null,
//         summary:''},
//     ]
// })

// acc_structure.save().then(console.log('structure set'))





